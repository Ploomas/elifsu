const canvas = document.querySelector("#confettiCanvas");
const partyButton = document.querySelector("#partyButton");
const soundPlayer = document.querySelector("#soundPlayer");
const context = canvas.getContext("2d");
const colors = ["#ff4f9a", "#ffd96f", "#34b3ff", "#9bffb0", "#ffffff"];

let confetti = [];

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

function playPartySound() {
  soundPlayer.currentTime = 0;
  soundPlayer.play();
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
