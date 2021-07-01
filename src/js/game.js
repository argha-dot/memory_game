import * as PIXI from "pixi.js";
import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { Howl, Howler } from "howler";

import * as lib from "../lib/lib";

import noiseSound from "../assets/noise.mp3";
import oneSound from "../assets/notes/one.mp3";
import twoSound from "../assets/notes/two.mp3";
import threeSound from "../assets/notes/three.mp3";

// let loader = PIXI.Loader.shared;

let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

PIXI.utils.sayHello(type);

let DIMENSIONS = {
  height: 600,
  mainWidth: 800,
  gameWidth: 600,
  antialias: false,
};

let app = new Application({
  width: DIMENSIONS.mainWidth,
  height: DIMENSIONS.height,
  resolution: 1,
});
app.ticker.maxFPS = 60;
// document.querySelector("#main").appendChild(app.view);

app.loader.add("../assets/dirt.png");
app.loader.load(setup);

let noise = new Howl({
  src: [noiseSound],
  loop: true,
  volume: 0.1,
  onloaderror: (s, e) => {
    console.log(`sound: ${s}, ${e}`);
  },
  onplayerror: () => {
    console.log("object1");
  },
});

let fretSounds = {
  one: new Howl({
    src: [oneSound],
    volume: 0.4,
  }),
  two: new Howl({
    src: [twoSound],
    volume: 0.4,
  }),
  three: new Howl({
    src: [threeSound],
    volume: 0.4,
  }),
};

let state, gameScene, gameBg, isPaused;
let gameOverBg, gameOverText, gameOverScene, restartButton, restart;
let scoreScene, scoreText, missText, hitText, streakText, scoreBg;
let numberOfNotes, noteSpeed, noteGenerateLag, timer;
let frets, keyInputs, notes;

let hits = 0;
let streak = 0;
let misses = 0;
let hitRate = 0;
let prevHitRate = 0;
let noteCounter = 0;
let prevNoteCounter = 0;
let isGameOver;
let reactionTimes = [];
let avgReactionTime = 0;
let numberOfLevels = 5;
let totalGameNumber = 1;
let gameNumber;

let indexForNotes = 0;
let obj = { S: 0, D: 1, F: 2, J: 4, K: 5, L: 6 }; // Note to integer conversion
let passSequence = []; // Password sequence for the current user.
let sequence;
let authGen;
let passIndexes;
let onPassSeq;
let passFirstNote;
let passHits = 0;
let passMisses = 0;
let passHitRate = 0;

const setPassSequence = (seq) => {
  passSequence = seq;
  
  // for (let i = 0; i < numberOfLevels - 1; i++) {
    //   sequence = [...sequence, ...lib.subBlockGen(passSequence)];
    // }
  
    authGen = lib.authSeqGen(passSequence);
  sequence = authGen.sequence;
  passIndexes = authGen.indexesOfPass;

  
  console.log(sequence);
  console.log(passIndexes);
  // sequence = passSequence
};

