const canvas = document.querySelector("#confettiCanvas");
const partyButton = document.querySelector("#partyButton");
const context = canvas.getContext("2d");
const colors = ["#ff4f9a", "#ffd96f", "#34b3ff", "#9bffb0", "#ffffff"];

let confetti = [];
let audioContext;

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function makeConfettiPiece() {
  return {
    x: Math.random() * window.innerWidth,
    y: -24 - Math.random() * window.innerHeight * 0.4,
    size: 7 + Math.random() * 10,
    speed: 2.3 + Math.random() * 4.2,
    drift: -1.7 + Math.random() * 3.4,
    rotation: Math.random() * Math.PI,
    spin: -0.12 + Math.random() * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function refillConfetti(count = 130) {
  confetti = Array.from({ length: count }, makeConfettiPiece);
}

function drawConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const piece of confetti) {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.spin;

    if (piece.y > window.innerHeight + 30) {
      Object.assign(piece, makeConfettiPiece(), { y: -20 });
    }

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size / 1.8);
    context.restore();
  }

  requestAnimationFrame(drawConfetti);
}

function playTone(frequency, start, duration, type = "sawtooth", volume = 0.12, endFrequency = frequency) {
  const oscillator = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, audioContext.currentTime + start + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(760, audioContext.currentTime + start);
  filter.frequency.linearRampToValueAtTime(420, audioContext.currentTime + start + duration);
  filter.Q.setValueAtTime(8, audioContext.currentTime + start);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + start + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + start);
  oscillator.stop(audioContext.currentTime + start + duration + 0.03);
}

function playPartySound() {
  audioContext = audioContext || new AudioContext();
  playTone(220, 0, 0.42, "sawtooth", 0.18, 146.83);
  playTone(185, 0.36, 0.5, "sawtooth", 0.16, 123.47);
  playTone(164.81, 0.78, 0.58, "square", 0.13, 98);
}

function startParty() {
  refillConfetti(190);
  playPartySound();
  partyButton.textContent = "Again!";
}

resizeCanvas();
refillConfetti();
drawConfetti();

partyButton.addEventListener("click", startParty);
window.addEventListener("resize", () => {
  resizeCanvas();
  refillConfetti();
});
