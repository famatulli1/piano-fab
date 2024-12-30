import * as Tone from 'tone';

    document.addEventListener('DOMContentLoaded', () => {
      // Create a button to unlock audio context on mobile
      const unlockAudio = () => {
        const button = document.createElement('button');
        button.textContent = 'Unlock Audio';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ffcc00';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
          Tone.start().then(() => {
            console.log('Audio context unlocked');
            document.body.removeChild(button);
          });
        });
        document.body.appendChild(button);
      };

      // Check if the audio context is suspended and show the unlock button
      if (Tone.context.state === 'suspended') {
        unlockAudio();
      }

      let synth = new Tone.Synth().toDestination();
      const keys = document.querySelectorAll('.key');
      const instrumentSelector = document.getElementById('instrument');
      const guideSelector = document.getElementById('guide');

      const instruments = {
        synth: new Tone.Synth().toDestination(),
        guitar: new Tone.PluckSynth().toDestination(),
        flute: new Tone.FMSynth({
          harmonicity: 8,
          modulationIndex: 2,
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.1
          }
        }).toDestination(),
        piano: new Tone.Sampler({
          urls: {
            C3: "C3.mp3",
            "C#3": "Cs3.mp3",
            D3: "D3.mp3",
            "D#3": "Ds3.mp3",
            E3: "E3.mp3",
            F3: "F3.mp3",
            "F#3": "Fs3.mp3",
            G3: "G3.mp3",
            "G#3": "Gs3.mp3",
            A3: "A3.mp3",
            "A#3": "As3.mp3",
            B3: "B3.mp3",
            C4: "C4.mp3",
            "C#4": "Cs4.mp3",
            D4: "D4.mp3",
            "D#4": "Ds4.mp3",
            E4: "E4.mp3",
            F4: "F4.mp3",
            "F#4": "Fs4.mp3",
            G4: "G4.mp3",
            "G#4": "Gs4.mp3",
            A4: "A4.mp3",
            "A#4": "As4.mp3",
            B4: "B4.mp3",
            C5: "C5.mp3"
          },
          baseUrl: "https://tonejs.github.io/audio/salamander/",
          onload: () => {
            console.log('Piano samples loaded');
          }
        }).toDestination()
      };

      const guides = {
        'clair-de-la-lune': ["G4", "G4", "G4", "A4", "B4", "G4", "E4", "G4", "E4", "G4", "G4", "F4", "E4", "E4", "D4", "E4", "G4", "E4", "D4", "C4"]
      };

      let currentGuide = [];
      let currentStep = 0;

      const highlightNextKey = () => {
        if (currentStep < currentGuide.length) {
          const note = currentGuide[currentStep];
          const key = document.querySelector(`.key[data-note="${note}"]`);
          if (key) {
            key.classList.add('guide');
          }
        }
      };

      const playGuide = () => {
        if (currentStep < currentGuide.length) {
          const note = currentGuide[currentStep];
          const key = document.querySelector(`.key[data-note="${note}"]`);
          if (key) {
            key.classList.add('guide');
            if (instrumentSelector && instrumentSelector.value === 'piano') {
              synth.triggerAttack(note);
            } else {
              synth.triggerAttackRelease(note, '8n');
            }
            setTimeout(() => {
              key.classList.remove('guide');
              currentStep++;
              playGuide();
            }, 500);
          }
        }
      };

      // Ensure the audio context is loaded before allowing playback
      Tone.loaded().then(() => {
        console.log('Audio context loaded');
      });

      if (instrumentSelector) {
        instrumentSelector.addEventListener('change', (e) => {
          synth = instruments[e.target.value];
        });
      }

      if (guideSelector) {
        guideSelector.addEventListener('change', (e) => {
          currentGuide = guides[e.target.value] || [];
          currentStep = 0;
          highlightNextKey();
        });
      }

      keys.forEach(key => {
        key.addEventListener('mousedown', () => {
          key.classList.add('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            Tone.loaded().then(() => {
              if (synth.loaded) {
                synth.triggerAttack(key.dataset.note);
              } else {
                console.error('Piano samples not loaded yet');
              }
            });
          } else {
            synth.triggerAttackRelease(key.dataset.note, '8n');
          }
          if (currentGuide.length > 0 && key.dataset.note === currentGuide[currentStep]) {
            key.classList.remove('guide');
            currentStep++;
            highlightNextKey();
          }
        });
        key.addEventListener('mouseup', () => {
          key.classList.remove('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            synth.triggerRelease();
          } else {
            synth.triggerRelease();
          }
        });
        key.addEventListener('mouseleave', () => {
          key.classList.remove('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            synth.triggerRelease();
          } else {
            synth.triggerRelease();
          }
        });

        // Add touch events for mobile devices
        key.addEventListener('touchstart', (e) => {
          e.preventDefault();
          key.classList.add('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            Tone.loaded().then(() => {
              if (synth.loaded) {
                synth.triggerAttack(key.dataset.note);
              } else {
                console.error('Piano samples not loaded yet');
              }
            });
          } else {
            synth.triggerAttackRelease(key.dataset.note, '8n');
          }
          if (currentGuide.length > 0 && key.dataset.note === currentGuide[currentStep]) {
            key.classList.remove('guide');
            currentStep++;
            highlightNextKey();
          }
        });
        key.addEventListener('touchend', () => {
          key.classList.remove('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            synth.triggerRelease();
          } else {
            synth.triggerRelease();
          }
        });
      });
    });
