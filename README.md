# AI ScamShield

**Think Before You Click.** AI ScamShield analyzes suspicious SMS, WhatsApp, email, social-media, and marketplace messages with an open-weight language model, explaining the observed warning signs and safer next steps.

## What it does

- Accepts a message of up to 10,000 characters without opening its URLs.
- Sends the message only after the visitor selects **Analyze message**.
- Uses Lovable's built-in AI inference gateway for live message analysis.
- Validates structured JSON analysis before it reaches the browser.
- Does not require accounts, persist message history, or provide fake fallback analyses.
- Supports copy and local plain-text report download after an analysis.

## Stack

- React, TypeScript, TanStack Start, Tailwind CSS
- Lucide icons and reusable UI primitives
- Zod validation
- Lovable AI Gateway for secure server-side inference

## Run locally

```sh
bun install
cp .env.example .env
bun dev
```

No external API key is required. Lovable securely provides the AI credential to the server at runtime; it is never sent to browser code. AI usage is subject to the workspace's available Lovable AI credits.

## Architecture

```text
Browser → TanStack Start server function → Lovable AI Gateway
                                     ↳ validates response JSON
```

The app never fetches or opens URLs contained in submitted messages. The server function validates input length, applies a small in-memory request throttle, sends the request to the configured model, validates the response, and returns only structured plain text.

## Privacy and safety

Messages are not saved by the app. A live analysis does send the submitted text to the configured inference service. Do not paste secrets, passwords, OTPs, or other highly sensitive information. AI ScamShield offers automated guidance, not a definitive fraud decision; a low-risk result does not prove a message is safe.

## Demo

Use the four fictional example cards in the interface to test prize, banking, job, and ordinary-message scenarios. No external credentials are required for live AI analysis.

## Limitations

- Analysis relies on message text only and does not verify links, senders, phone numbers, financial institutions, or outside sources.
- AI output can be incomplete or incorrect.
- Analysis availability depends on the workspace's Lovable AI service and usage credits.

## Open source

Released under the [MIT License](./LICENSE). Built for Hacktoberfest Islamabad 2026.

## Acknowledgements

Created with Lovable, TanStack Start, React, Tailwind CSS, Lucide, Zod, and Lovable AI Gateway.
