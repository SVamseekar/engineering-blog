# Designing a Multi-Tenant Restaurant OS: Unifying POS, KDS, and Aggregators

In multi-unit restaurant operations, the greatest engineering enemy is state fragmentation. When a restaurant relies on one proprietary terminal for in-house dining, separate tablets for delivery aggregators, and manual spreadsheets for inventory, operators face severe blind spots during peak volume hours.

This article outlines how we designed `masova`—a multi-tenant restaurant operating system that unifies POS tickets, kitchen displays, delivery aggregator orders, and fiscal-safe ledgers into a single, resilient control surface.

## The Problem: Siloed State and Synchronous Bottlenecks

Standard restaurant setups suffer from distributed state divergence. If an aggregator order arrives while the local network drops or a terminal blocks waiting for an external payment gateway, the order state can be lost entirely from downstream kitchen displays.

To solve this, MaSoVa adopts an edge-first, decoupled architecture.

## Core Architectural Patterns

1. **Unified Order Normalization**: All inbound payloads are normalized into a standard event format upon receipt. We use an append-only SQLite WAL file on the local LAN to transition orders reliably through deterministic states (`RECEIVED` -> `LOCALLY_QUEUED` -> `PREP`) without blocking on cloud confirmation.

2. **Multi-Store Isolation**: Using strict tenant key partitioning, each restaurant location maintains isolated boundaries for menus, staff permissions, and analytics, preventing cross-store data leaks.

3. **Asynchronous Manager Dashboards**: Background worker threads rollup transactions asynchronously to populate the manager control surface, ensuring high-frequency POS traffic never contends with administrative read queries.

## AI Trace: Demand Forecasting Under Human Constraints

To assist with prep planning without risking inventory waste or hallucinations, MaSoVa includes a demand forecasting agent. The model predicts item-level prep quantities using historical sales data and seasonal trends, but its outputs are written to a staging table that requires explicit manager review and approval before becoming active kitchen tasks.

## Explore the Code and Live Demo

- [MaSoVa Platform Repo](https://github.com/SVamseekar/masova-platform)
- [Live Demo & Landing](https://masova.souravamseekar.com)
- [Full Field Note](https://blog.souravamseekar.com/why-managers-still-lose-the-dinner-rush-on-three-tablets)
