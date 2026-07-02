const noButton = document.querySelector("#noButton");
const yesButton = document.querySelector("#yesButton");
const yesSound = document.querySelector("#yesSound");
const question = document.querySelector("#question");
const note = document.querySelector("#note");

const noLabels = [
  "Are you sure?",
  "Really sure?",
  "Look at Yes",
  "Last chance",
  "No is tired"
];

const notes = [
  "Wrong button maybe?",
  "I think you meant the pink one.",
  "The Yes button is getting stronger.",
  "No is losing power.",
  "Only one good option left."
];

let noClicks = 0;
let isOpeningCelebration = false;

const openCelebration = () => {
  if (isOpeningCelebration) {
    return;
  }

  isOpeningCelebration = true;
  window.location.href = yesButton.href;
};

yesButton.addEventListener("click", (event) => {
  event.preventDefault();

  yesSound.currentTime = 0;
  const sound = yesSound.play();

  window.setTimeout(openCelebration, 950);

  if (sound) {
    sound.catch(openCelebration);
  }
});

noButton.addEventListener("click", () => {
  noClicks += 1;

  const noScale = Math.max(0.18, 1 - noClicks * 0.16);
  const yesScale = Math.min(1.9, 1 + noClicks * 0.16);
  const labelIndex = Math.min(noClicks - 1, noLabels.length - 1);

  noButton.textContent = noLabels[labelIndex];
  noButton.style.setProperty("--no-scale", noScale);
  yesButton.style.setProperty("--yes-scale", yesScale);
  note.textContent = notes[labelIndex];

  if (noClicks >= 5) {
    noButton.classList.add("is-gone");
    noButton.setAttribute("aria-hidden", "true");
    question.textContent = "Will you be my girlfriend, Elifsu?";
    note.textContent = "The website has made its final decision.";
  }
});
