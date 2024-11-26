const rows = 4;
const columns = 4;

let currTile = null; // Tile currently being dragged or touched
let otherTile = null; // Tile being dropped on
let xpPoints = localStorage.getItem("xpPoints") ? parseInt(localStorage.getItem("xpPoints")) : 0; // Persist XP points using localStorage
let countdownTime; // Countdown timer in seconds
let countdownTimer;
let currentLevel = 1; // Start at level 1

// Background music and clapping sound elements
const backgroundMusic = document.getElementById("background-music");
const clappingSound = document.getElementById("clapping-sound");

window.onload = function () {
    setupBoard();
    setupMusicControls();
    startLevel();
};

// Initialize the board
function setupBoard() {
    const board = document.getElementById("board");
    const piecesContainer = document.getElementById("pieces");

    board.innerHTML = "";
    piecesContainer.innerHTML = "";

    // Generate blank tiles for the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("img");
            tile.src = "./images/blank.jpg";
            tile.dataset.position = `${r}-${c}`; // Store original position

            // Add event listeners
            addInteractionListeners(tile);

            board.append(tile);
        }
    }

    // Generate shuffled pieces for the puzzle
    const pieces = Array.from({ length: rows * columns }, (_, i) => (i + 1).toString());
    shuffleArray(pieces);

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const tile = document.createElement("img");
        tile.src = `./images/${piece}.jpg`;
        tile.dataset.correct = piece; // Store correct position

        // Add event listeners
        addInteractionListeners(tile);

        piecesContainer.append(tile);
    }
}

// Add event listeners for drag-and-drop and touch interactions
function addInteractionListeners(tile) {
    // Mouse-based drag-and-drop
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("drop", dragDrop);

    // Touch-based interactions
    tile.addEventListener("touchstart", touchStart);
    tile.addEventListener("touchmove", touchMove);
    tile.addEventListener("touchend", touchEnd);
}

// Drag-and-drop event handlers (Mouse)
function dragStart(e) {
    currTile = this; // Save the tile being dragged
    e.dataTransfer.setData("text/plain", this.src); // Pass tile image
}

function dragOver(e) {
    e.preventDefault(); // Allow drop
}

function dragDrop() {
    otherTile = this; // Tile being dropped on
    swapTiles(currTile, otherTile); // Swap tiles
    checkPuzzleCompletion(); // Check if puzzle is completed
    currTile = null;
    otherTile = null;
}

// Touch event handlers (Mobile)
function touchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    currTile = document.elementFromPoint(touch.clientX, touch.clientY);
}

function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    otherTile = document.elementFromPoint(touch.clientX, touch.clientY);
}

function touchEnd(e) {
    e.preventDefault();
    if (currTile && otherTile) {
        swapTiles(currTile, otherTile); // Swap tiles
        checkPuzzleCompletion(); // Check if puzzle is completed
    }
    currTile = null;
    otherTile = null;
}

// Swap tiles
function swapTiles(tile1, tile2) {
    const tempSrc = tile1.src;
    tile1.src = tile2.src;
    tile2.src = tempSrc;
}

// Check if the puzzle is completed
function checkPuzzleCompletion() {
    const board = document.getElementById("board");
    const tiles = board.getElementsByTagName("img");

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const correctTileNumber = i + 1;

        // Extract the image file name and compare with the correct number
        const tileNumber = tile.src.split("/").pop().split(".")[0];
        if (tileNumber !== correctTileNumber.toString()) {
            return; // Puzzle is not completed
        }
    }

    // If all tiles are in the correct position
    clearInterval(countdownTimer); // Stop the timer
    backgroundMusic.pause(); // Pause background music

    // Play clapping sound on user interaction
    clappingSound.currentTime = 0; // Reset sound to the start
    clappingSound.play().catch(() => {
    });

    alert(`Congratulations! You completed the puzzle! Level ${currentLevel} complete!`);

    // Reward XP points after completing all levels
    if (currentLevel < 3) {
        currentLevel++;
        startLevel();
    } else {
        // Reward 100 XP points
        xpPoints += 100;
        localStorage.setItem("xpPoints", xpPoints); // Save XP to localStorage
        document.getElementById("xp").innerText = xpPoints; // Display the XP points

        alert("You've completed all levels! Great job!");
        resetGame();
    }
}

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start the game for the current level
function startLevel() {
    switch (currentLevel) {
        case 1:
            countdownTime = 120;
            break;
        case 2:
            countdownTime = 90;
            break;
        case 3:
            countdownTime = 70;
            break;
    }

    document.getElementById("xp").innerText = xpPoints; // Keep XP displayed
    document.getElementById("countdown").innerText = `Time Left: ${countdownTime} seconds`;
    setupBoard();
    startCountdown();
}

// Countdown timer
function startCountdown() {
    const countdownDisplay = document.getElementById("countdown");
    backgroundMusic.play();

    countdownTimer = setInterval(() => {
        countdownTime--;
        countdownDisplay.innerText = `Time Left: ${countdownTime} seconds`;

        if (countdownTime <= 0) {
            clearInterval(countdownTimer);
            backgroundMusic.pause();
            alert("Time's up! Restarting the game...");
            resetGame();
        }
    }, 1000);
}

// Reset the game
function resetGame() {
    currentLevel = 1; // Reset to level 1
    countdownTime = 120; // Reset countdown time
    document.getElementById("xp").innerText = xpPoints; // Keep XP points

    setupBoard();
    startCountdown();
}

// Music controls
function setupMusicControls() {
    const playButton = document.getElementById("play-music");
    const pauseButton = document.getElementById("pause-music");
    const resetGameButton = document.getElementById("reset-game");

    playButton.addEventListener("click", () => backgroundMusic.play());
    pauseButton.addEventListener("click", () => backgroundMusic.pause());
    resetGameButton.addEventListener("click", resetGame);
}
