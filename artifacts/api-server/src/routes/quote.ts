import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { db, quoteRequestsTable } from "@workspace/db";

const router: IRouter = Router();

// ── Brevo HTTP API sender ─────────────────────────────────────────────────────
async function sendViaBrevo(opts: {
  to: string;
  replyTo: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}): Promise<void> {
  const apiKey = process.env["BREVO_API_KEY"];
  if (!apiKey) throw new Error("BREVO_API_KEY not set");

  // Must be an address that appears under Senders in the Brevo account, which
  // is NOT the same thing as the SMTP login (`SMTP_USER`). Sending from the SMTP
  // login gets rejected, and because email failures here are non-fatal that
  // showed up as leads silently arriving without a notification.
  const senderEmail = process.env["BREVO_SENDER_EMAIL"];
  if (!senderEmail) throw new Error("BREVO_SENDER_EMAIL not set");

  const payload = {
    sender: { name: "ALAA AGRO Website", email: senderEmail },
    to: [{ email: opts.to }],
    replyTo: { email: opts.replyTo },
    subject: opts.subject,
    htmlContent: opts.htmlContent,
    textContent: opts.textContent,
  };

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`Brevo API ${resp.status}: ${body}`);
  }
}

// Every value below is buyer-supplied and goes straight into an HTML email, so
// it has to be escaped — otherwise a `message` field containing markup rewrites
// the notification you read.
const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function esc(value: unknown): string {
  return String(value)
    .replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c)
    .replace(/\r?\n/g, "<br>");
}

function buildEmailHtml(data: Record<string, unknown>): string {
  const row = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:6px 12px;font-weight:600;color:#555;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 12px;color:#111;">${esc(value)}</td></tr>`
      : "";

  const productsStr = String(data["productsOfInterest"] ?? "");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
    <div style="background:#2d4a1e;padding:24px 32px;">
      <h1 style="margin:0;color:#f5c842;font-size:22px;letter-spacing:0.05em;">🌾 ALAA AGRO — New Quote Request</h1>
    </div>
    <div style="padding:24px 32px;">
      <h2 style="color:#2d4a1e;margin-top:0;">Buyer Contact</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row("Full Name", data["fullName"])}
        ${row("Company", data["company"])}
        ${row("Email", data["email"])}
        ${row("Phone", data["phone"])}
        ${row("WhatsApp", data["whatsapp"])}
        ${row("Country", data["country"])}
        ${row("Website", data["website"])}
      </table>

      <h2 style="color:#2d4a1e;margin-top:24px;">Order Details</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row("Products", productsStr)}
        ${row("Quantity", data["quantity"])}
        ${row("Packaging", data["packaging"])}
        ${row("Destination Country", data["destCountry"])}
        ${row("Destination Port", data["destPort"])}
        ${row("Incoterm", data["incoterm"])}
        ${row("Required Specifications", data["reqSpecs"])}
        ${row("Required Documents", data["reqDocs"])}
        ${row("Expected Date", data["expDate"])}
      </table>

      <h2 style="color:#2d4a1e;margin-top:24px;">Additional Info</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${row("Buyer Type", data["buyerType"])}
        ${row("Message", data["message"])}
        ${row("Source", data["source"])}
      </table>
    </div>
    <div style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #e0e0e0;font-size:12px;color:#888;">
      Submitted via alaagro.com quote form
    </div>
  </div>
