var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var soundOn = true;
var acceptingInput = false;

// High score soti nan localStorage
var highScore = localStorage.getItem("simonHighScore") || 0;
$("#high-score").text(highScore);

// START GAME
$("#start-btn").on("click", function () {
  startGame();
});

// SOUND TOGGLE
$("#sound-btn").on("click", function () {
  soundOn = !soundOn;
  $(this).text(soundOn ? "Sound: On" : "Sound: Off");
});

// SI USER PEZE KLAVYE SOU PC
$(document).keydown(function () {
  if (!started) {
    startGame();
  }
});

// CLICK SOU BOUTON YO
$(".btn").on("click", function () {
  if (!started || !acceptingInput) {
    return;
  }

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

// FONKSYON KÒMANSE JWÈT LA
function startGame() {
  started = true;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  $("#instruction").text("Watch the pattern and repeat it");
  $("#start-btn").text("Restart Game");
  nextSequence();
}

// AJOUTE NOUVO KOULÈ
function nextSequence() {
  userClickedPattern = [];
  acceptingInput = false;

  level++;
  $("#level-title").text("Level " + level);
  $("#current-level").text(level);

  updateHighScore();

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  playSequence();
}

// JWE TOUT SEKANS LAN
function playSequence() {
  var i = 0;

  var interval = setInterval(function () {
    var colour = gamePattern[i];

    $("#" + colour).fadeOut(100).fadeIn(100);
    playSound(colour);

    i++;

    if (i >= gamePattern.length) {
      clearInterval(interval);

      setTimeout(function () {
        acceptingInput = true;
      }, 300);
    }
  }, 700);
}

// VERIFYE REPONS USER LA
function checkAnswer(currentIndex) {
  if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
    if (userClickedPattern.length === gamePattern.length) {
      acceptingInput = false;

      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over");
    $("#instruction").text("Tap Start Game to try again");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 300);

    startOver();
  }
}

// JWE SON
function playSound(name) {
  if (!soundOn) return;

  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// ANIMASYON BOUTON
function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");

  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 120);
}

// RESET
function startOver() {
  started = false;
  acceptingInput = false;
  gamePattern = [];
  userClickedPattern = [];
  level = 0;
  $("#current-level").text(level);
}

// UPDATE HIGH SCORE
function updateHighScore() {
  if (level > highScore) {
    highScore = level;
    localStorage.setItem("simonHighScore", highScore);
    $("#high-score").text(highScore);
  }
}
