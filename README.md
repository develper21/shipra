# 🚀 Shipra — Open-Source Mobile App Deployment & APK Distribution

> **The framework-agnostic, open-source alternative to Expo Internal Distribution.**  
> Distribute Android APKs with instant shareable links, dynamic high-resolution QR codes, automated multi-engine malware scanning (ClamAV + VirusTotal), and zero arbitrary paywalls.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_18-336791)](https://www.postgresql.org)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma_5.22-5a67d8)](https://www.prisma.io)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/applaunch-dev/applaunch)

---

## 📖 Table of Contents
- [Why AppLaunch?](#-why-applaunch)
- [Key Architectural Highlights](#-key-architectural-highlights)
- [Complete Feature Inventory (All 19 Modules)](#-complete-feature-inventory-all-19-modules)
- [Page Directory Map](#-page-directory-map)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [CLI Tool Reference](#-cli-tool-reference)
- [GitHub Actions CI/CD](#-github-actions-cicd)
- [Security & Malware Sandboxing](#-security--malware-sandboxing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Why AppLaunch?

When mobile engineering teams build with **Expo**, **React Native**, **Flutter**, **Kotlin**, or **Unity**, getting early builds into the hands of QA testers, clients, and internal teams has historically been painful:

1. **Google Play Internal Testing Delays:** Google reviews even internal testing tracks, delaying QA by hours.
2. **Framework Lock-in:** Expo EAS is tailored for Expo/React Native and restricts free tiers with rigid build concurrency limits.
3. **Bandwidth Gouging & Artificial Limits:** Services like Diawi restrict free downloads to 3 installations per link before requiring paid subscriptions.
4. **Security & Domain Reputation Risks:** Distributing raw `.apk` files without automated virus heuristics frequently gets domains blacklisted by Google Safe Browsing.

**AppLaunch fixes this by being 100% framework-agnostic, open-source, and backed by high-performance Cloudflare R2 edge storage.**

---

## ⚡ Key Architectural Highlights

* **Automatic APK Manifest Parsing:** Extracts `packageName`, `versionName`, `versionCode`, `minSdkVersion`, `targetSdkVersion` (Android 15 ready), native ABIs (`arm64-v8a`, `armeabi-v7a`, `x86_64`), and declared permissions.
* **Dual-Engine Malware Inspection:** Pre-scans every binary with ClamAV and VirusTotal heuristics (70+ antivirus engines) before enabling public links.
* **Permanent Version Links:** `/a/:slug/latest` always routes to the newest verified binary on the selected release channel.
* **Smart Device Sensing:** Visitors on Android get a prominent 1-Tap Download button; visitors on desktop screens receive an interactive high-resolution QR code.
* **Multi-Channel Release Management:** Separate tracks for `Production`, `Beta`, and `Internal Staging`, with 1-click promotion and instant rollback.
* **EAS-Style Cloud Build Runners:** Dockerized build containers with pre-cached Android SDKs, Gradle cache, and live streaming build logs.
* **Team RBAC:** Granular Owner, Admin, Developer, and Viewer permissions with full audit trail logging.
* **Internationalization (i18n):** Native English and Hindi (`हिन्दी`) language toggling out of the box.

---

## 📋 Complete Feature Inventory (All 19 Modules)

Implemented in full matching the complete specification:

| Module | Feature IDs | Capabilities |
| :--- | :--- | :--- |
| **1. Marketing Website** | `PUB-01` to `PUB-20` | Hero, Interactive APK upload simulator, Features grid, Comparison table (vs Expo, Firebase, Diawi), Pricing with Monthly/Yearly toggle, Blog with categories, Changelog timeline, About & Contact with anti-spam check, Status page with 90-day uptime bars, Dark/Light mode, English & Hindi toggle, Cookie consent banner, Custom 404/500 error pages. |
| **2. Auth & Accounts** | `AUTH-01` to `AUTH-19` | Email/password registration, password strength meter, breach check, Google & GitHub social auth, Email OTP verification, 2FA with TOTP & backup codes, Active session list & revocation, GDPR/DPDP JSON data export, 3-step Onboarding wizard. |
| **3. Organizations & Teams**| `TEAM-01` to `TEAM-12` | Personal & team workspaces, Workspace switcher dropdown, Email invites with expiring tokens, Owner/Admin/Developer/Viewer roles, Enforced role permission matrix table, Team audit logs. |
| **4. Developer Dashboard** | `DASH-01` to `DASH-10` | Metric cards (total apps, builds, downloads, storage), Recent builds table, Downloads over time chart, Workspace quota meters, Command Palette (`Cmd+K`), in-app notification center. |
| **5. App Management** | `APP-01` to `APP-15` | Create app with package name validation, custom `/a/:slug` with real-time availability check, Public/Unlisted/Private visibility modes, App Detail Hub with 6 tabs. |
| **6. Build Upload & Parser** | `BLD-01` to `BLD-21` | Drag & drop APK upload, chunked & resumable upload UI, auto-parse manifest, SHA-256 certificate thumbprints, debug key warnings, release notes markdown editor. |
| **7. Distribution & Sharing**| `DIST-01` to `DIST-17` | Unguessable download tokens, permanent `/latest` links, QR codes (PNG/SVG download), 1-tap share to WhatsApp/Telegram/Email/SMS, password-protected links, download quotas, embed badges. |
| **8. Public App Page** | `PAGE-01` to `PAGE-18` | Public `/a/:slug` page, large Download button with download simulation, screenshots lightbox, security clean badge, Android permissions disclosure list, Unknown Sources install guide modal, Abuse report modal. |
| **9. Testers & Groups** | `TST-01` to `TST-10` | Single & bulk CSV invite, tester cohorts (QA, Beta, VIP, Internal), revoke tester access, tester portal (`/tester`), in-app bug feedback modal. |
| **10. Channels & Rollouts** | `VER-01` to `VER-11` | Production, Beta, and Internal channels, 1-click build promotion, instant rollback, staged rollout percentage slider (5% to 100%). |
| **11. Analytics & Telemetry**| `ANL-01` to `ANL-13` | Views-to-installs conversion rate, device model breakdown, Android OS version distribution, real-time download events log stream, CSV export. |
| **12. In-App Notifications** | `NTF-01` to `NTF-09` | In-app notification center, unread counters, category delivery preferences (Builds, Security, Billing, Team). |
| **13. Developer Tools** | `DEV-01` to `DEV-13` | REST API `/v1` gateway, Scoped API access tokens, Webhooks with signing secrets and test ping simulator, official GitHub Actions snippet. |
| **14. Cloud Build (EAS)** | `CB-01` to `CB-14` | Docker build runner simulation, streaming terminal emulator with auto-scrolling log output, Gradle build cache stats, monthly build minutes metering. |
| **15. Billing & Plans** | `BIL-01` to `BIL-12` | Free, Pro, and Team tiers, Stripe (Credit Card) and Razorpay (India UPI / NetBanking) checkout modal, coupon codes (`OPENSOURCE`), PDF invoice download with GSTIN support. |
| **16. Internal Admin Panel** | `ADM-01` to `ADM-15` | Admin login with 2FA, platform stats, user suspension & audited impersonation, apps moderation & emergency takedown queue, abuse reports triage, ClamAV heuristics log, system feature flags, global blocklist. |
| **17. Security & Trust** | `SEC-01` to `SEC-18` | Zero-trust pipeline, SHA-256 IP anonymization (ANL-10), ClamAV heuristics, emergency takedown endpoints. |
| **18. Legal & Compliance** | `LEG-01` to `LEG-08` | Terms of Service, GDPR & India DPDP Privacy Policy, Acceptable Use Policy (AUP), DMCA Copyright Takedown form, Cookie Policy, Refund Policy. |
| **19. Documentation** | `DOC-01` to `DOC-10` | Full searchable docs site with guides for Expo, React Native, Flutter, Android Studio, Keystore signing, and CLI reference. |

---

## 🗺️ Page Directory Map

```text
src/app/
├── page.tsx                      # Public Landing Page (Hero, Demo, Comparison)
├── features/page.tsx             # Deep-dive Features Breakdown
├── pricing/page.tsx              # Pricing (Free, Pro, Team + FAQ)
├── use-cases/page.tsx            # Use Cases (Freelancers, Startups, Students, QA)
├── blog/                         # Engineering & Security Blog
│   ├── page.tsx                  # Blog index with categories & search
│   └── [slug]/page.tsx           # Article detail view
├── changelog/page.tsx            # Product release timeline
├── about/page.tsx                # Open-source mission & core team
├── contact/page.tsx              # Support form with spam challenge
├── status/page.tsx               # Real-time uptime & incident logs
├── not-found.tsx                 # Custom 404 page
├── error.tsx                     # Custom 500 error boundary
├── legal/                        # Compliance & Trust
│   ├── terms/page.tsx            # Terms of Service
│   ├── privacy/page.tsx          # Privacy Policy (GDPR / India DPDP)
│   ├── aup/page.tsx              # Acceptable Use Policy
│   ├── dmca/page.tsx             # Copyright Takedown form
│   ├── cookies/page.tsx          # Cookie Policy
│   └── refund/page.tsx           # Refund & Cancellation Policy
├── dev/[username]/page.tsx       # Public Developer Profile page
├── a/[slug]/                     # Public Mobile App Install Hub
│   ├── page.tsx                  # 1-Tap Download, QR code, Permissions, Security
│   └── expired/page.tsx          # Friendly Expired Link page
├── auth/                         # Authentication Suite
│   ├── signup/page.tsx           # Signup with strength meter & ToS
│   ├── login/page.tsx            # Login with 1-click Demo credentials
│   ├── verify-email/page.tsx     # OTP verification screen
│   ├── forgot-password/page.tsx  # Password recovery request
│   ├── reset-password/page.tsx   # New password creation
│   ├── 2fa/page.tsx              # TOTP & backup codes prompt
│   └── onboarding/page.tsx       # 3-Step New Developer Wizard
├── dashboard/                    # Developer & Team Management Suite
│   ├── page.tsx                  # Dashboard Home & Timeline Chart
│   ├── apps/                     # Apps management
│   │   ├── page.tsx              # Grid & Table view of all apps
│   │   ├── new/page.tsx          # New App creation with live slug checker
│   │   └── [id]/page.tsx         # Master App Detail Hub (6 Tabs)
│   ├── upload/page.tsx           # Standalone Drag-and-Drop APK Upload
│   ├── cloud-build/page.tsx      # EAS-style Cloud Build with live logs
│   ├── team/page.tsx             # Team members, RBAC matrix & audit logs
│   ├── developer/page.tsx        # REST API tokens & webhooks manager
│   ├── billing/page.tsx          # Plans, invoices & checkout modal
│   ├── notifications/page.tsx    # Notification center & preferences
│   └── settings/page.tsx         # Profile, 2FA setup & GDPR export
├── tester/                       # Tester Portal
│   ├── page.tsx                  # "Apps Shared With Me" & bug feedback
│   └── invite/[token]/page.tsx   # Accept tester invite flow
└── admin/page.tsx                # Internal Moderation & Admin Console
```

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with sleek dark-first modern aesthetics
* **Icons:** [Lucide React](https://lucide.dev) + custom brand SVGs
* **Interactivity:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* **Language Support:** Built-in English & Hindi translation dictionary

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or later (tested on Node.js v24.18.0)
- npm `v9.0.0` or later

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/expodeploy.git
cd expodeploy

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### Building for Production

```bash
# Generate optimized production build
npm run build

# Start production server
npm run start
```

---

## 💻 CLI Tool Reference

Install the global CLI to upload builds directly from your terminal:

```bash
# Install globally
npm i -g applaunch

# Authenticate CLI
applaunch login --token apl_live_your_token_here

# Deploy APK build to Beta channel with release notes
applaunch upload ./android/app/build/outputs/apk/release/app-release.apk \
  --app 'pulse-fitness' \
  --channel 'Beta' \
  --notes 'Sprint 42 test build with BLE fixes'
```

---

## 🛡️ Security & Malware Sandboxing

AppLaunch implements an automated zero-trust heuristic pipeline:
1. **Manifest Static Analysis:** Scans for high-risk permissions (`BIND_ACCESSIBILITY_SERVICE`, `RECEIVE_SMS`, overlay permissions).
2. **Signature Verification:** Validates SHA-256 certificate fingerprints and alerts testers if a generic debug key was used.
3. **ClamAV & VirusTotal Engine:** 70+ security engines analyze every binary. Detected trojans or adware are quarantined immediately.
4. **Fast Abuse Takedowns:** Administrative console enables emergency takedowns and edge URL revocations in under 60 seconds.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on setting up your local environment, code conventions, and pull request workflows.

---

## 📄 License

AppLaunch is licensed under the **Apache License 2.0**. See the [LICENSE](./LICENSE) file for details.
See [SECURITY.md](./SECURITY.md) for our vulnerability disclosure and reporting policies.
