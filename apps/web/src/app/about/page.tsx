"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Github, Linkedin, Code, Users, Target } from "lucide-react";

const teamMembers = [
  {
    name: "Uday Bhaskar",
    role: "Founder & Owner",
    description:
      "Visionary entrepreneur with a passion for creating innovative digital solutions. Uday founded FreeConvert with the mission to make file conversion accessible to everyone.",
    avatar: "UB",
    email: "uday@freeconvert.com",
    skills: ["Business Strategy", "Product Vision", "User Experience"],
  },
  {
    name: "Manish Kumar",
    role: "Lead Developer",
    description:
      "Full-stack developer with expertise in web technologies and cloud architecture. Manish is responsible for the technical implementation and continuous improvement of FreeConvert's platform.",
    avatar: "MK",
    email: "manish@freeconvert.com",
    skills: ["React/Next.js", "Node.js", "Cloud Architecture", "UI/UX Design"],
  },
] as const;

const companyValues = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "User-Centric",
    description:
      "We put our users first, building tools that solve real problems and provide exceptional value.",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Technical Excellence",
    description:
      "We maintain high standards of code quality, security, and performance in everything we build.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Accessibility",
    description:
      "We believe powerful tools should be accessible to everyone, regardless of technical expertise or budget.",
  },
] as const;

const milestones = [
  {
    year: "2024",
    title: "Foundation",
    description:
      "FreeConvert was founded with a clear mission to simplify file conversion for everyone.",
  },
  {
    year: "2025",
    title: "Platform Launch",
    description:
      "Launched our comprehensive web platform with advanced PDF and image conversion tools.",
  },
  {
    year: "Present",
    title: "Growing Community",
    description:
      "Serving thousands of users worldwide with reliable, fast, and secure file conversion services.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl">
            About FreeConvert
          </h1>
          <p className="mt-4 text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto">
            We're on a mission to make file conversion simple, fast, and
            accessible to everyone. Founded by passionate individuals who
            believe in the power of technology to solve everyday problems.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                To provide the most reliable, user-friendly, and comprehensive
                file conversion platform that empowers individuals and
                businesses to work more efficiently with digital content.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-[hsl(var(--foreground))]">
            Meet Our Team
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="border border-[hsl(var(--border))] shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-[hsl(var(--primary))] text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                        {member.name}
                      </h3>
                      <p className="text-sm text-[hsl(var(--primary))] font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                        {member.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-xs font-medium text-[hsl(var(--foreground))] mb-2">
                          Expertise:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-[hsl(var(--muted))] text-xs text-[hsl(var(--muted-foreground))] rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sm text-[hsl(var(--primary))] hover:underline"
                        >
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-[hsl(var(--foreground))]">
            Our Values
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
            {companyValues.map((value, index) => (
              <Card
                key={index}
                className="border border-[hsl(var(--border))] text-center"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-[hsl(var(--foreground))]">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[hsl(var(--border))]"></div>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`w-full sm:w-5/12 ${index % 2 === 0 ? "text-right pr-0 sm:pr-8" : "text-left pl-0 sm:pl-8"}`}
                >
                  <Card className="border border-[hsl(var(--border))] shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-sm font-semibold text-[hsl(var(--primary))] mb-1">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[hsl(var(--primary))] rounded-full border-4 border-white"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center p-8 bg-[hsl(var(--muted))]/40 rounded-xl">
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">
            Get in Touch
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-6">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="mailto:contact@freeconvert.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-md hover:opacity-90 transition-opacity"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
