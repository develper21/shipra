export type UserRole = 'Owner' | 'Admin' | 'Developer' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  bio?: string;
  website?: string;
  twoFactorEnabled: boolean;
  role: 'user' | 'admin' | 'developer';
  connectedAccounts: {
    github: boolean;
    google: boolean;
  };
  activeSessions: Session[];
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  isPersonal: boolean;
  plan: 'free' | 'pro' | 'team';
  memberCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  invitedAt: string;
  status: 'active' | 'pending';
}

export interface ApkBuild {
  id: string;
  appId: string;
  versionName: string;
  versionCode: number;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  sha256: string;
  minSdk: number;
  minAndroidVersion: string;
  targetSdk: number;
  permissions: string[];
  abis: string[];
  signatureFingerprint: string;
  isSigned: boolean;
  isDebug: boolean;
  scanStatus: 'clean' | 'scanning' | 'flagged' | 'blocked';
  scanEngine: string;
  scanDetails: string;
  status: 'Ready' | 'Processing' | 'Scanning' | 'Failed' | 'Blocked' | 'Draft';
  channel: 'Production' | 'Beta' | 'Internal' | 'Alpha';
  isLatest: boolean;
  uploadedAt: string;
  uploadedBy: string;
  releaseNotes: string;
  downloadCount: number;
  downloadUrl: string;
  shareableToken: string;
  downloadLimit?: number;
  expiresAt?: string;
  passwordProtected?: boolean;
  requireSignIn?: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  slug: string;
  packageName: string;
  description: string;
  shortDescription: string;
  category: string;
  icon: string;
  bannerColor: string;
  visibility: 'Public' | 'Unlisted' | 'Private';
  isVerified: boolean;
  developerName: string;
  developerUsername: string;
  supportEmail: string;
  websiteUrl: string;
  privacyPolicyUrl: string;
  screenshots: string[];
  builds: ApkBuild[];
  totalDownloads: number;
  totalViews: number;
  rating: number;
  ratingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tester {
  id: string;
  email: string;
  name: string;
  avatar: string;
  group: 'QA' | 'Beta' | 'VIP' | 'Internal';
  joinedAt: string;
  device?: string;
  osVersion?: string;
  status: 'active' | 'invited';
}

export interface TesterFeedback {
  id: string;
  appId: string;
  buildVersion: string;
  testerEmail: string;
  testerName: string;
  comment: string;
  rating: number;
  deviceInfo: string;
  createdAt: string;
}

export interface DownloadEvent {
  id: string;
  appId: string;
  appName: string;
  version: string;
  timestamp: string;
  country: string;
  countryCode: string;
  deviceModel: string;
  osVersion: string;
  ipHash: string;
  source: 'direct' | 'qr' | 'link' | 'referral';
}

export interface ApiToken {
  id: string;
  name: string;
  tokenPreview: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: string[];
  secret: string;
  status: 'active' | 'failing';
  lastDeliveredAt: string;
  successRate: number;
}

export interface CloudBuildJob {
  id: string;
  appId: string;
  appName: string;
  commitHash: string;
  commitMessage: string;
  branch: string;
  profile: 'release' | 'preview' | 'development';
  status: 'queued' | 'building' | 'finished' | 'failed';
  startedAt: string;
  duration: string;
  triggeredBy: string;
  artifactsUrl?: string;
  logs: string[];
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Processing';
  plan: string;
  pdfUrl: string;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  actorEmail: string;
  action: string;
  target: string;
  ipAddress: string;
  timestamp: string;
}

export interface AbuseReport {
  id: string;
  appId: string;
  appName: string;
  reportedBy: string;
  reason: 'Malware / Virus' | 'Phishing / Impersonation' | 'Copyright Violation' | 'Illegal Content' | 'Other';
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'build' | 'security' | 'team' | 'billing' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

// ---------------------------------------------------
// Onboarding Blueprint Types (ONB-01 -> ONB-07)
// ---------------------------------------------------

export type OnboardingStepId =
  | 'welcome'
  | 'profile_workspace'
  | 'role_goal'
  | 'connect_provider'
  | 'choose_start'
  | 'invite_team'
  | 'setup_complete';

export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped' | 'connected' | 'failed';

export interface OnboardingState {
  workspaceId?: string;
  workspaceName: string;
  workspaceSlug: string;
  companyName?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep: OnboardingStepId;
  stepNumber: number;
  totalSteps: number;
  steps: {
    welcome: StepStatus;
    profile_workspace: StepStatus;
    role_goal: StepStatus;
    connect_provider: StepStatus;
    choose_start: StepStatus;
    invite_team: StepStatus;
    setup_complete: StepStatus;
  };
  answers: {
    fullName: string;
    role?: string;
    primaryGoal?: string;
    teamSize?: string;
  };
  provider: {
    connected: boolean;
    providerName?: 'github' | 'gitlab' | 'bitbucket';
    accountName?: string;
    scope?: string;
  };
  startingPoint: {
    type?: 'import' | 'dashboard';
    repository?: string;
    branch?: string;
    framework?: 'React Native CLI' | 'Expo';
  };
  teamInvites: Array<{
    email: string;
    role: 'developer' | 'viewer' | 'admin';
  }>;
  onboardingCompletedAt?: string | null;
}

// ---------------------------------------------------
// Real React Native Build, Distribution & Deployment (BDP-01 -> BDP-25)
// ---------------------------------------------------

export type GitProviderType = 'github' | 'gitlab' | 'bitbucket';
export type ProjectFrameworkType = 'Expo Managed' | 'Expo Prebuild' | 'React Native CLI' | 'Unsupported';
export type BuildPlatform = 'android' | 'ios' | 'android_ios';
export type BuildProfile = 'development' | 'preview' | 'production';

export type RealBuildStatus =
  | 'queued'
  | 'preparing'
  | 'cloning'
  | 'analyzing'
  | 'installing'
  | 'building'
  | 'signing'
  | 'validating'
  | 'uploading'
  | 'success'
  | 'failed'
  | 'cancelled';

export type RealDeploymentStatus =
  | 'not_started'
  | 'validating'
  | 'uploading'
  | 'processing'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'failed';

export interface ProjectAnalysisReport {
  projectName: string;
  framework: ProjectFrameworkType;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  reactNativeVersion: string;
  expoSdkVersion?: string;
  nodeVersion: string;
  hasAndroid: boolean;
  hasIos: boolean;
  hasTypeScript: boolean;
  detectedPackageName: string;
  detectedBundleId: string;
  checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; detail: string }>;
  warnings: string[];
}

export interface BuildJobRecord {
  id: string;
  projectId: string;
  projectName: string;
  repoFullName: string;
  branch: string;
  commitSha: string;
  commitMessage: string;
  commitAuthor: string;
  platform: 'android' | 'ios';
  profile: BuildProfile;
  buildEngine: 'eas' | 'custom_worker';
  status: RealBuildStatus;
  currentStage: string;
  progressPercent: number;
  logs: Array<{ timestamp: string; stage: string; message: string }>;
  artifact?: {
    type: 'apk' | 'aab' | 'ipa';
    fileName: string;
    fileSizeFormatted: string;
    downloadUrl: string;
    sha256: string;
    packageName: string;
    versionName: string;
    versionCode: number;
  };
  startedAt: string;
  completedAt?: string;
  durationFormatted?: string;
  errorMessage?: string;
}

export interface DistributionRecord {
  id: string;
  buildId: string;
  projectId: string;
  projectName: string;
  method: 'android_direct_download' | 'testflight' | 'adhoc';
  status: 'available' | 'revoked' | 'expired';
  accessMode: 'link' | 'workspace_auth' | 'invited_testers';
  shareUrl: string;
  shareToken: string;
  qrCodeSvg?: string;
  expiresAt?: string | null;
  downloadCount: number;
  installPromptGuide: boolean;
  createdAt: string;
}

export interface DeploymentRecord {
  id: string;
  buildId: string;
  projectId: string;
  projectName: string;
  destination: 'google_play' | 'apple_app_store';
  track: 'internal' | 'closed' | 'open' | 'production' | 'testflight' | 'app_store';
  status: RealDeploymentStatus;
  releaseNotes: string;
  externalSubmissionId?: string;
  submittedAt: string;
  updatedAt: string;
  logs: Array<{ timestamp: string; message: string }>;
}

