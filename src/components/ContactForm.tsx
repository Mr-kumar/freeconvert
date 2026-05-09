"use client";

import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Send } from "lucide-react";
import { stripHtml } from "@/lib/sanitize";

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loadTime] = useState(() => Date.now());
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const elapsed = Date.now() - loadTime;
    const honeypot = String(formData.get("honeypot") || "");
    const accessKey =
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (honeypot || elapsed < 3000) {
      return;
    }

    if (siteKey && !captchaToken) {
      setStatus("Please complete the captcha.");
      return;
    }

    if (!accessKey) {
      const name = encodeURIComponent(stripHtml(String(formData.get("name") || "")));
      const email = encodeURIComponent(stripHtml(String(formData.get("email") || "")));
      const message = encodeURIComponent(
        stripHtml(String(formData.get("message") || "")),
      );
      window.location.href = `mailto:hello@freeconvert.in?subject=FreeConvert message from ${name}&body=${message}%0A%0AReply to: ${email}`;
      return;
    }

    formData.append("access_key", accessKey);
    formData.append("from_name", "FreeConvert Contact");

    if (captchaToken) {
      formData.append("h-captcha-response", captchaToken);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("Message sent.");
        setCaptchaToken("");
        form.reset();
      } else {
        setStatus("Could not send the message. Email hello@freeconvert.in.");
      }
    } catch {
      setStatus("Could not send the message. Email hello@freeconvert.in.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <input
        autoComplete="off"
        className="hidden"
        name="honeypot"
        tabIndex={-1}
        type="text"
      />
      <label className="field-label">
        Name
        <input className="field-input" name="name" required />
      </label>
      <label className="field-label">
        Email
        <input className="field-input" name="email" required type="email" />
      </label>
      <label className="field-label">
        Message
        <textarea className="field-input min-h-40 resize-y" name="message" required />
      </label>
      {siteKey ? (
        <HCaptcha
          sitekey={siteKey}
          theme="light"
          onExpire={() => setCaptchaToken("")}
          onVerify={(token) => setCaptchaToken(token)}
        />
      ) : null}
      <button
        className="button-primary"
        disabled={Boolean(siteKey && !captchaToken)}
        type="submit"
      >
        <Send className="h-4 w-4" />
        Send
      </button>
      {status ? (
        <p className="text-sm font-semibold text-[var(--accent)]">{status}</p>
      ) : null}
    </form>
  );
}
