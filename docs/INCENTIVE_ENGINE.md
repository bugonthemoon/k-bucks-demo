
# Incentive Engine

This document explains the **K-Bucks incentive engine**, which is the core concept behind the K-Bucks demo.

The incentive engine distributes a virtual currency called **KBU (K-Bucks Units)** to reward learning activity.

The goal is to align incentives between:

- children (learning participants)
- parents
- sponsors
- educational content creators
- the platform

---

# Core idea

Educational activities generate rewards.

When a child engages with learning content (games or videos), the system releases small amounts of KBU based on predefined funding flows.

These flows simulate how learning platforms could financially sustain high-quality educational content.

---

# Participants

The K-Bucks ecosystem includes five main participants.

## Child

The learner completing educational activities.

The child:

- plays games
- watches educational videos
- receives KBU rewards

The child wallet accumulates earned KBU.

---

## Parent

The parent provides base funding for learning.

Parent contributions represent:

- educational allowance
- incentives for completing learning tasks

Parent funding feeds the **spigot flow rate**.

---

## Sponsors

Sponsors provide matching funds.

Sponsors represent:

- organizations supporting education
- scholarships
- learning incentives from companies

Sponsors increase the KBU flow rate through matching.

---

## Content Developer

Content creators receive a portion of the generated KBU.

This represents:

- revenue for educational games
- payment for educational videos
- incentives to create engaging learning content

---

## Platform

The platform receives a small portion of the flow.

This represents:

- infrastructure costs
- platform sustainability
- long-term ecosystem funding

---

# Flow mechanics

The incentive engine operates as a **continuous reward stream**.

Funding sources:

Parent funding
+ Sponsor funding

generate a **flow rate** measured in:

KBU per hour

This flow is released during learning activity.

---

# Spigot model

The demo uses a visual metaphor called the **spigot**.

The spigot represents the reward stream.

When learning activity occurs:

the spigot releases KBU drops over time.

These drops are distributed between:

- child wallet
- developer wallet
- platform wallet

---

# Example flow

Example configuration:

Parent funding: 5.00 KBU
Sponsor funding: 1.00 KBU

Sponsor match multiplier: 5x

This produces a calculated **flow rate**.

While the child is actively learning:

KBU is gradually distributed through the spigot.

---

# Game integration

Each learning activity integrates with the incentive engine.

Examples:

## Name That Country (NTC)

Rewards are issued based on correct answers and gameplay progression.

## Multiply Two Numbers (MTN)

Rewards correspond to solving multiplication problems.

## Optics and Photonics (OAP)

Rewards are tied to watch time and video engagement.

---

# Wallet accounting

The system tracks balances for:

- Child
- Parent
- Sponsors
- Content Developer
- Platform

These balances update in real time during learning activity.

---

# Telemetry

The incentive engine generates telemetry events.

Examples:

kb_game_start
kb_answer
kb_reward
kb_game_quit

These events help analyze:

- learning engagement
- reward effectiveness
- gameplay behavior

---

# Purpose of the demo

The demo illustrates how **economic incentives can support educational content**.

The design explores:

- sustainable educational game funding
- sponsor-supported learning
- transparent reward flows
- engagement-driven incentives

---

# Related documentation

See also:

docs/ARCHITECTURE.md
docs/ARCHITECTURE_DIAGRAM.md
docs/INDEX_HTML_MAP.md
