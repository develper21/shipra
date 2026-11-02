export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  publishedAt?: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  tags?: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-expo-developers-are-switching-to-direct-apk-distribution',
    title: 'Why React Native & Expo Developers Are Switching to Direct APK Distribution',
    summary: 'How circumventing store review lag times and internal distribution paywalls accelerates mobile testing cycles by 10x.',
    category: 'Engineering',
    date: 'May 18, 2025',
    publishedAt: 'May 18, 2025',
    readTime: '6 min read',
    tags: ['React Native', 'Expo', 'Mobile DevOps'],
    author: {
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Platform Architect'
    },
    content: `When building React Native or Expo applications, distributing early beta versions to QA testers, clients, and internal teams has historically been painful. While Expo EAS provides internal distribution, developers frequently hit restrictive concurrency queues, mandatory paid tiers, and rigid workflow locks.

### The Problem With Traditional Distribution
1. **Google Play Internal Testing delays:** Even internal testing tracks often require 1 to 4 hours of automated review pipelines before an APK reaches testers.
2. **Framework Lock-in:** Many tools only work if you configure specific client SDKs, breaking vanilla React Native, Flutter, Kotlin, or Unity workflows.
3. **Bandwidth Gouging:** Big platforms penalize indie developers once downloads cross a modest threshold.

### How Shipra Fixes This
Shipra is **100% framework-agnostic**. Whether you export an APK from Android Studio, Expo (\`eas build -p android --profile preview\`), Flutter (\`flutter build apk\`), or Unity, you simply drop your APK onto Shipra.

Within 4 seconds:
- APK metadata is parsed (package name, permissions, target SDK).
- Automatic malware scans run with ClamAV and VirusTotal.
- An unguessable, beautiful download link with a high-res QR code is produced.
- Android devices detect the package and download directly with proper MIME headers (\`application/vnd.android.package-archive\`).`
  },
  {
    slug: 'securing-android-beta-releases-with-virustotal-and-sha256',
    title: 'Securing Android Beta Releases: ClamAV, VirusTotal & SHA-256 Signatures',
    summary: 'A deep-dive into how Shipra prevents malware propagation, fake banking apps, and unauthorized debug builds from reaching testers.',
    category: 'Security',
    date: 'May 04, 2025',
    publishedAt: 'May 04, 2025',
    readTime: '8 min read',
    tags: ['Security', 'ClamAV', 'VirusTotal'],
    author: {
      name: 'Neha Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Head of Security'
    },
    content: `Distributing raw Android APKs comes with an enormous responsibility: trust. Because modern Android shows a security prompt when installing unknown apps, maintaining an unblemished domain reputation is crucial.

### Multi-Stage Inspection Pipeline
Every APK uploaded to Shipra runs through a 4-tier security pipeline:
1. **Manifest Static Analysis:** We inspect \`AndroidManifest.xml\` for dangerous permissions like \`BIND_ACCESSIBILITY_SERVICE\`, \`RECEIVE_SMS\`, or sneaky overlay permissions (\`SYSTEM_ALERT_WINDOW\`).
2. **Signature Fingerprinting:** We extract and verify the SHA-256 certificate thumbprint. If an APK is signed with a generic debug key (\`CN=Android Debug\`), we display an amber warning to testers.
3. **Automated ClamAV & VirusTotal Engine:** Every binary is scanned against up-to-date virus signatures. Known Trojans, adware, or spyware are quarantined immediately before any link is activated.
4. **Fast Abuse Takedowns:** If a user flags an impersonated financial or phishing app, our admin moderation tools take down the build in under 60 seconds.`
  },
  {
    slug: 'automate-apk-distribution-with-github-actions-and-shipra-cli',
    title: 'Automate APK Distribution with GitHub Actions and Shipra CLI',
    summary: 'Learn how to set up continuous deployment so every merge to main automatically uploads, scans, and notifies your QA testers on WhatsApp or Slack.',
    category: 'Tutorials',
    date: 'Apr 22, 2025',
    publishedAt: 'Apr 22, 2025',
    readTime: '5 min read',
    tags: ['DevOps', 'GitHub Actions', 'CI/CD'],
    author: {
      name: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'DevOps Engineer'
    },
    content: `Manual APK uploads are a thing of the past. With the official \`shipra-action\` for GitHub Actions, your CI workflow can build and distribute APKs instantly.

\`\`\`yaml
name: Build and Distribute Android APK
on:
  push:
    branches: [ main ]

jobs:
  distribute:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx react-native bundle --platform android
      - run: cd android && ./gradlew assembleRelease
      - uses: shipra/upload-apk-action@v1
        with:
          api-token: \${{ secrets.SHIPRA_API_TOKEN }}
          app-slug: 'pulse-fitness'
          apk-path: 'android/app/build/outputs/apk/release/app-release.apk'
          channel: 'Beta'
          release-notes: 'Automated CI build from commit \${{ github.sha }}'
\`\`\``
  }
];

export const changelog: ChangelogEntry[] = [
  {
    version: 'v2.2.0',
    date: 'May 20, 2025',
    title: 'EAS-Style Cloud Build Runners & Staged Rollouts',
    changes: [
      'Added isolated Docker cloud build runners with pre-cached Android SDK 35 and Gradle cache.',
      'Introduced Staged Rollout sliders: release builds to 5%, 25%, 50%, or 100% of testers.',
      'Added ABI separation display (arm64-v8a, armeabi-v7a, x86_64) on public install pages.',
      'Enhanced VirusTotal & ClamAV malware scanning pipeline with real-time quarantine alerts.'
    ]
  },
  {
    version: 'v2.1.0',
    date: 'April 28, 2025',
    title: 'Multi-Channel Releases, Webhooks & Tester Feedback',
    changes: [
      'Support for custom release channels: Production, Beta, Internal, and custom QA channels.',
      'One-tap build promotion: instantly promote a verified build from Beta to Production.',
      'In-app tester feedback widget: testers can submit bug reports and device stats directly.',
      'Comprehensive Webhook engine with HMAC-SHA256 signing secret and redelivery retry queue.'
    ]
  },
  {
    version: 'v2.0.0',
    date: 'March 15, 2025',
    title: 'Shipra 2.0 Major Release',
    changes: [
      'Complete redesign with ultra-fast Next.js architecture and sleek dark-mode aesthetics.',
      'Permanent "/latest" links for every app so testers never download stale binaries.',
      'Interactive QR codes with SVG & PNG high-res download for print and slide decks.',
      'Team workspaces with granular role-based permissions (Owner, Admin, Developer, Viewer).'
    ]
  }
];
