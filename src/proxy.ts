import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed the middleware convention to proxy.ts.
// Keep this file in src/proxy.ts so it runs at the same level as src/app.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_CLEANUP_EVERY = 100;

let localRateLimitRequests = 0;
let remoteRateLimiterPromise: Promise<{
  limit: (identifier: string) => Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }>;
}> | null = null;

const maliciousPatterns = [
  /\.\.\//,
  /<script/i,
  /javascript:/i,
  /union.*select/i,
  /\x00/,
  /eval\(/i,
  /(^|\/)\.env(?:[./?#]|$)/i,
  /(^|\/)\.git(?:[/?#]|$)/i,
  /wp-admin/i,
  /phpinfo/i,
];

function decodeURLPart(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isMalicious(url: URL) {
  const full = `${url.pathname}${url.search}`;
  const decoded = decodeURLPart(full);
  const doubleDecoded = decodeURLPart(decoded);

  return [full, decoded, doubleDecoded].some((candidate) =>
    maliciousPatterns.some((pattern) => pattern.test(candidate)),
  );
}

function getIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function getLocalRateLimitInfo(ip: string) {
  // Local fallback only. Production should use Upstash so limits are shared
  // across serverless instances and survive cold starts.
  const now = Date.now();
  localRateLimitRequests += 1;

  if (localRateLimitRequests % RATE_LIMIT_CLEANUP_EVERY === 0) {
    for (const [key, record] of rateLimitMap) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return {
      allowed: true,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX - 1,
      reset: now + RATE_LIMIT_WINDOW,
    };
  }

  record.count += 1;

  return {
    allowed: record.count <= RATE_LIMIT_MAX,
    limit: RATE_LIMIT_MAX,
    remaining: Math.max(RATE_LIMIT_MAX - record.count, 0),
    reset: record.resetTime,
  };
}

async function getRateLimitInfo(ip: string) {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    remoteRateLimiterPromise ??= Promise.all([
      import("@upstash/ratelimit"),
      import("@upstash/redis"),
    ]).then(([{ Ratelimit }, { Redis }]) =>
      new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, "1 m"),
        analytics: true,
        prefix: "freeconvert_rl",
      }),
    );

    const ratelimit = await remoteRateLimiterPromise;
    const result = await ratelimit.limit(ip);

    return {
      allowed: result.success,
      limit: RATE_LIMIT_MAX,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  return getLocalRateLimitInfo(ip);
}

function addSecurityHeaders(response: NextResponse, remaining: number) {
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
}

export async function proxy(request: NextRequest) {
  if (isMalicious(request.nextUrl)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const ip = getIp(request);
  const rateLimit = await getRateLimitInfo(ip);

  if (!rateLimit.allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(
          Math.max(Math.ceil((rateLimit.reset - Date.now()) / 1000), 1),
        ),
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  const response = NextResponse.next();
  addSecurityHeaders(response, rateLimit.remaining);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|manifest.webmanifest|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|map|txt)$).*)",
  ],
};
