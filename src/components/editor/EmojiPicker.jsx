import React, { useState } from 'react';

const EMOJI_CATEGORIES = {
  'Smileys': ['😊', '😢', '😴', '😣', '🤒', '😰', '😤', '😂', '🥰', '😌', '🤔', '😮', '🥺', '😡', '🤢', '🥵', '🥶', '😱', '🤗', '😇'],
  'Gestures': ['👍', '👎', '✋', '👋', '🙏', '💪', '👏', '🤝', '✅', '❌', '🆘', '❓', '❗', '🤷', '🙋', '🙌'],
  'People': ['👤', '👥', '👨‍👩‍👧‍👦', '👨‍⚕️', '👩‍⚕️', '👴', '👵', '👶', '🧑‍🤝‍🧑', '💑', '👨', '👩', '🧒'],
  'Food & Drink': ['🍽️', '🍳', '🥪', '🍲', '🥗', '🍎', '🍰', '🍪', '☕', '🍵', '🥛', '🧃', '🥤', '💧', '🍕', '🍔', '🌮', '🍜'],
  'Activities': ['📺', '🎬', '📰', '⚽', '🎯', '🎮', '📱', '💊', '🛏️', '🚽', '🛋️', '👓', '📖', '🎵', '🎨'],
  'Places': ['🏠', '🏥', '🏪', '🌳', '🚗', '✈️', '🏖️', '⛪', '🏫'],
  'Symbols': ['💬', '💭', '❤️', '💔', '⭐', '🔔', '🎁', '🎉', '🌙', '☀️', '🌧️', '❄️'],
};

export default function EmojiPicker({ value, onChange, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Smileys');

  const handleSelect = (emoji) => {
    onChange(emoji);
    onClose();
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-header">
        <span className="emoji-picker-title">Choose an emoji</span>
        <button className="emoji-picker-close" onClick={onClose}>×</button>
      </div>

      <div className="emoji-picker-tabs">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            className={`emoji-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {EMOJI_CATEGORIES[category][0]}
          </button>
        ))}
      </div>

      <div className="emoji-picker-label">{activeCategory}</div>

      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
          <button
            key={emoji}
            className={`emoji-option ${value === emoji ? 'selected' : ''}`}
            onClick={() => handleSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EmojiInput({ value, onChange, placeholder = 'Icon' }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="emoji-input-wrapper">
      <button
        type="button"
        className="emoji-input-button"
        onClick={() => setShowPicker(true)}
      >
        {value || <span className="emoji-placeholder">{placeholder}</span>}
      </button>

      {showPicker && (
        <div className="emoji-picker-overlay" onClick={() => setShowPicker(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <EmojiPicker
              value={value}
              onChange={onChange}
              onClose={() => setShowPicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
