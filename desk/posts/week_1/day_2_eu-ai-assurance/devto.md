# Building a Tamper-Evident State Machine for EU AI Act Compliance

When a regulation like the EU AI Act dictates strict compliance controls for high-risk AI systems, software engineers face a fundamental challenge: How do we translate qualitative legal classifications into programmatic safeguards?

Relying on developers to fill out compliance questionnaires or tagging models in a static wiki creates a wide vector for silent failures. When risk metadata is decoupled from deployment pipelines, models can easily drift past regulatory boundaries without triggering mandatory control audits.

This post explores the engineering behind turning compliance from a static checklist into a programmatic state machine backed by a tamper-evident audit ledger using the open-source **EU AI Assurance OS**.

## The Architecture: Code-Driven Risk States

To ensure repeatable classification, risk assessment must live in the active software pipeline. We structure this process around a strict state-transition pipeline:

`[DRAFT_ASSESSMENT] -> [EVALUATING] -> [CLASSIFIED] -> [CONTROLS_BOUND] -> [VERIFIED_LOCK]`

### 1. Deterministic Rule Assessment & Assisted Classification
Instead of manual evaluation, we define classification logic as version-controlled rules matching EU AI Act criteria. We use an assistive AI trace (grounded vector search over statutory control libraries via pgvector) to parse system intake payloads against regulatory text. This surfaces relevant control recommendations, though human compliance officers retain final signing authority.

### 2. Control Catalogs and Cryptographic Ledgers
Once a system hits `CLASSIFIED`, the engine binds mandatory controls from our **Control Catalog** to the release track. Each state change is appended to a hash-chained audit log. If a database record is altered out-of-band, the cryptographic chain invalidates, tripping an automated block in the CI release-gate contract.

### 3. Evaluation and HMAC-Signed Gates
Before models reach production, eval workers score model artifacts and data contracts. Results are pushed through durable worker queues, returning HMAC-signed callback tokens that confirm compliance before the deployment pipeline can proceed.

## Get Involved

- **Landing & Live Demo:** https://euassuranceai.souravamseekar.com
- **GitHub Repository:** https://github.com/SVamseekar/eu-ai-assurance-os
- **Full Article:** https://blog.souravamseekar.com/high-risk-is-a-workflow-label-not-a-meeting-vibe
