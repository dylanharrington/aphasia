# SpeakEasy AAC

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://aphasia-alpha.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-purple)](https://web.dev/progressive-web-apps/)

A free, open-source communication aid (AAC app) for people with aphasia, stroke recovery, ALS, or other conditions that affect speech. Users tap pictures organized in categories to build phrases that are spoken aloud.

**[Try the Live Demo](https://aphasia-alpha.vercel.app)**

## How It Works

1. **Choose a category** - Tap a category like "I feel", "I need", "Eat", etc.
2. **Select an item** - Tap a specific item within that category
3. **Hear it spoken** - The phrase is automatically spoken (e.g., "I feel tired")
4. **Repeat if needed** - Tap "Speak Again" to repeat the phrase

## Features

- Large, easy-to-tap buttons designed for accessibility
- Uses emoji icons (no images needed for basic use)
- Voice selection and speed control in settings
- Works on phones, tablets, and computers
- Can be installed as an app on mobile devices (PWA)
- **Optional cloud sync** - Sign up to save customizations across devices
- **Built-in editor** - Customize categories and items with an emoji picker (requires account)
- **About page** - Learn about the app and who it's for

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Guest Mode vs. Signed In

**Guest Mode (no account needed):**
- Full AAC functionality works immediately
- Settings saved locally on your device
- Default categories available

**With Account:**
- Customize categories and items via the Editor
- Visual emoji picker for choosing icons
- Upload custom photos for people
- Sync across all your devices
- Settings backed up to the cloud

## Setting Up Cloud Sync (Optional)

To enable accounts and cloud sync:

1. Create a free [Supabase](https://supabase.com) project
2. Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor
3. Copy your project URL and anon key from Settings > API
4. Create `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Restart the dev server

## Deploying to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Deploy

The app works without Supabase configured - users just won't see login/editor options.

## Local Customization (Without Account)

Edit `src/lib/defaultCategories.js` to change the default categories for all users.

## Tech Stack

- **React 18** with Vite (fast builds, minimal dependencies)
- **Supabase** for auth and database (optional)
- **Web Speech API** for text-to-speech

## Accessibility

- Large touch targets (140px+ buttons)
- High contrast dark theme
- Supports `prefers-reduced-motion`
- Supports `prefers-contrast: high`
- Screen reader friendly with ARIA labels
- Keyboard navigable

## Project Structure

```
src/
├── components/
│   ├── App.jsx           # Main AAC interface
│   ├── auth/             # Login/signup components
│   └── editor/           # Customization UI
├── hooks/
│   ├── useCategories.jsx # Data management
│   └── useSpeech.js      # Text-to-speech
├── lib/
│   ├── supabase.js       # Database client
│   └── defaultCategories.js
└── styles/
```

## Background

This app was originally built to help a mother with aphasia communicate with her family. It's been open-sourced so others in similar situations can use and customize it for their loved ones.

## License

MIT - Feel free to use, modify, and share.
