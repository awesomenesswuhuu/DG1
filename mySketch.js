let currentScene = 0;
let spriteOptions = [
  "d9gef2g-569d7f19-e8a5-4a69-a0e6-1b26bf561e3e.png",
  "d9gef55-58a42c2d-55c8-422c-b484-0e7dbb6e8f33.png",
  "dfrvcwa-427075fa-2d31-4d69-8634-46d931829862.gif",
];
let backgroundOptions = [
  "image707595372l.png",
  "red sky wallpaper.jpeg",
  "serene.jpeg",
  "coffee-shop-v0-cdejiydqbd791.png",
];

let spriteImages = [];
let backgroundImages = [];
let selectedSprites = [];
let selectedBackground = null;
let selectedBackgroundImage = null;
let selectedDialogues = [];
let dialogueInputs = [];
let inputsCreated = false;
let characters = [];
let buttonClicked = false; // To prevent rapid transitions

function preload() {
  for (let i = 0; i < spriteOptions.length; i++) {
    spriteImages.push(loadImage(spriteOptions[i]));
  }
  for (let i = 0; i < backgroundOptions.length; i++) {
    backgroundImages.push(loadImage(backgroundOptions[i]));
  }
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);
  switch (currentScene) {
    case 0:
      showIntroScene();
      break;
    case 1:
      showSpriteSelectionScene();
      break;
    case 2:
      showBackgroundSelectionScene();
      break;
    case 3:
      showDialogueEntryScene();
      break;
    case 4:
      showFinalGameScene();
      break;
  }
}

function showIntroScene() {
  background(200);
  textSize(48);
  text("DejaGames", width / 2, height / 3);
  textSize(24);
  text("Games for you like Déjà vu", width / 2, height / 2);
  drawButton(width / 2, height / 1.5, "Create", () => {
    changeScene(1);
  });
}

function showSpriteSelectionScene() {
  background(220);
  textSize(24);
  text("Choose Your Characters", width / 2, 40);
  for (let i = 0; i < spriteImages.length; i++) {
    let x = 100 + i * 150;
    let y = 100;
    image(spriteImages[i], x, y, 194, 194);
  }
  text(`Selected Characters: ${selectedSprites.length}`, width / 2, 350);
  drawButton(width / 2, height - 60, "Continue", () => {
    if (selectedSprites.length > 0) {
      changeScene(2);
    } else {
      alert("Please select at least one character.");
    }
  });
}

function mouseReleased() {
  if (currentScene === 1) {
    for (let i = 0; i < spriteImages.length; i++) {
      let x = 100 + i * 150;
      let y = 100;
      if (
        mouseX > x &&
        mouseX < x + 192 &&
        mouseY > y &&
        mouseY < y + 192 &&
        !selectedSprites.includes(spriteImages[i])
      ) {
        selectedSprites.push(spriteImages[i]);
      }
    }
  } else if (currentScene === 2) {
    for (let i = 0; i < backgroundImages.length; i++) {
      let x = 100 + i * 200;
      let y = 100;
      if (mouseX > x && mouseX < x + 192 && mouseY > y && mouseY < y + 192) {
        selectedBackground = backgroundOptions[i];
        selectedBackgroundImage = backgroundImages[i];
      }
    }
  }
}

function showBackgroundSelectionScene() {
  background(230);
  textSize(24);
  text("Choose a Background", width / 2, 40);
  for (let i = 0; i < backgroundImages.length; i++) {
    let x = 100 + i * 200;
    let y = 100;
    image(backgroundImages[i], x, y, 192, 192);
  }
  text(`Selected Background: ${selectedBackground || "None"}`, width / 2, 500);
  drawButton(width / 2, height - 60, "Continue", () => {
    if (selectedBackground) {
      changeScene(3);
    } else {
      alert("Please select a background.");
    }
  });
}

function showDialogueEntryScene() {
  background(240);
  textSize(24);
  text("Enter Dialogues for Each Character", width / 2, 40);
  if (selectedSprites.length > 0 && !inputsCreated) {
    dialogueInputs = [];
    for (let i = 0; i < selectedSprites.length; i++) {
      let y = 100 + i * 80;
      textSize(18);
      text(`Character ${i + 1}`, width / 3, y);
      let input = createInput(selectedDialogues[i] || "");
      input.position(width / 2 - 100, y - 10);
      input.size(200);
      dialogueInputs.push(input);
    }
    inputsCreated = true;
  }
  drawButton(width / 2, height - 60, "Done", () => {
    selectedDialogues = dialogueInputs.map((input) => input.value());
    inputsCreated = false;
    dialogueInputs.forEach((input) => input.remove());
    setupCharacters();
    changeScene(4);
  });
}

function showFinalGameScene() {
  image(selectedBackgroundImage, 0, 0, width, height);
  if (selectedSprites.length === 0) {
    textSize(18);
    text("No characters selected!", width / 2, height / 2);
    return;
  }
  for (let character of characters) {
    image(character.sprite, character.x - 96, character.y - 96, 192, 192);
    fill(0);
    textSize(18);
    text(character.dialogue, character.x, character.y - 110);
    if (keyIsDown(LEFT_ARROW)) character.x -= 2;
    if (keyIsDown(RIGHT_ARROW)) character.x += 2;
    if (keyIsDown(UP_ARROW)) character.y -= 2;
    if (keyIsDown(DOWN_ARROW)) character.y += 2;
  }
}

function drawButton(x, y, label, onClick) {
  fill(100, 200, 100);
  rect(x - 60, y - 20, 120, 40, 10);
  fill(0);
  textSize(18);
  text(label, x, y);
  if (
    mouseX > x - 60 &&
    mouseX < x + 60 &&
    mouseY > y - 20 &&
    mouseY < y + 20 &&
    mouseIsPressed &&
    !buttonClicked
  ) {
    buttonClicked = true;
    onClick();
  }
}

function changeScene(scene) {
  setTimeout(() => (buttonClicked = false), 300); // Prevent double-click
  currentScene = scene;
}

function setupCharacters() {
  characters = selectedSprites.map((sprite, index) => ({
    sprite: sprite,
    x: width / 4 + index * 150,
    y: height / 2,
    dialogue: selectedDialogues[index] || "",
  }));
}
