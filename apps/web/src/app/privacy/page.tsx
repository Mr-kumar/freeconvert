"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const lastUpdated = "January 1, 2025";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[hsl(var(--muted-foreground))]">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                1. Introduction
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                At FreeConvert, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, store, and protect your
                data when you use our file conversion services.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                2. Information We Collect
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We collect the following types of information:
              </p>

              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2 mb-4">
                <li>Email address (when creating an account)</li>
                <li>Name and contact information (for premium users)</li>
                <li>
                  Payment information (processed securely by third parties)
                </li>
                <li>Files you upload for conversion</li>
              </ul>

              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                2.2 Automatically Collected Information
              </h3>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>IP address and location data</li>
                <li>Browser type and operating system</li>
                <li>Usage statistics and service interaction data</li>
                <li>Device information and identifiers</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>To provide and maintain our file conversion services</li>
                <li>To process and complete your file conversions</li>
                <li>To improve our services and user experience</li>
                <li>
                  To communicate with you about service updates and support
                </li>
                <li>To ensure security and prevent fraudulent activities</li>
                <li>To comply with legal obligations</li>
                <li>To analyze usage patterns and optimize performance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                4. File Processing and Storage
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                Your files are handled with the utmost care and security:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Files are encrypted during transmission and processing</li>
                <li>
                  Files are temporarily stored only as long as necessary for
                  conversion
                </li>
                <li>
                  All files are automatically deleted from our servers within 24
                  hours
                </li>
                <li>
                  We do not access, view, or analyze the content of your files
                </li>
                <li>Processing occurs on secure servers with limited access</li>
                <li>No backup copies of user files are maintained</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                5. Data Security
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>SSL/TLS encryption for all data transmissions</li>
                <li>
                  Secure server infrastructure with regular security updates
                </li>
                <li>Access controls and authentication systems</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Compliance with data protection regulations</li>
                <li>Employee training on data privacy and security</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve our services and user experience</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-4">
                You can control cookies through your browser settings, but
                disabling cookies may affect some features of our service.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                7. Third-Party Services
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We use third-party services for:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Analytics and performance monitoring</li>
                <li>Email delivery and communication</li>
                <li>Cloud hosting and infrastructure</li>
              </ul>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mt-4">
                These third parties have their own privacy policies and are
                contractually obligated to protect your data.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                8. Your Rights and Choices
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your account and associated data</li>
                <li>Restriction of processing in certain circumstances</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
                <li>Withdrawal of consent where applicable</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                9. Data Retention
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We retain your data for the following periods:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Uploaded files: Automatically deleted within 24 hours</li>
                <li>
                  Account information: Retained while your account is active
                </li>
                <li>
                  Usage analytics: Retained for 12 months in anonymized form
                </li>
                <li>Legal records: Retained as required by applicable laws</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                Your data may be transferred to and processed in countries other
                than your own. We ensure appropriate safeguards are in place for
                international data transfers, including standard contractual
                clauses and compliance with applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                11. Children's Privacy
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If we become aware that we have collected
                such information, we will take steps to delete it immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date. Your continued use of our
                services after any changes constitutes acceptance of the new
                policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                13. Contact Information
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or want to
                exercise your data rights, please contact us:
              </p>
              <div className="grid gap-4 sm:gap-6 grid-cols-1">
                <p className="text-[hsl(var(--muted-foreground))]">
                  <strong>Email:</strong> privacy@freeconvert.com
                </p>
                <p className="text-[hsl(var(--muted-foreground))]">
                  <strong>Website:</strong> https://freeconvert.com
                </p>
                <p className="text-[hsl(var(--muted-foreground))]">
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
