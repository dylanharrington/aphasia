# SpeakEasy AAC

A simple communication aid for people with aphasia, stroke recovery, or other conditions that affect speech. Users tap pictures organized in categories to build phrases that are spoken aloud.

## How It Works

1. **Choose a category** - Tap a category like "I feel", "I need", "Eat", etc.
2. **Select an item** - Tap a specific item within that category
3. **Hear it spoken** - The phrase is automatically spoken (e.g., "I feel tired")
4. **Repeat if needed** - Tap "Speak Again" to repeat the phrase

## Features

- Large, easy-to-tap buttons designed for accessibility
- Uses emoji icons (no images needed for basic use)
- Voice selection in settings
- Works on phones, tablets, and computers
- Can be installed as an app on mobile devices (PWA)
- Works offline once loaded

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Customizing for Your Loved One

The main file to edit is `src/categories.js`. This contains all the categories and items.

### Adding Custom People with Photos

1. Add photos to the `src/images/` folder (PNG or JPG)
2. Edit `src/categories.js` and find the `people` category
3. Add entries like this:

```javascript
{
  id: 'people',
  label: 'Talk to',
  icon: '👥',
  items: [
    { id: 'mom', label: 'Mom', image: require('./images/mom.png') },
    { id: 'dad', label: 'Dad', image: require('./images/dad.png') },
    { id: 'doctor', label: 'the doctor', icon: '👨‍⚕️' },
    // ... more people
  ],
}
```

### Adding or Modifying Categories

Each category has:
- `id` - A unique identifier
- `label` - What gets spoken before the item (e.g., "I need" + "water" = "I need water")
- `icon` - An emoji shown on the category button
- `items` - Array of selectable items

Each item has:
- `id` - A unique identifier
- `label` - What gets displayed and spoken
- `icon` - An emoji (or `image` for a photo path)

### Example: Adding a "Pain" Category

```javascript
{
  id: 'pain',
  label: 'My',
  icon: '🩹',
  items: [
    { id: 'head', label: 'head hurts', icon: '🤕' },
    { id: 'stomach', label: 'stomach hurts', icon: '🤢' },
    { id: 'back', label: 'back hurts', icon: '😣' },
    { id: 'legs', label: 'legs hurt', icon: '🦵' },
  ],
}
```

## Deployment

To create a production build:

```bash
npm run build
```

The `build` folder can be deployed to any static hosting service like GitHub Pages, Netlify, or Vercel.

## Accessibility

This app is designed with accessibility in mind:
- Large touch targets (minimum 120px)
- High contrast colors
- Supports reduced motion preferences
- Supports high contrast mode
- Screen reader friendly with proper ARIA labels
- Keyboard navigable

## Background

This app was originally built to help a mother with aphasia communicate with her family. It's been open-sourced so others in similar situations can use and customize it for their loved ones.

## License

MIT - Feel free to use, modify, and share.
