import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'speakeasy-voice-settings';

// Filter out novelty/joke voices that aren't suitable for AAC
const EXCLUDED_VOICES = [
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos',
  'Deranged', 'Good News', 'Hysterical', 'Jester', 'Organ', 'Superstar',
  'Trinoids', 'Whisper', 'Wobble', 'Zarvox', 'Ralph', 'Kathy',
  'Junior', 'Fred', 'Pipe Organ', 'Princess'
];

const isUsableVoice = (voice) => {
  const name = voice.name;
  return !EXCLUDED_VOICES.some((excluded) =>
    name.toLowerCase().includes(excluded.toLowerCase())
  );
};

export function useSpeech() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(0.9);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const availableVoices = allVoices.filter(isUsableVoice);
      if (availableVoices.length > 0) {
        setVoices(availableVoices);

        // Try to restore saved voice preference
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const { voiceName, rate: savedRate } = JSON.parse(saved);
            const savedVoice = availableVoices.find((v) => v.name === voiceName);
            if (savedVoice) {
              setSelectedVoice(savedVoice);
            }
            if (savedRate) {
              setRate(savedRate);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }

        // If no saved voice, find a good default
        if (!selectedVoice) {
          const preferredVoice =
            availableVoices.find(
              (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
            ) ||
            availableVoices.find((v) => v.lang.startsWith('en')) ||
            availableVoices[0];
          setSelectedVoice(preferredVoice);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Save voice preference when it changes
  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ voiceName: selectedVoice.name, rate })
      );
    }
  }, [selectedVoice, rate]);

  const speak = useCallback(
    (text) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice, rate]
  );

  const selectVoice = useCallback((voiceName) => {
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  }, [voices]);

  return {
    voices,
    selectedVoice,
    rate,
    setRate,
    selectVoice,
    speak,
  };
}
