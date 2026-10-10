# AI ScamShield

**Think Before You Click.** AI ScamShield analyzes suspicious SMS, WhatsApp, email, social-media, and marketplace messages with an open-weight language model, explaining the observed warning signs and safer next steps.

## What it does

- Accepts a message of up to 10,000 characters without opening its URLs.
- Sends the message only after the visitor selects **Analyze message**.
- Uses a configured open-weight model through Hugging Face Inference Providers.
- Validates structured JSON analysis before it reaches the browser.
- Does not require accounts, persist message history, or provide fake fallback analyses.
- Supports copy and local plain-text report download after an analysis.

## Stack

- React, TypeScript, TanStack Start, Tailwind CSS
- Lucide icons and reusable UI primitives
- Zod validation
- Hugging Face Inference Providers for an open-weight model

## Run locally

```sh
bun install
cp .env.example .env
bun dev
```

Add server-only values to `.env`:

```dotenv
HF_TOKEN=hf_your_token_here
HF_MODEL=your-open-weight-model-id
```

`HF_TOKEN` and `HF_MODEL` must **not** be prefixed with `VITE_`. This keeps the token out of browser JavaScript. Pick an instruct/chat model available through the configured Hugging Face Inference Provider and review that model's license before release. Provider usage can require a paid Hugging Face account or credits; AI ScamShield does not promise unlimited or free inference.

## Architecture

```text
Browser → TanStack Start server function → Hugging Face Inference Providers
                                     ↳ validates response JSON
```

The app never fetches or opens URLs contained in submitted messages. The server function validates input length, applies a small in-memory request throttle, sends the request to the configured model, validates the response, and returns only structured plain text.

## Privacy and safety

Messages are not saved by the app. A live analysis does send the submitted text to the configured inference service. Do not paste secrets, passwords, OTPs, or other highly sensitive information. AI ScamShield offers automated guidance, not a definitive fraud decision; a low-risk result does not prove a message is safe.

## Demo

Use the four fictional example cards in the interface to test prize, banking, job, and ordinary-message scenarios. Configure the server credentials before testing live AI analysis.

## Limitations

- Analysis relies on message text only and does not verify links, senders, phone numbers, financial institutions, or outside sources.
- AI output can be incomplete or incorrect.
- Available models and inference quotas depend on the configured provider.

## Open source

Released under the [MIT License](./LICENSE). Built for Hacktoberfest Islamabad 2026.

## Acknowledgements

Created with Lovable, TanStack Start, React, Tailwind CSS, Lucide, Zod, and Hugging Face Inference Providers.
