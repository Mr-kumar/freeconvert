"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const lastUpdated = "January 1, 2025";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-[hsl(var(--muted-foreground))]">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                By accessing and using FreeConvert ("the Service"), you accept
                and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                2. Description of Service
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                FreeConvert is an online file conversion service that allows
                users to convert, edit, and manipulate various file formats
                including PDFs, images, and other document types. Our service
                includes:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>File format conversion</li>
                <li>PDF merging and splitting</li>
                <li>Image compression and optimization</li>
                <li>Document editing tools</li>
                <li>Batch processing capabilities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                3. User Responsibilities
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                As a user of FreeConvert, you agree to:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Use the service for lawful purposes only</li>
                <li>
                  Not upload files containing viruses, malware, or malicious
                  code
                </li>
                <li>
                  Not upload copyrighted material without proper authorization
                </li>
                <li>
                  Not use the service to violate any applicable laws or
                  regulations
                </li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not interfere with or disrupt the service or servers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                4. Privacy and Data Protection
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We are committed to protecting your privacy and data security:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>
                  Files are processed securely using industry-standard
                  encryption
                </li>
                <li>
                  We do not store your files longer than necessary for
                  processing
                </li>
                <li>
                  Files are automatically deleted from our servers after
                  processing
                </li>
                <li>
                  We do not sell or share your personal information with third
                  parties
                </li>
                <li>Our complete privacy policy is available at /privacy</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                5. Intellectual Property Rights
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                Regarding intellectual property:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>
                  You retain ownership of all files you upload to our service
                </li>
                <li>
                  FreeConvert retains all rights to the service, technology, and
                  intellectual property
                </li>
                <li>
                  You may not copy, modify, or distribute our service without
                  permission
                </li>
                <li>
                  We respect copyright laws and comply with DMCA takedown
                  notices
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                6. Paid Services and Subscriptions
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                For our paid services:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>
                  Subscription fees are charged in advance on a monthly or
                  annual basis
                </li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are available within 30 days of purchase</li>
                <li>Prices are subject to change with 30 days notice</li>
                <li>
                  Payment processing is handled by secure third-party providers
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                7. Service Availability and Limitations
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                We strive to provide reliable service, but please note:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>
                  The service is provided "as is" without warranties of any kind
                </li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>
                  Free users have daily conversion limits and file size
                  restrictions
                </li>
                <li>
                  We may temporarily suspend service for maintenance or updates
                </li>
                <li>We are not liable for any loss of data or files</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                8. Prohibited Content
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                The following content is strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-[hsl(var(--muted-foreground))] space-y-2">
                <li>Illegal content or activities</li>
                <li>Adult content or sexually explicit material</li>
                <li>Content that violates copyright or trademark laws</li>
                <li>Content that promotes hate speech or discrimination</li>
                <li>
                  Content that contains personal information of others without
                  consent
                </li>
                <li>
                  Content that violates any applicable laws or regulations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                9. Termination
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                We reserve the right to terminate or suspend access to our
                service immediately, without prior notice or liability, for any
                reason whatsoever, including without limitation if you breach
                the Terms. Upon termination, your right to use the Service will
                cease immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                In no event shall FreeConvert, its directors, employees,
                partners, agents, suppliers, or affiliates be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                use of the service.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                11. Governing Law
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the
                jurisdiction in which FreeConvert operates, without regard to
                conflict of law provisions. Any disputes arising from these
                terms will be resolved through arbitration in accordance with
                applicable laws.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the service after any changes constitutes acceptance of the
                new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--border))]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-4">
                13. Contact Information
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="grid gap-4 sm:gap-6 grid-cols-1">
                <p className="text-[hsl(var(--muted-foreground))]">
                  <strong>Email:</strong> legal@freeconvert.com
                </p>
                <p className="text-[hsl(var(--muted-foreground))]">
                  <strong>Website:</strong> https://freeconvert.com
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