function setup() {
  isPaused = true;
  restart = false;
  isGameOver = false;
  gameNumber = 1;

  gameScene = new Container();
  scoreScene = new Container();
  gameOverScene = new Container();

  app.stage.addChild(scoreScene);
  app.stage.addChild(gameScene);
  app.stage.addChild(gameOverScene);

  // Score Background
  hits = 0;
  misses = 0;
  hitRate = 0;

  scoreBg = new Sprite(Texture.WHITE);
  scoreBg.width = DIMENSIONS.mainWidth - DIMENSIONS.gameWidth - 10;
  scoreBg.height = DIMENSIONS.height - 10;
  scoreBg.position.set(5, 5);
  scoreBg.tint = 0x777777;

  scoreScene.addChild(scoreBg);
  scoreScene.position.set(DIMENSIONS.gameWidth, 0);

  // Score Text
  scoreText = lib.createText(`Score: 0`, { fill: "black" }, scoreScene);
  scoreText.position.set(scoreBg.width / 2 - scoreText.width / 2, 50);

  // missText = lib.createText(`Misses: ${misses}`, { fill: "black" }, scoreScene);
  // missText.position.set(scoreBg.width / 2 - missText.width / 2, 100);

  streakText = lib.createText(`Streak: 0`, { fill: "black" }, scoreScene);
  streakText.position.set(scoreBg.width / 2 - streakText.width / 2, 100);
  // hitText = lib.createText(
  //   `${hitRate.toPrecision(3)}`,
  //   { fill: "black" },
  //   scoreScene
  // );
  // hitText.position.set(scoreBg.width / 2 - hitText.width / 2, 150);

  // Game Over
  gameOverBg = new Sprite(Texture.WHITE);
  gameOverBg.width = DIMENSIONS.gameWidth;
  gameOverBg.height = DIMENSIONS.height;
  gameOverBg.position.set(0, 0);
  gameOverBg.tint = 0xffffff;

  restartButton = new Sprite(Texture.WHITE);
  const restartText = new PIXI.Text("Continue", { fill: "#000000" });
  restartButton.on("mouseup", () => {
    restart = true;
  });
  restartButton.width = 150;
  restartButton.height = restartText.height;
  let restartX = DIMENSIONS.gameWidth / 2 - 0.5 * restartButton.width;
  let restartY = DIMENSIONS.height / 2 + 50;
  let restartTextX = DIMENSIONS.gameWidth / 2 - 0.5 * restartText.width;
  restartButton.position.set(restartX, restartY);
  restartText.position.set(restartTextX, restartY);
  restartButton.tint = 0x666666;
  restartButton.interactive = true;

  gameOverScene.addChild(gameOverBg);
  gameOverScene.addChild(restartButton, restartText);

  gameOverScene.visible = false;

  // Game Over Text
  gameOverText = lib.createText(
    `Level ${gameNumber}/7 Complete, Take a short break.`,
    {
      fill: "black",
      // fontFamily: "pixel, sans-serif",
    },
    gameOverScene
  );
  gameOverText.position.set(
    gameOverBg.width / 2 - gameOverText.width / 2,
    gameOverBg.height / 2 - gameOverText.height / 2
  );

  // Game Background
  gameBg = new Sprite(Texture.WHITE);
  gameBg.width = DIMENSIONS.gameWidth;
  gameBg.height = DIMENSIONS.height;
  gameBg.position.set(0, 0);
  gameBg.tint = 0xffffff;
  gameScene.addChild(gameBg);
  // The distance between each pole is 70, there are 8 such poles, hence 7 spaces,
  // therefore total width between the first and last pole will be 7 * 70 = 490.
  // Total width of the gameScene is 600, hence there is a whitespace of 110 on both sides.

  // Lines
  for (let i = 0; i < 8; i++) {
    let offsetX = 20;
    let gap = 80;

    let line = new Graphics();

    line.lineStyle(10, 0x909090, 1);

    line.moveTo(offsetX + i * gap, 100);
    line.lineTo(offsetX + i * gap, DIMENSIONS.height - 20);

    if (i == 0 || i == 7) {
      // For the last two lines
      line.lineStyle(2, 0x2c2c2c, 1);
      line.moveTo(offsetX + i * gap, 20);
      line.lineTo(offsetX + i * gap, DIMENSIONS.height - 20);
    }

    gameScene.addChild(line);
  }

  // Frets
  frets = [];
  for (let i = 0; i < 7; i++) {
    let offsetX = 30;
    let gap = 80;

    if (i == 3) {
      continue;
    }

    let fret = new Sprite(Texture.WHITE);
    fret.width = 60;
    fret.height = 20;
    fret.tint = 0x000000;

    fret.position.set(offsetX + i * gap, DIMENSIONS.height - 80);
    frets.push({ fret: fret, isPressed: false });
    gameScene.addChild(fret);
  }

  let letters = "SDFJKL";
  for (let i = 0; i < 6; i++) {
    let letter = lib.createText(
      `${letters[i]}`,
      { fill: "black", fontFamily: "pixel, sans-serif" },
      gameScene
    );
    let j = i > 2 ? i + 1 : i;
    let offsetX = 30 + 30;
    let gap = 80;
    letter.position.set(
      offsetX - letter.width / 2 + j * gap,
      DIMENSIONS.height - 60
    );
  }

  // Keyboard Input
  keyInputs = [];

  keyInputs.push(
    lib.keyboard(83),
    lib.keyboard(68),
    lib.keyboard(70),
    lib.keyboard(74),
    lib.keyboard(75),
    lib.keyboard(76)
  );

  let space = lib.keyboard(32);
  // let esc = lib.keyboard(27);

  space.press = () => {
    isPaused = !isPaused;

    if (!isPaused) {
      noise.play();
    } else {
      noise.pause();
    }
  };

  // esc.press = () => {
  //   isGameOver = true;
  // };

  keyInputs.forEach((key, i, arr) => {
    key.press = () => {
      let isOtherDown = false;

      arr
        .filter((oKey) => oKey !== key)
        .forEach((otherKey) => {
          if (otherKey.isDown) {
            isOtherDown = true;
          }
        });

      if (!isOtherDown) {
        frets[i].isPressed = true;
        switch (i) {
          case 0:
            fretSounds.one.play();
            break;
          case 1:
            fretSounds.two.play();
            break;
          case 2:
            fretSounds.three.play();
            break;
          case 3:
            fretSounds.two.play();
            break;
          case 4:
            fretSounds.three.play();
            break;
          case 5:
            fretSounds.one.play();
            break;
          
            default:
            fretSounds.one.play();
            break;
        }
      }
    };
    key.release = () => {
      frets[i].isPressed = false;
    };
  });

  // window.addEventListener('keydown', onKeyDown)
  // window.addEventListener('keyup', onKeyUp)

  // let pressKeys = [83, 68, 70, 74, 75, 76]

  // function onKeyDown(key) {
  //   let index = pressKeys.indexOf(key.keyCode)
  //   let othersPressed = false;
  //   for (let j = 1; j < pressKeys.length; j++) {
  //     if (frets[(index + j) % pressKeys.length].isPressed) {
  //       othersPressed = true;
  //     }
  //   }
  //   if (!othersPressed) {
  //     frets[index].isPressed = true;
  //   }
  // }
  // function onKeyUp(key) {
  //   let index = pressKeys.indexOf(key.keyCode)
  //   frets[index].isPressed = false;
  // }

  // Notes
  numberOfNotes = 0;
  noteSpeed = 5;
  notes = [];
  noteGenerateLag = 50;
  timer = 1;

  state = play;
  app.ticker.add((delta) => gameLoop(delta));
}

