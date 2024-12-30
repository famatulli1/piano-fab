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
            C4: "C4.mp3",
            D4: "D4.mp3",
            E4: "E4.mp3",
            F4: "F4.mp3",
            G4: "G4.mp3",
            A4: "A4.mp3",
            B4: "B4.mp3",
            C5: "C5.mp3"
          },
          baseUrl: "https://tonejs.github.io/audio/salamander/",
          onload: () => {
            console.log('Piano samples loaded');
          }
        }).toDestination()
      };

      // Ensure the piano samples are loaded before allowing playback
      Tone.loaded().then(() => {
        console.log('All audio files loaded');
      });

      if (instrumentSelector) {
        instrumentSelector.addEventListener('change', (e) => {
          synth = instruments[e.target.value];
        });
      }

      keys.forEach(key => {
        key.addEventListener('mousedown', () => {
          key.classList.add('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            // Ensure the piano is ready before triggering notes
            Tone.loaded().then(() => {
              synth.triggerAttack(key.dataset.note);
            });
          } else {
            synth.triggerAttackRelease(key.dataset.note, '8n');
          }
        });
        key.addEventListener('mouseup', () => {
          key.classList.remove('active');
          if (instrumentSelector && instrumentSelector.value !== 'piano') {
            synth.triggerRelease();
          }
        });
        key.addEventListener('mouseleave', () => {
          key.classList.remove('active');
          if (instrumentSelector && instrumentSelector.value !== 'piano') {
            synth.triggerRelease();
          }
        });

        // Add touch events for mobile devices
        key.addEventListener('touchstart', (e) => {
          e.preventDefault();
          key.classList.add('active');
          if (instrumentSelector && instrumentSelector.value === 'piano') {
            Tone.loaded().then(() => {
              synth.triggerAttack(key.dataset.note);
            });
          } else {
            synth.triggerAttackRelease(key.dataset.note, '8n');
          }
        });
        key.addEventListener('touchend', () => {
          key.classList.remove('active');
          if (instrumentSelector && instrumentSelector.value !== 'piano') {
            synth.triggerRelease();
          }
        });
      });
    });
