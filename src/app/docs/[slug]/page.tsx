import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ArrowLeft, BookOpen, ChevronRight, Terminal, Copy, CheckCircle2 } from "@/components/icons";

interface DocArticle {
  title: string;
  category: string;
  description: string;
  content: string;
  snippet?: string;
}

const DOCS_DATA: Record<string, DocArticle> = {
  quickstart: {
    title: "Quickstart Guide",
    category: "Getting Started",
    description: "Upload and distribute your first APK build in under 60 seconds.",
    content: `
### Step 1: Create an App Container
Navigate to your dashboard and click **New App**. Specify your application name (e.g. *Pulse Fitness*), Android package name (e.g. *com.pulse.fitness*), and unique URL slug.

### Step 2: Upload Your APK
Drag and drop your signed or debug APK directly into the browser uploader. The engine calculates SHA-256 hashes, scans with ClamAV, and extracts the Android Manifest in real-time.

### Step 3: Share the Public Link
Instantly receive your permanent public page and direct install QR code at \`/a/[slug]\`. Testers can open the link on Android to install with 1 tap.
    `,
    snippet: `# Install Shipra CLI globally
npm install -g shipra-cli

# Login and push an APK build
shipra login
shipra upload ./app-release.apk --channel beta`,
  },
  "cli-reference": {
    title: "Shipra CLI Reference",
    category: "Developer Tools",
    description: "Comprehensive guide for the official open-source Shipra CLI.",
    content: `
The Shipra command line utility allows headless uploads from CI/CD environments (GitHub Actions, GitLab CI, CircleCI, Bitrise) using Bearer API Tokens.

### Authentication
Authenticate with your personal or workspace API token:
\`\`\`bash
shipra auth --token shipra_live_xxxxxxxx
\`\`\`

### Upload Commands
Upload APKs with channel flags and release notes:
\`\`\`bash
shipra upload [file.apk] --channel [production|beta|internal] --notes "Bugfixes"
\`\`\`
    `,
    snippet: `shipra upload ./build/outputs/apk/release/app-release.apk \\
  --channel production \\
  --notes "Release v1.2.0: Performance improvements"`,
  },
  "ci-cd-integration": {
    title: "GitHub Actions & Fastlane",
    category: "Automation",
    description: "Automate your Android APK deployment on every git tag or push.",
    content: `
Use the official Shipra GitHub Action to deploy builds on push to \`main\` or upon creating a release tag.

### Workflow Example
Add the following workflow file to \`.github/workflows/deploy.yml\`:
    `,
    snippet: `name: Deploy APK
on:
  push:
    branches: [main]

jobs:
  distribute:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Android APK
        run: ./gradlew assembleRelease
      - name: Publish to Shipra
        uses: shipra-dev/action-upload@v1
        with:
          api-token: \${{ secrets.SHIPRA_TOKEN }}
          app-slug: my-awesome-app
          apk-path: app/build/outputs/apk/release/app-release.apk
          channel: beta`,
  },
  "in-app-updates": {
    title: "In-App Updates SDK",
    category: "SDK",
    description: "Notify users directly on app launch when a new release is available.",
    content: `
Shipra provides a lightweight, zero-dependency Android SDK that queries \`/api/v1/public/check-update\` to prompt users for immediate or flexible updates.
    `,
    snippet: `// React Native / Flutter / Android Native
import { ShipraUpdater } from '@shipra/react-native';

useEffect(() => {
  ShipraUpdater.checkForUpdates({
    packageName: 'com.example.app',
    currentVersionCode: 104,
    channel: 'production',
  });
}, []);`,
  },
  "security-scanning": {
    title: "Antivirus & Malware Scanning",
    category: "Security",
    description: "How Shipra inspects and verifies every binary against known threats.",
    content: `
Every uploaded APK undergoes three tiers of inspection before entering \`ready\` status:
1. **Manifest Integrity**: Verification that AndroidManifest.xml matches the claimed package name.
2. **Signature Verification**: Detection of debug keys vs Google Play / production release keystores.
3. **Dual Antivirus Scanning**: Asynchronous inspection via local ClamAV daemon and VirusTotal hash intelligence.
    `,
  },
  "channels-rollouts": {
    title: "Channels & Staged Rollouts",
    category: "Release Management",
    description: "Distribute safely using Production, Beta, and Internal channels.",
    content: `
Staged rollouts allow you to release a new version to a subset of devices (e.g. 10%, 25%, 50%) before releasing to 100% of your user base.
If any critical bugs or crashes are reported by early testers, you can trigger an **Instant 1-Click Rollback** to the previous stable build.
    `,
  },
};

export default async function DocDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const doc = DOCS_DATA[params.slug];

  if (!doc) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="border-b border-slate-800 bg-slate-900/50 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/docs" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Docs
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span>{doc.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-white font-medium">{doc.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            {doc.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{doc.title}</h1>
          <p className="text-base text-slate-400 leading-relaxed">{doc.description}</p>
        </div>

        {doc.snippet && (
          <div className="mb-8 rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Code Example</span>
              </div>
              <button
                className="hover:text-white flex items-center gap-1 text-[11px]"
                onClick={() => {}}
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
            <pre className="text-blue-300 leading-relaxed">{doc.snippet}</pre>
          </div>
        )}

        <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
          <div className="whitespace-pre-line leading-relaxed">{doc.content}</div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/docs"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all documentation
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified for Shipra v1.0.0
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
