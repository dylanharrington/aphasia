import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import { AuthModal } from './auth/LoginForm';
import { useCategories } from '../hooks/useCategories';
import { useSpeech } from '../hooks/useSpeech';
import Editor from './editor/Editor';
import About from './About';
import '../styles/app.css';

// Simple line icons as SVG components
const Icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  edit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  signIn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  ),
};

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
        <div className="header-nav">
          <div className="header-left">
            {selectedCategory && (
              <button
                className="nav-button"
                onClick={handleBack}
                aria-label="Go back"
                title="Back"
              >
                <span role="img" aria-hidden="true">←</span>
              </button>
            )}
          </div>

          <div className="header-actions">
          {selectedCategory && (
            <button
              className="nav-button"
              onClick={handleHome}
              aria-label="Go home"
              title="Home"
            >
              {Icons.home}
            </button>
          )}
          <button
            className="nav-button"
            onClick={() => navigate('/about')}
            aria-label="About this app"
            title="About"
          >
            {Icons.info}
          </button>
          <button
            className="nav-button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Voice settings"
            title="Voice Settings"
          >
            {Icons.settings}
          </button>
          {user ? (
            <>
              <button
                className="nav-button"
                onClick={() => navigate('/editor')}
                aria-label="Edit categories"
                title="Edit Categories"
              >
                {Icons.edit}
              </button>
              <button
                className="nav-button user-button"
                onClick={() => {
                  if (window.confirm('Sign out?')) {
                    signOut();
                  }
                }}
                aria-label="Sign out"
                title={`Sign out (${user.email})`}
              >
                {Icons.user}
              </button>
            </>
          ) : isConfigured ? (
            <button
              className="nav-button"
              onClick={() => setShowAuthModal(true)}
              aria-label="Sign in"
              title="Sign In"
            >
              {Icons.signIn}
            </button>
          ) : null}
          </div>
        </div>

        <h1 className="title">
          SpeakEasy
          {selectedCategory && (
            <span className="title-breadcrumb">
              <span className="title-separator">›</span>
              {selectedCategory.label || selectedCategory.id}
            </span>
          )}
        </h1>
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
      <Route path="/about" element={<About />} />
      <Route path="/editor/*" element={<Editor />} />
    </Routes>
  );
}
