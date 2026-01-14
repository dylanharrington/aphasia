import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { AuthModal } from './auth/LoginForm';
import { useCategories } from '../hooks/useCategories';
import { useSpeech } from '../hooks/useSpeech';
import Editor from './editor/Editor';
import '../styles/app.css';

function MainApp() {
  const { user, signOut, isConfigured } = useAuth();
  const { categories, loading } = useCategories();
  const { voices, selectedVoice, rate, setRate, selectVoice, speak } = useSpeech();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
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

  // Category grid
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

  // Items grid
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

  // Confirmation view
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

  // Settings panel
  const renderSettings = () => (
    <div className="settings-panel">
      <h2>Voice Settings</h2>
      <label htmlFor="voice-select">Select Voice:</label>
      <select
        id="voice-select"
        value={selectedVoice?.name || ''}
        onChange={(e) => selectVoice(e.target.value)}
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>

      <label htmlFor="rate-slider">Speech Speed:</label>
      <input
        id="rate-slider"
        type="range"
        min="0.5"
        max="1.5"
        step="0.1"
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
      />
      <span className="rate-value">{rate.toFixed(1)}x</span>

      <button className="test-voice" onClick={() => speak('Hello, this is a test.')}>
        Test Voice
      </button>
      <button className="close-settings" onClick={() => setShowSettings(false)}>
        Done
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          {selectedCategory && (
            <button className="nav-button" onClick={handleBack} aria-label="Go back">
              <span role="img" aria-hidden="true">←</span>
            </button>
          )}
        </div>

        <h1 className="title">
          {selectedCategory ? (selectedCategory.label || selectedCategory.id) : 'SpeakEasy'}
        </h1>

        <div className="header-actions">
          {selectedCategory && (
            <button className="nav-button" onClick={handleHome} aria-label="Go home">
              <span role="img" aria-hidden="true">🏠</span>
            </button>
          )}
          <button
            className="nav-button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            <span role="img" aria-hidden="true">⚙️</span>
          </button>
          {user ? (
            <>
              <button
                className="nav-button"
                onClick={() => navigate('/editor')}
                aria-label="Edit categories"
              >
                <span role="img" aria-hidden="true">✏️</span>
              </button>
              <button
                className="nav-button user-button"
                onClick={signOut}
                aria-label="Sign out"
                title={user.email}
              >
                <span role="img" aria-hidden="true">👤</span>
              </button>
            </>
          ) : isConfigured ? (
            <button
              className="nav-button"
              onClick={() => setShowAuthModal(true)}
              aria-label="Sign in"
            >
              <span role="img" aria-hidden="true">🔑</span>
            </button>
          ) : null}
        </div>
      </header>

      <main className="main">
        {showSettings && renderSettings()}

        {!showSettings && !selectedCategory && renderCategories()}

        {!showSettings && selectedCategory && !selectedItem && renderItems()}

        {!showSettings && selectedCategory && selectedItem && renderConfirmation()}
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/editor/*" element={<Editor />} />
    </Routes>
  );
}
