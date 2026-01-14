import React, { useState, useEffect, useCallback } from 'react';
import categories from './categories';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Try to find a good default voice
        const preferredVoice = availableVoices.find(
          (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
        ) || availableVoices.find((v) => v.lang.startsWith('en')) || availableVoices[0];
        setSelectedVoice(preferredVoice);
      }
    };

    loadVoices();
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    // Construct the phrase
    const phrase = selectedCategory.label
      ? `${selectedCategory.label} ${item.label}`
      : item.label;
    speak(phrase);
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleHome = () => {
    setSelectedCategory(null);
    setSelectedItem(null);
  };

  const handleRepeat = () => {
    if (selectedItem && selectedCategory) {
      const phrase = selectedCategory.label
        ? `${selectedCategory.label} ${selectedItem.label}`
        : selectedItem.label;
      speak(phrase);
    }
  };

  // Render category grid
  const renderCategories = () => (
    <div className="grid">
      {categories.map((category) => (
        <button
          key={category.id}
          className="card"
          onClick={() => handleCategorySelect(category)}
          aria-label={category.label || category.id}
        >
          <span className="card-icon" role="img" aria-hidden="true">
            {category.icon}
          </span>
          <span className="card-label">{category.label || category.id}</span>
        </button>
      ))}
    </div>
  );

  // Render items within a category
  const renderItems = () => (
    <div className="grid">
      {selectedCategory.items.map((item) => (
        <button
          key={item.id}
          className={`card ${selectedItem?.id === item.id ? 'selected' : ''}`}
          onClick={() => handleItemSelect(item)}
          aria-label={item.label}
        >
          {item.image ? (
            <img src={item.image} alt="" className="card-image" />
          ) : (
            <span className="card-icon" role="img" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="card-label">{item.label}</span>
        </button>
      ))}
    </div>
  );

  // Render the confirmation/speak again view
  const renderConfirmation = () => {
    const phrase = selectedCategory.label
      ? `${selectedCategory.label} ${selectedItem.label}`
      : selectedItem.label;

    return (
      <div className="confirmation">
        <div className="phrase">{phrase}</div>
        {selectedItem.image ? (
          <img src={selectedItem.image} alt="" className="confirmation-image" />
        ) : (
          <span className="confirmation-icon" role="img" aria-hidden="true">
            {selectedItem.icon}
          </span>
        )}
        <button className="speak-button" onClick={handleRepeat} aria-label="Speak again">
          <span role="img" aria-hidden="true">🔊</span>
          <span>Speak Again</span>
        </button>
      </div>
    );
  };

  // Render settings panel
  const renderSettings = () => (
    <div className="settings-panel">
      <h2>Voice Settings</h2>
      <label htmlFor="voice-select">Select Voice:</label>
      <select
        id="voice-select"
        value={selectedVoice?.name || ''}
        onChange={(e) => {
          const voice = voices.find((v) => v.name === e.target.value);
          setSelectedVoice(voice);
        }}
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <button className="test-voice" onClick={() => speak('Hello, this is a test.')}>
        Test Voice
      </button>
      <button className="close-settings" onClick={() => setShowSettings(false)}>
        Done
      </button>
    </div>
  );

  return (
    <div className="app">
      <header className="header">
        {selectedCategory && (
          <button className="nav-button" onClick={handleBack} aria-label="Go back">
            <span role="img" aria-hidden="true">←</span>
          </button>
        )}
        <h1 className="title">
          {selectedCategory ? (selectedCategory.label || selectedCategory.id) : 'SpeakEasy'}
        </h1>
        <div className="header-actions">
          {selectedCategory && (
            <button className="nav-button" onClick={handleHome} aria-label="Go home">
              <span role="img" aria-hidden="true">🏠</span>
            </button>
          )}
          <button className="nav-button" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
            <span role="img" aria-hidden="true">⚙️</span>
          </button>
        </div>
      </header>

      <main className="main">
        {showSettings && renderSettings()}

        {!showSettings && !selectedCategory && renderCategories()}

        {!showSettings && selectedCategory && !selectedItem && renderItems()}

        {!showSettings && selectedCategory && selectedItem && renderConfirmation()}
      </main>
    </div>
  );
}

export default App;
