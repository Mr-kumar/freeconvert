"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for occasional use",
    features: [
      "5 daily conversions",
      "50 MB max file size",
      "Standard support",
      "Basic PDF tools",
      "Watermark on some outputs",
    ],
    limitations: [
      "Limited file formats",
      "No priority processing",
      "Basic compression",
    ],
    cta: "Get started",
    highlighted: false,
    popular: false,
  },
  {
    name: "Pro",
    price: 9,
    period: "month",
    description: "For professionals and regular users",
    features: [
      "Unlimited conversions",
      "5 GB max file size",
      "Priority support",
      "No watermarks",
      "Advanced PDF tools",
      "Batch processing",
      "No ads",
      "Faster processing",
      "All file formats",
    ],
    limitations: [],
    cta: "Start Pro trial",
    highlighted: true,
    popular: true,
  },
  {
    name: "Business",
    price: 29,
    period: "month",
    description: "For teams and businesses",
    features: [
      "Everything in Pro",
      "20 GB max file size",
      "Team collaboration",
      "API access",
      "Custom branding",
      "Priority queue",
      "24/7 support",
      "Usage analytics",
      "Multiple user accounts",
    ],
    limitations: [],
    cta: "Contact sales",
    highlighted: false,
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Everything in Business",
      "Unlimited file size",
      "Unlimited users",
      "On-premise option",
      "SLA guarantee",
      "Dedicated support",
      "Custom integrations",
      "Advanced security",
      "Compliance features",
    ],
    limitations: [],
    cta: "Contact enterprise",
    highlighted: false,
    popular: false,
  },
] as const;

const FAQ = [
  {
    question: "Can I change or cancel my plan anytime?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and never store your files longer than necessary. All data is processed securely.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team.",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-xl text-[hsl(var(--muted-foreground))]">
            Choose the perfect plan for your needs. Start free and upgrade as
            you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 sm:gap-8 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative rounded-xl shadow-sm transition-all hover:shadow-lg ${
                plan.highlighted
                  ? "border-2 border-[hsl(var(--primary))] scale-105"
                  : "border border-[hsl(var(--border))]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-[hsl(var(--primary))] text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold">
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                  </span>
                  {plan.period && (
                    <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">
                      /{plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  className="w-full mb-6"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-[hsl(var(--foreground))]">
                    Features:
                  </div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        {feature}
                      </span>
                    </div>
                  ))}

                  {plan.limitations.length > 0 && (
                    <>
                      <div className="text-sm font-medium text-[hsl(var(--foreground))] mt-4">
                        Limitations:
                      </div>
                      {plan.limitations.map((limitation) => (
                        <div
                          key={limitation}
                          className="flex items-start gap-2"
                        >
                          <div className="h-4 w-4 text-gray-400 mt-0.5 shrink-0">
                            •
                          </div>
                          <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            {limitation}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-[hsl(var(--foreground))]">
            Frequently asked questions
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1">
            {FAQ.map((item, index) => (
              <Card key={index} className="border border-[hsl(var(--border))]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-[hsl(var(--muted))]/40 rounded-xl">
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">
            Join thousands of users who trust FreeConvert for their file
            conversion needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start free trial</Button>
            <Button size="lg" variant="outline">
              Contact sales
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
