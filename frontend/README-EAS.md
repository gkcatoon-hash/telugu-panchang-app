# EAS Build — ManaLife Calendar

Everything you need to build the signed Android App Bundle (`.aab`) for Google
Play from your local machine.

---

## 0 · One-time prerequisites (do these once)

```bash
# On your local machine (Mac, Linux or Windows WSL2)
npm install -g eas-cli
eas login          # sign in with your Expo account
```

If you do not yet have an Expo account, create one for free at
<https://expo.dev/signup>.

You also need a Google Play Developer account ($25 one-time fee) at
<https://play.google.com/console>.

---

## 1 · Get the code

```bash
# From Emergent editor: click "Save to GitHub", then on your local machine:
git clone https://github.com/<your-user>/<your-repo>.git
cd <your-repo>/frontend
yarn install
```

---

## 2 · Link the project to your Expo account (one-time)

```bash
cd frontend
eas init          # picks / creates the Expo project and writes projectId
```

`eas init` will inject three fields into `app.json`:

- `expo.owner`  — your Expo username
- `extra.eas.projectId`  — unique project id
- `updates.url`  — for OTA updates (optional)

Commit these changes back to your repo.

---

## 3 · Build the signed AAB

```bash
cd frontend
eas build --platform android --profile production
```

- On first run EAS asks _"Generate a new Android Keystore?"_ — **choose Yes**.
  EAS will generate & store the keystore securely in your Expo account.
  You never need to manage the `.jks` file yourself — but you MUST keep the
  same Expo account or all future updates will be rejected by Google.
- Build runs in EAS cloud, ~10-20 minutes.
- When done EAS prints a URL — download the `.aab` from there or from
  <https://expo.dev/accounts/{owner}/projects/manalife-calendar/builds>.

---

## 4 · Upload the AAB to Play Console — Internal Testing

You can do this two ways.

### Option A · Manual (recommended for first release)

1. Go to <https://play.google.com/console>
2. **Create app** → name "ManaLife Calendar", default language, Free app, all
   declarations, then **Create**.
3. In the left sidebar → **Testing → Internal testing → Create new release**.
4. Upload the `.aab` you downloaded in step 3.
5. Add release notes (see `release-notes.txt` in this folder).
6. **Review release → Roll out to Internal testing**.
7. Under **Testers**, add your test emails / create a tester list.
8. Share the opt-in URL Google gives you with your testers.

Play Console will *also* require you to complete the Store listing, Data safety,
Content rating, Target audience and Privacy policy URL sections before it
allows external testing tracks. Everything you need is in
`store-listing.md`.

### Option B · Automated via `eas submit`

Once you have already uploaded one `.aab` manually (or set up a Google service
account with the Play Console API):

```bash
eas submit --platform android --profile production
```

This uses the `submit.production.android` config already defined in `eas.json`:

```json
"submit": {
  "production": {
    "android": {
      "track": "internal",
      "releaseStatus": "draft"
    }
  }
}
```

---

## 5 · Ship updates (v1.0.1+)

Two ways:

1. **Native update** — bump `expo.version` and `expo.android.versionCode` in
   `app.json`, then `eas build --platform android --profile production` again
   and upload the new AAB.
2. **OTA update** (JS-only changes) — `eas update --channel production`
   pushes new JS to already-installed devices without a Play Store re-review.
   Requires `expo-updates` to be installed and configured.

---

## Known runtime notes

- **Notifications**: `expo-notifications` is wired up but the daily 6:30 AM
  reminder requires Firebase Cloud Messaging on real devices. Ship v1.0.0
  without it (notification code no-ops gracefully) and add
  `google-services.json` at repo root in v1.0.1 to light it up.
- **Backend heartbeat**: The FastAPI server at `/api/` is used only to serve
  the Privacy Policy page. The mobile app itself is 100% offline.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `eas init` fails with "project already exists" | Delete `extra.eas.projectId` from `app.json` and retry |
| Play Console rejects AAB with "same signature required" | You built with a different Expo account. Log back in to the original account that owns the keystore. |
| Build fails on "duplicate strings.xml entry" | Run `yarn && npx expo prebuild --clean` locally, delete `android/` folder, re-run `eas build` |
| First tester install shows blank white | Kill and re-open the app once — Expo Router hydrates on second launch |
