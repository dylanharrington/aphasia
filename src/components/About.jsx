import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about">
      <header className="about-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>About SpeakEasy</h1>
      </header>

      <main className="about-content">
        <section className="about-section">
          <h2>What is this?</h2>
          <p>
            SpeakEasy is an <strong>AAC app</strong> (Augmentative and Alternative
            Communication) — a tool that helps people who have difficulty speaking
            communicate with others.
          </p>
          <p>
            Users tap pictures organized into categories to build phrases, which are
            then spoken aloud by the device. It's designed to be simple enough for
            someone with cognitive difficulties to use, while being powerful enough
            to express a wide range of needs and feelings.
          </p>
        </section>

        <section className="about-section">
          <h2>Why was it made?</h2>
          <p>
            This app was originally built for a mother with <strong>aphasia</strong> —
            a condition that affects the ability to speak and find words, often caused
            by stroke or brain injury. She could understand everything around her but
            struggled to say what she wanted to say.
          </p>
          <p>
            Her son built this app so she could tap on pictures to communicate her
            needs: what she wanted to eat, how she was feeling, who she wanted to
            talk to. It gave her a voice when words failed her.
          </p>
          <p>
            After she passed, the app was open-sourced so other families in similar
            situations could use and customize it for their loved ones.
          </p>
        </section>

        <section className="about-section">
          <h2>Who is it for?</h2>
          <ul>
            <li>People with <strong>aphasia</strong> (from stroke, brain injury, dementia)</li>
            <li>People recovering from <strong>surgery</strong> affecting speech</li>
            <li>People with <strong>ALS</strong>, Parkinson's, or other conditions affecting speech</li>
            <li>Anyone who needs help communicating verbally</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul>
            <li><strong>Simple interface</strong> — Large buttons, clear icons</li>
            <li><strong>Text-to-speech</strong> — Tap to hear phrases spoken aloud</li>
            <li><strong>Customizable</strong> — Add your own categories, items, and photos</li>
            <li><strong>Works offline</strong> — No internet needed after first load</li>
            <li><strong>Free and open source</strong> — No ads, no tracking, no cost</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Customization</h2>
          <p>
            Create an account to customize the categories and items for your loved one.
            You can add photos of family members, favorite foods, or anything else that
            helps them communicate.
          </p>
          <p>
            Your customizations sync across devices, so changes made on a tablet appear
            on a phone too.
          </p>
        </section>

        <section className="about-section">
          <h2>Open Source</h2>
          <p>
            This project is open source and available on{' '}
            <a
              href="https://github.com/dylanharrington/aphasia"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . Contributions, suggestions, and feedback are welcome.
          </p>
        </section>
      </main>
    </div>
  );
}