function noteSequence() {
  if (indexForNotes > sequence.length - 1) {
    // sequence = lib.subBlockGen(passSequence);
  } else {
    if (sequence) generateNote(obj[sequence[indexForNotes]]);
    indexForNotes++;
  }
}

// If n === -1 or 3: random note; 1-2 and 4-6: appropriate column
function generateNote(n) {
  let noteOffsetX = 60,
    noteGapX = 80;

  let x;

  while (true) {
    x = n === -1 || n === 3 ? lib.randomInt(0, 6) : n;

    if (x !== 3) {
      break;
    }
  }

  let circle = lib.createCircle(
    noteOffsetX + noteGapX * x,
    lib.randomInt(-100, -100),
    20,
    0xffffff
  );

  circle["vx"] = 0;
  circle["vy"] = noteSpeed;

  circle.tint = 0x000000;
  circle["isInsideFretTime"] = 0;
  circle["colorChange"] = false;

  circle["colorChangeTime"] = 5;
  circle["colorTimer"] = 1;

  notes.push(circle);
  // console.log(circle);

  gameScene.addChild(circle);
}

function gameLoop(delta) {
  state(delta);
}

function hitRateMonitor(curHR) {
  // console.log("hitRate:", curHR.toPrecision(3), prevHR.toPrecision(3), "speed:", noteSpeed.toPrecision(3));
  let alpha = 10;
  let beta = 25;

  noteSpeed = Math.floor(noteSpeed - (0.7 - curHR) * alpha);
  noteGenerateLag = Math.floor(noteGenerateLag + (0.7 - curHR) * beta);

  if (noteSpeed < 3) {
    noteSpeed = 3;
  } else if (noteSpeed > 12) {
    noteSpeed = 12;
  }
  //changing noteGenerateLag
  if (noteGenerateLag > 55) {
    noteGenerateLag = 55;
  } else if (noteGenerateLag < 20) {
    noteGenerateLag = 20;
  }
  // console.log(noteSpeed);
  // console.log(noteGenerateLag);
}

function collisionCheck(fret, note) {
  return (
    lib.getDistance(
      fret.fret.x + fret.fret.width / 2,
      fret.fret.y + fret.fret.height / 2,
      note.x,
      note.y
    ) <
    fret.fret.height / 2 + note.width / 2
  );
}

function onPassOn() {
  onPassSeq = true;
  if (passIndexes.length > 0) {
    passIndexes.shift();
  }
  passFirstNote = noteCounter;
}

function onPassOff() {
  if (noteCounter >= passFirstNote + 30) {
    onPassSeq = false;
  }
}

