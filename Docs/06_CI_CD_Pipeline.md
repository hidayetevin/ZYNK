# CI/CD Pipeline Stratejisi

## 🚀 Genel Bakış

Otomatik test, build ve deployment için **GitHub Actions** kullanılacak.

---

## 📋 Pipeline Aşamaları

1. **Lint & Type Check** → ESLint + TypeScript
2. **Unit Tests** → Vitest
3. **Build Web** → Vite production build
4. **Deploy Staging** → Firebase Hosting
5. **Build Mobile** → Capacitor (iOS/Android)
6. **Deploy Stores** → Fastlane (manual approval)

---

## 🔧 Main CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:ci

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
```

---

## 🌐 Deploy Workflows

### Staging (develop branch)
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          firebaseServiceAccount: '${{ secrets.FIREBASE_STAGING }}'
          channelId: staging
```

### Production (tags)
```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production
on:
  push:
    tags: ['v*.*.*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build:production
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          firebaseServiceAccount: '${{ secrets.FIREBASE_PROD }}'
          channelId: live
```

---

## 📱 Mobile Build Workflows

### Android
```yaml
jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'
      - run: npm ci && npm run build:production
      - run: npx cap sync android
      - working-directory: ./android
        run: ./gradlew assembleRelease
```

### iOS
```yaml
jobs:
  build-ios:
    runs-on: macos-latest
    steps:
      - run: npm ci && npm run build:production
      - run: npx cap sync ios
      - working-directory: ./ios/App
        run: xcodebuild -workspace App.xcworkspace -scheme App archive
```

---

## 📊 Performance Monitoring (Lighthouse CI)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: http://localhost:5000
          budgetPath: ./lighthouserc.json
```

---

## 🔐 Required Secrets

GitHub Repository Secrets:
- `FIREBASE_SERVICE_ACCOUNT_STAGING`
- `FIREBASE_SERVICE_ACCOUNT_PROD`
- `ANDROID_SIGNING_KEY`
- `ANDROID_KEYSTORE_PASSWORD`
- `APPLE_CERTIFICATES`

---

Bu pipeline ile her commit otomatik test edilir ve deploy edilir! 🚀
