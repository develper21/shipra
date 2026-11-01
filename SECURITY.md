# 🛡️ Security Policy & Responsible Disclosure

Security, trust, and abuse prevention are fundamental pillars of **AppLaunch**. Because Android devices permit sideloaded APK installations outside the Google Play Store, we enforce rigorous automated inspection to protect developers, testers, and domain reputations worldwide.

---

## 🔒 Supported Versions

We provide security updates and patches for the following versions:

| Version | Supported | Status |
| :--- | :--- | :--- |
| `2.x.x` | ✅ Yes | Current Stable Release |
| `1.x.x` | ⚠️ Critical Only | Security Patches Only |
| `< 1.0` | ❌ No | Deprecated |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or bypass in AppLaunch, **please do not open a public GitHub issue.** Instead, responsibly disclose it to our core security team:

* **Official Security Email:** `security@applaunch.dev`
* **Response Time:** We acknowledge valid reports within **4 hours** and initiate remediation within **24 hours**.

### What to Include in Your Report
1. Description of the vulnerability (e.g., SSRF, authentication bypass, path traversal in APK parser).
2. Step-by-step reproduction guide or proof-of-concept (PoC).
3. Potential impact on developers or downstream testers.
4. Suggested remediation if known.

We support safe harbor for security researchers conducting good-faith research in accordance with standard responsible disclosure timelines (90 days).

---

## 🔬 Multi-Tier APK Inspection Pipeline

Every Android binary (`.apk`) uploaded to AppLaunch passes through our automated zero-trust security pipeline prior to link activation:

### 1. Static Manifest Analysis
- Inspects `AndroidManifest.xml` for declared permissions.
- Flags high-risk Android capabilities, including `BIND_ACCESSIBILITY_SERVICE`, `RECEIVE_SMS`, `READ_CALL_LOG`, and overlay permissions (`SYSTEM_ALERT_WINDOW`).
- Flags package names attempting to impersonate official banking or financial institutions.

### 2. Cryptographic Signature Verification
- Extracts the Java Keystore certificate and computes the SHA-256 fingerprint.
- Detects whether the binary is signed with a generic `Android Debug` certificate and generates an amber warning for testers.

### 3. Dual-Engine Antivirus Sandboxing
- Integrates local **ClamAV** heuristic daemon with real-time signature updates.
- Connects to **VirusTotal** multi-engine heuristics (70+ security vendors) for hash checking.
- Automatically quarantines flagged binaries, preventing public download URLs from going live.

### 4. Privacy-Friendly Telemetry (ANL-10)
- In compliance with **EU GDPR** and the **India Digital Personal Data Protection (DPDP) Act**, we do not store raw IP addresses.
- All download telemetry is salted and one-way SHA-256 hashed to count unique device installs while preventing user tracking or profiling.

---

## ⚡ Emergency Takedowns & Abuse Handling

If you believe a published application violates copyright, distributes unlicensed software, or contains undeclared spyware:
- **In-App Report:** Click the flag icon (`Report App`) directly on any `/a/:slug` public install page.
- **DMCA Form:** Submit an official notice at [`/legal/dmca`](file:///home/narvin/Documents/expodeploy/src/app/legal/dmca/page.tsx).
- **Admin Moderation:** Our 24/7 internal abuse triage queue enables administrative takedowns and global edge cache purging in under 60 seconds.