</body>
</html>`;
}

router.post("/quote", async (req: Request, res: Response) => {
  const data = req.body as Record<string, unknown>;

  // Basic validation
  if (!data["email"] || !data["fullName"]) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const productsOfInterest = Array.isArray(data["productsOfInterest"])
    ? (data["productsOfInterest"] as string[]).join(", ")
    : String(data["productsOfInterest"] ?? "");

  // ── Step 1: Save to database (always) ────────────────────────────────────
  let savedId: number | undefined;
  try {
    const [row] = await db
      .insert(quoteRequestsTable)
      .values({
        fullName: String(data["fullName"]),
        company: String(data["company"] ?? ""),
        email: String(data["email"]),
        phone: data["phone"] ? String(data["phone"]) : null,
        whatsapp: data["whatsapp"] ? String(data["whatsapp"]) : null,
        country: data["country"] ? String(data["country"]) : null,
        website: data["website"] ? String(data["website"]) : null,
        productsOfInterest,
        quantity: data["quantity"] ? String(data["quantity"]) : null,
        packaging: data["packaging"] ? String(data["packaging"]) : null,
        destCountry: data["destCountry"] ? String(data["destCountry"]) : null,
        destPort: data["destPort"] ? String(data["destPort"]) : null,
        incoterm: data["incoterm"] ? String(data["incoterm"]) : null,
        reqSpecs: data["reqSpecs"] ? String(data["reqSpecs"]) : null,
        reqDocs: data["reqDocs"] ? String(data["reqDocs"]) : null,
        expDate: data["expDate"] ? String(data["expDate"]) : null,
        buyerType: data["buyerType"] ? String(data["buyerType"]) : null,
        message: data["message"] ? String(data["message"]) : null,
        source: data["source"] ? String(data["source"]) : "website",
        emailSent: "pending",
      })
      .returning({ id: quoteRequestsTable.id });

    savedId = row?.id;
    logger.info({ id: savedId, email: data["email"] }, "Quote request saved to DB");
  } catch (dbErr) {
    logger.error({ dbErr }, "Failed to save quote request to DB");
    res.status(500).json({ error: "Failed to save request — please try WhatsApp" });
    return;
  }

  // ── Step 2: Send email via Brevo API (best-effort) ────────────────────────
  const recipientEmail = process.env["QUOTE_RECIPIENT_EMAIL"];
  const brevoApiKey = process.env["BREVO_API_KEY"];
  const senderEmail = process.env["BREVO_SENDER_EMAIL"];

  if (!brevoApiKey || !recipientEmail || !senderEmail) {
    logger.warn(
      {
        id: savedId,
        hasApiKey: Boolean(brevoApiKey),
        hasRecipient: Boolean(recipientEmail),
        hasSender: Boolean(senderEmail),
      },
      "Brevo not fully configured — quote saved to DB only",
    );
    await db
      .update(quoteRequestsTable)
      .set({ emailSent: "no_smtp" })
      .where(eq(quoteRequestsTable.id, savedId!))
      .catch(() => {});

    res.json({ success: true, savedId });
    return;
  }

  const textBody = [
    "=== ALAA AGRO — New Quote Request ===",
    "",
    "--- Buyer Contact ---",
    `Full Name:    ${data["fullName"] ?? ""}`,
    `Company:      ${data["company"] ?? ""}`,
    `Email:        ${data["email"] ?? ""}`,
    `Phone:        ${data["phone"] ?? ""}`,
    `WhatsApp:     ${data["whatsapp"] ?? ""}`,
    `Country:      ${data["country"] ?? ""}`,
    `Website:      ${data["website"] ?? ""}`,
    "",
    "--- Order Details ---",
    `Products:     ${productsOfInterest}`,
    `Quantity:     ${data["quantity"] ?? ""}`,
    `Packaging:    ${data["packaging"] ?? ""}`,
    `Dest Country: ${data["destCountry"] ?? ""}`,
    `Dest Port:    ${data["destPort"] ?? ""}`,
    `Incoterm:     ${data["incoterm"] ?? ""}`,
    `Req Specs:    ${data["reqSpecs"] ?? ""}`,
    `Req Docs:     ${data["reqDocs"] ?? ""}`,
    `Exp Date:     ${data["expDate"] ?? ""}`,
    "",
    "--- Additional Info ---",
    `Buyer Type:   ${data["buyerType"] ?? ""}`,
    `Message:      ${data["message"] ?? ""}`,
    `Source:       ${data["source"] ?? ""}`,
  ].join("\n");

  try {
    await sendViaBrevo({
      to: recipientEmail,
      replyTo: String(data["email"]),
      subject: `Quote Request from ${data["company"] || data["fullName"]} (${data["country"] ?? "—"})`,
      htmlContent: buildEmailHtml({ ...data, productsOfInterest }),
      textContent: textBody,
    });

    await db
      .update(quoteRequestsTable)
      .set({ emailSent: "yes" })
      .where(eq(quoteRequestsTable.id, savedId!))
      .catch(() => {});

    logger.info({ id: savedId, email: data["email"] }, "Quote email sent via Brevo");
    res.json({ success: true, savedId });
  } catch (err) {
    logger.error({ err, id: savedId }, "Failed to send quote email via Brevo — lead saved to DB");
    res.json({ success: true, savedId, emailWarning: "Email delivery failed — lead saved" });
  }
});

export default router;
