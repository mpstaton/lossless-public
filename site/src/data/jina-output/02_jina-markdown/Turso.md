Turso - Databases for All
===============

[Turso](https://turso.tech/)

[Login](https://turso.tech/signin)Open main menu

Product

[Docs](https://docs.turso.tech/)[Customers](https://turso.tech/customers)[Pricing](https://turso.tech/pricing)[Blog](https://turso.tech/blog)

[Schedule a call](https://tur.so/chat)[Follow us on X](https://x.com/tursodatabase)[Join us on Discord](https://discord.gg/turso)

[Login](https://turso.tech/signin)[Sign Up](https://turso.tech/signup)

Databases For All  
Multi-tenaApplications
==========================================

[Join Turso Cloud](https://turso.tech/signup)[Talk To Us](https://tur.so/chat)

Integrate this weekend

Databases for Developers
------------------------

Turso works online, offline, or on-device using any framework, language, or infra provider.

[14K](https://github.com/tursodatabase/libsql)

Hide Files

Node.js

vector.tssync.tslocal.tsin-memory.tsencryption.tstransactions.tsbatch.ts

Swift

Ruby

PHP

Python

C

vector.ts

```
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:local.db",
});

await client.batch(
  [
    "CREATE TABLE movies (title TEXT, year INT, embedding F32_BLOB(3))",
    "CREATE INDEX movies_idx ON movies (libsql_vector_idx(embedding))",
    "INSERT INTO movies (title, year, embedding) VALUES ('Napoleon', 2023, vector32('[1,2,3]')), ('Black Hawk Down', 2001, vector32('[10,11,12]')), ('Gladiator', 2000, vector32('[7,8,9]')), ('Blade Runner', 1982, vector32('[4,5,6]'))",
  ],
  "write",
);

const result = await client.execute(
  "SELECT title, year FROM vector_top_k('movies_idx', '[4,5,6]', 3) JOIN movies ON movies.rowid = id",
);

console.log(result.rows);
```

Multi-tenant AI

Unlimited Databases
-------------------

Personalize, Scale, and Supercharge Your LLM Applications with Turso Cloud.

Database Per Context

Personalized LLM instances with infinite context windows using Turso’s unlimited databases.

Ephemeral Databases for AI Agents

Create single-use databases for LLM actions. Instant rollback with Branching. Scale to millions of agents.

Native Vector Search at Scale

Efficient parallel vector searches across users, instances, or contexts using SQL database integration.

[Join Turso Cloud](https://turso.tech/signup)[View Pricing](https://turso.tech/pricing)

![Image 1](https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftilt.5bdbc84c.png&w=1920&q=75)

![Image 2: Mike Soylu](https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmike-soylu.1a04aea9.jpeg&w=1080&q=75)

Mike Soylu

Founder, Adaptive Computer

![Image 3: Adaptive Computer](https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fadaptive-computer.18319ff0.png&w=1920&q=75)

> “We use Turso Cloud to generate a large amount of ephemeral databases to power our AI agents going, doing things and being fault tolerant. Because we can branch and rollback databases quickly with just an API call, we can really scale our AI agents.”

[Read Case Study](https://turso.tech/blog/adaptive-computer-chooses-turso-ephemeral-databases-to-power-ai-agents-that-build-and-modify-software)

![Image 4: Pierre-Antoine Urvoy](https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpierre-antoine-urvoy.ee1d202a.png&w=1080&q=75)

Pierre-Antoine Urvoy

Engineer, Prisma

> “Multi-tenancy with Turso Cloud has been amazing, super easy to implement. It's made permissions & token management for Prisma Optimize, our new AI query optimizer, really simple.”

[Read Case Study](https://turso.tech/blog/why-prisma-chose-turso-to-power-prisma-optimize)

On Device AI

AI at your Fingertips
---------------------

Local Intelligence with On-Device SDKs.

On Device RAG

Optimize LLMs locally using Turso’s SQLite-based database within your application.

Local Vector Search

Seamlessly integrate Vector Embeddings with relational data in single transactions.

Zero Network Latency

Execute database and Vector Search queries together, on-device, for maximum speed.

Local First AI

Power & Performance
-------------------

AI That Puts Your Device First.

Offline WritesIn Beta

Automatic sync and programmable conflict resolution keeps your app data fresh.

SQLite Is Just a File

Leverage local LLMs, complete with data store, RAG, and vector search with SQLite.

Private by Design

Encrypted at rest. Maintain user data privacy with on-device processing and networking.

> “Kin is a personal AI for work and life that learns from your personal data, so on device data privacy was important. Turso Cloud made that possible with libSQL’s inbuilt vector search, which lets us store all the data locally on the mobile device and do vector search locally too, so we never see the user’s data- only they do.”

![Image 5: Simon Henriksen](https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsimon-henriksen.339debfa.jpeg&w=1920&q=75)

Simon Henriksen

Founder & CTO

[Read Kin Case Study](https://turso.tech/blog/local-first-ai-assistant-kin-leverages-tursos-libsql-for-on-device-native-vector-search)

Mobile AI

AI that moves with you
----------------------

SDKs for Mobile

Build powerful offline-capable apps across all major platforms with one of our mobile SDKs.

Mobile Vector Search

Why juggle two databases when one does the trick? SQL queries and Vector Search in one neat package.

Fault Tolerant

Designed to handle battery constraints, connectivity issues, and varying conditions.

[Learn More](https://turso.tech/vector)

![Image 6](https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frag.736f12b0.png&w=1920&q=75)

Everything else
---------------

Great databases do more than just store data.

[14K](https://github.com/tursodatabase/libsql)

### Open Source

Your data is always portable because the database is an just exportable SQLite compatible file.

### Secure

Encryption at rest, encryption in transit, SOC2, HIPAA & DPAs are all available out of the box.

### API-First

Turso comes with a powerful Platform API for efficient, programmatic database management.

### Flexible

Develop and test locally or remotely and deploy globally when you want thanks to flexible SQLite.

### Fast

Get zero network latency when you read from a locally embedded database that syncs when you need.

### Simple

Enjoy a developer experience that is as simple as SQLite and get up and running in no time.

Are you ready?

Join Turso Cloud
----------------

Sign up and start building your next SQLite app in production with Turso.

[Get Started](https://app.turso.tech/signup)

Let's talk

Talk to us
----------

Schedule a demo and discuss your project requirements.

[Schedule a call](https://tur.so/chat)

SQLite for Production

[Get Started](https://turso.tech/signup)[Star Our Repo](https://github.com/tursodatabase/libsql)

Developers

[Quickstart](https://docs.turso.tech/quickstart)

[SDK Reference](https://docs.turso.tech/quickstart)

[CLI Reference](https://docs.turso.tech/quickstart)

[API Reference](https://docs.turso.tech/quickstart)

[Examples](https://github.com/tursodatabase/examples)

[API Status](https://status.turso.tech/)

Features

[Embedded Replicas](https://docs.turso.tech/features/embedded-replicas)

[Database Branching](https://docs.turso.tech/features/branching)

[Backups & Recovery](https://docs.turso.tech/features/point-in-time-recovery)

[Platform API](https://docs.turso.tech/features/platform-api)

Product

[For AI](https://turso.tech/vector)

[For Healthcare](https://turso.tech/healthcare)

[For Platforms](https://turso.tech/platforms)

[Multi-Tenancy](https://turso.tech/multi-tenancy)

[libSQL](https://turso.tech/libsql)

[Pricing](https://turso.tech/pricing)

Company

[About](https://turso.tech/about)

[Brand](https://turso.tech/brand)

[Contact Us](mailto:info@turso.tech)

[Support](https://docs.turso.tech/support)

[Trust](https://trust.turso.tech/)

[Blog](https://turso.tech/blog)

[RSS](https://turso.tech/blog/feed.xml)[YouTube](https://www.youtube.com/@tursodatabase)[Discord](https://discord.gg/turso)[X](https://x.com/tursodatabase)[Linkedin](https://www.linkedin.com/company/turso)[GitHub](https://github.com/tursodatabase)

© **Turso** 2025

*   [Terms of Use](https://turso.tech/terms-of-use)
*   [Privacy Policy](https://turso.tech/privacy-policy)

![Image 7: scarf](https://static.scarf.sh/a.png?x-pxid=3976f68e-9b66-42d1-829a-9357a2c397cc)

  ![Image 8](https://t.co/1/i/adsct?bci=4&dv=UTC%26en-US%26Google%20Inc.%26Linux%20x86_64%26255%26800%26600%264%2624%26800%26600%260%26na&eci=3&event=%7B%7D&event_id=735dc431-4ef3-4922-9cb0-a668648e719b&integration=gtm&p_id=Twitter&p_user_id=0&pl_id=e410789e-341c-4ad3-888a-b6d8899c342c&tw_document_href=https%3A%2F%2Fturso.tech%2F&tw_iframe_status=0&txn_id=omspsomsps&type=javascript&version=2.3.31)![Image 9](https://analytics.twitter.com/1/i/adsct?bci=4&dv=UTC%26en-US%26Google%20Inc.%26Linux%20x86_64%26255%26800%26600%264%2624%26800%26600%260%26na&eci=3&event=%7B%7D&event_id=735dc431-4ef3-4922-9cb0-a668648e719b&integration=gtm&p_id=Twitter&p_user_id=0&pl_id=e410789e-341c-4ad3-888a-b6d8899c342c&tw_document_href=https%3A%2F%2Fturso.tech%2F&tw_iframe_status=0&txn_id=omspsomsps&type=javascript&version=2.3.31)

Links/Buttons:
- [Turso](https://turso.tech/)
- [Login](https://turso.tech/signin)
- [Docs](https://docs.turso.tech/)
- [Customers](https://turso.tech/customers)
- [Pricing](https://turso.tech/pricing)
- [Blog](https://turso.tech/blog)
- [Schedule a call](https://tur.so/chat)
- [Follow us on X](https://x.com/tursodatabase)
- [Join us on Discord](https://discord.gg/turso)
- [Sign Up](https://turso.tech/signup)
- [14K](https://github.com/tursodatabase/libsql)
- [Read Case Study](https://turso.tech/blog/why-prisma-chose-turso-to-power-prisma-optimize)
- [Read Kin Case Study](https://turso.tech/blog/local-first-ai-assistant-kin-leverages-tursos-libsql-for-on-device-native-vector-search)
- [Learn More](https://turso.tech/vector)
- [Get Started](https://app.turso.tech/signup)
- [Quickstart](https://docs.turso.tech/quickstart)
- [Examples](https://github.com/tursodatabase/examples)
- [API Status](https://status.turso.tech/)
- [Embedded Replicas](https://docs.turso.tech/features/embedded-replicas)
- [Database Branching](https://docs.turso.tech/features/branching)
- [Backups & Recovery](https://docs.turso.tech/features/point-in-time-recovery)
- [Platform API](https://docs.turso.tech/features/platform-api)
- [For Healthcare](https://turso.tech/healthcare)
- [For Platforms](https://turso.tech/platforms)
- [Multi-Tenancy](https://turso.tech/multi-tenancy)
- [libSQL](https://turso.tech/libsql)
- [About](https://turso.tech/about)
- [Brand](https://turso.tech/brand)
- [Contact Us](mailto:info@turso.tech)
- [Support](https://docs.turso.tech/support)
- [Trust](https://trust.turso.tech/)
- [RSS](https://turso.tech/blog/feed.xml)
- [YouTube](https://www.youtube.com/@tursodatabase)
- [Linkedin](https://www.linkedin.com/company/turso)
- [GitHub](https://github.com/tursodatabase)
- [Terms of Use](https://turso.tech/terms-of-use)
- [Privacy Policy](https://turso.tech/privacy-policy)
