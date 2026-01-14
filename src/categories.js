/**
 * AAC Categories Configuration
 *
 * Each category has:
 * - id: unique identifier
 * - label: display text and what gets spoken for the action
 * - icon: emoji icon (or image path)
 * - items: array of selectable items
 *
 * Each item has:
 * - id: unique identifier
 * - label: what gets displayed and spoken
 * - icon: emoji icon (or image path for custom items like people)
 *
 * To customize for a specific user:
 * 1. Edit the "people" category with their family/friends
 * 2. Add/remove items from any category
 * 3. Change labels to match their vocabulary
 */

const categories = [
  {
    id: 'responses',
    label: '',  // Empty because responses are standalone (just "Yes", not "Response Yes")
    icon: '💬',
    items: [
      { id: 'yes', label: 'Yes', icon: '✅' },
      { id: 'no', label: 'No', icon: '❌' },
      { id: 'maybe', label: 'Maybe', icon: '🤔' },
      { id: 'idk', label: "I don't know", icon: '🤷' },
      { id: 'help', label: 'I need help', icon: '🆘' },
      { id: 'wait', label: 'Wait', icon: '✋' },
    ],
  },
  {
    id: 'feelings',
    label: 'I feel',
    icon: '😊',
    items: [
      { id: 'happy', label: 'happy', icon: '😊' },
      { id: 'sad', label: 'sad', icon: '😢' },
      { id: 'tired', label: 'tired', icon: '😴' },
      { id: 'pain', label: 'in pain', icon: '😣' },
      { id: 'sick', label: 'sick', icon: '🤒' },
      { id: 'anxious', label: 'anxious', icon: '😰' },
      { id: 'frustrated', label: 'frustrated', icon: '😤' },
      { id: 'good', label: 'good', icon: '👍' },
      { id: 'hot', label: 'hot', icon: '🥵' },
      { id: 'cold', label: 'cold', icon: '🥶' },
    ],
  },
  {
    id: 'needs',
    label: 'I need',
    icon: '🙋',
    items: [
      { id: 'bathroom', label: 'the bathroom', icon: '🚽' },
      { id: 'water', label: 'water', icon: '💧' },
      { id: 'medicine', label: 'medicine', icon: '💊' },
      { id: 'rest', label: 'to rest', icon: '🛏️' },
      { id: 'blanket', label: 'a blanket', icon: '🛋️' },
      { id: 'glasses', label: 'my glasses', icon: '👓' },
      { id: 'phone', label: 'my phone', icon: '📱' },
      { id: 'quiet', label: 'quiet', icon: '🤫' },
    ],
  },
  {
    id: 'watch',
    label: 'Watch',
    icon: '📺',
    items: [
      { id: 'tv', label: 'TV', icon: '📺' },
      { id: 'movie', label: 'a movie', icon: '🎬' },
      { id: 'news', label: 'the news', icon: '📰' },
      { id: 'sports', label: 'sports', icon: '⚽' },
      { id: 'gameshow', label: 'a game show', icon: '🎯' },
      { id: 'comedy', label: 'something funny', icon: '😂' },
    ],
  },
  {
    id: 'eat',
    label: 'Eat',
    icon: '🍽️',
    items: [
      { id: 'breakfast', label: 'breakfast', icon: '🍳' },
      { id: 'lunch', label: 'lunch', icon: '🥪' },
      { id: 'dinner', label: 'dinner', icon: '🍽️' },
      { id: 'snack', label: 'a snack', icon: '🍪' },
      { id: 'fruit', label: 'fruit', icon: '🍎' },
      { id: 'soup', label: 'soup', icon: '🍲' },
      { id: 'salad', label: 'salad', icon: '🥗' },
      { id: 'dessert', label: 'dessert', icon: '🍰' },
    ],
  },
  {
    id: 'drink',
    label: 'Drink',
    icon: '🥤',
    items: [
      { id: 'water', label: 'water', icon: '💧' },
      { id: 'tea', label: 'tea', icon: '🍵' },
      { id: 'coffee', label: 'coffee', icon: '☕' },
      { id: 'juice', label: 'juice', icon: '🧃' },
      { id: 'milk', label: 'milk', icon: '🥛' },
      { id: 'soda', label: 'soda', icon: '🥤' },
    ],
  },
  {
    id: 'people',
    label: 'Talk to',
    icon: '👥',
    // Add your own people here with their photos
    // Example: { id: 'mom', label: 'Mom', icon: '👩', image: require('./images/mom.png') }
    items: [
      { id: 'family', label: 'family', icon: '👨‍👩‍👧‍👦' },
      { id: 'doctor', label: 'the doctor', icon: '👨‍⚕️' },
      { id: 'nurse', label: 'the nurse', icon: '👩‍⚕️' },
      { id: 'friend', label: 'a friend', icon: '🧑‍🤝‍🧑' },
      // Add custom people with photos:
      // { id: 'john', label: 'John', image: require('./images/john.png') },
    ],
  },
  {
    id: 'places',
    label: 'Go to',
    icon: '🏠',
    items: [
      { id: 'bedroom', label: 'the bedroom', icon: '🛏️' },
      { id: 'bathroom', label: 'the bathroom', icon: '🚽' },
      { id: 'kitchen', label: 'the kitchen', icon: '🍳' },
      { id: 'outside', label: 'outside', icon: '🌳' },
      { id: 'living-room', label: 'the living room', icon: '🛋️' },
    ],
  },
];

export default categories;