function play(delta) {
  gameScene.visible = true;
  gameOverScene.visible = false;

  if (!isPaused) {

    if (noteCounter === passIndexes[0] && noteCounter !== prevNoteCounter) {
      onPassOn();
    }

    if (onPassSeq && noteCounter !== prevNoteCounter) {
      onPassOff();
    }

    if (indexForNotes > sequence.length - 1 && notes.length === 0) {
      if (timer === 0) {
        isGameOver = true;
      }
    }

    if (
      noteCounter !== prevNoteCounter &&
      noteCounter % 20 === 0 &&
      noteCounter !== 0
    ) {
      hitRateMonitor(hitRate);
      notes.forEach((note) => {
        note.vy = noteSpeed;
      });
    }

    gameBg.tint = 0xffffff;

    // Timer loop, timer is a decerement counter which ranges between noteGenerateLag and 0,
    // and when it hits 0, it generates a new note and goes back to noteGenerateLag to start decerementing again
    timer = timer > 0 ? --timer : noteGenerateLag;

    if (timer === 0) {
      // generateNote(-1);
      noteSequence();
    }

    // Fret press.
    frets.forEach((fret) => {
      if (fret.isPressed) {
        fret.fret.tint = 0x222222;
      } else {
        fret.fret.tint = 0x000000;
      }
    });

    prevNoteCounter = noteCounter;

    // For each note check if it is colliding with any fret.
    notes.forEach((note, index, object) => {
      note.y += note.vy * delta;

      note.colorTimer =
        note.colorTimer > 0 ? --note.colorTimer : note.colorChangeTime;

      if (note.colorTimer === 0 && note.y < DIMENSIONS.height - 120) {
        note.colorChange = !note.colorChange;
      } else {
        note.colorChange = false;
      }

      if (note.colorChange) {
        note.tint = 0xffffff;
      } else {
        note.tint = 0x000000;
      }

      frets.forEach((fret) => {
        if (collisionCheck(fret, note)) {
          // The reaction time, this is the epoch time when note enters the fret
          if (!note.isInsideFretTime) {
            note.isInsideFretTime = new Date().valueOf();
          }

          if (fret.isPressed) {
            note.clear();
            object.splice(index, 1);
            hits += 1;
            streak += 1;
            hitRate = hits / (hits + misses);
            scoreText.text = `Score: ${hits}`;
            streakText.text = `Streak: ${streak}`;
            // hitText.text = `${hitRate.toPrecision(3)}`;
            noteCounter++;
            if (onPassSeq) {
              passHits += 1;
              passHitRate = passHits / (passHits + passMisses);
              // console.log(passHits, passMisses, passHitRate.toPrecision(3));
            }
            // This subtracts the time when the user presses the corresponding fret to
            // with the previously taken time
            reactionTimes.push(new Date().valueOf() - note.isInsideFretTime);
          }
        }
      });

      // Checks if ball is outside the boundry.
      if (note.y + note.height / 2 > DIMENSIONS.height) {
        note.clear();
        object.splice(index, 1);
        misses += 1;
        streak = 0;
        hitRate = hits / (hits + misses);
        streakText.text = `Streak: ${streak}`;
        // hitText.text = `${hitRate.toPrecision(3)}`;
        noteCounter++;
        if (onPassSeq) {
          passMisses += 1;
          passHitRate = passHits / (passHits + passMisses);
          // console.log(passHits, passMisses, passHitRate.toPrecision(3));
        }
      }
    });
  } else {
    gameBg.tint = 0x111111;
  }
  if (isGameOver) {
    gameNumber += 1;
    state = end;
    noise.pause();
  }
}

function end(delta) {
  gameScene.visible = false;
  gameOverScene.visible = true;
  gameOverText.text =
    gameNumber <= totalGameNumber
      ? `GAME ${gameNumber - 1}/7 Finished. Take a short break!`
      : `All Games Finished! Press "Finish Session". `;

  notes.forEach((note) => {
    note.clear();
  });

  notes = [];

  if (restart) {
    if (gameNumber > totalGameNumber) {
      gameOverText.text = `You are all done, come back next week!`;
    } else {
      prevHitRate = 0;
      prevNoteCounter = 0;
      noteCounter = 0;
      indexForNotes = 0;
      noteGenerateLag = 50;
      noteSpeed = 5;
      sequence = [];
      setPassSequence(passSequence);
      isGameOver = false;
      restart = false;
      isPaused = true;
      state = play;
    }
  }
}

export {
  hits,
  misses,
  hitRate,
  isGameOver,
  reactionTimes,
  setPassSequence,
  gameNumber,
  totalGameNumber,
  passHits,
  passMisses,
  passHitRate,
};
export default app;
