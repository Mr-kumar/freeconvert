"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "month",
    features: ["5 daily conversions", "50 MB max file size", "Standard support"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 9,
    period: "month",
    features: ["Unlimited conversions", "5 GB max file size", "Priority support", "No ads"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
] as const;

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading">
      <p className="text-sm font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
        Pricing
      </p>
      <h2
        id="pricing-heading"
        className="mt-1 text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]"
      >
        Flexible plans for everyone
      </h2>
      <div className="mx-auto mt-6 grid max-w-2xl gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`rounded-xl shadow-sm transition-shadow hover:shadow-md ${
              plan.highlighted ? "border-2 border-[hsl(var(--primary))]" : ""
            }`}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                {plan.name}
              </h3>
              <p className="mt-2 text-2xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">
                  /{plan.period}
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant={plan.highlighted ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
