// Game Variables
let score = parseInt(localStorage.getItem('score')) || 0; // Load score from localStorage or initialize to 0
let tappingPower = 1000; // Starting power
let level = 1;
let tapPowerIncrease = 5; // Default tapping power decrease
let currentFrogSkinIndex = 0; // Track which frog skin is currently active

const frogSkins = [
    'images/frog.png',
    'images/frog2.png',
    'images/frog3.png',
    'images/frog4.png',
    'images/frog5.png',
    'images/frog6.png',
    'images/frog7.png',
    'images/frog8.png',
    'images/frog9.png',
    'images/frog10.png'
];

// User Variables
let users = {}; // To store users by ID
let currentUser = {
    id: Math.random().toString(36).substr(2, 9), // Generating a unique ID
    referralCode: '', // This will store the user's unique referral code
    referCount: 0 // Count of how many users they have referred
};

// Generate a unique referral code based on the user ID
currentUser.referralCode = currentUser.id; // Using user ID as referral code
users[currentUser.id] = currentUser; // Store current user

// DOM Elements
const frog = document.getElementById('frog');
const scoreboard = document.getElementById('score');
const powerDisplay = document.getElementById('power');
const levelDisplay = document.getElementById('level');
const powerBarFill = document.getElementById('power-bar-fill');
const referralLinkField = document.getElementById('referral-link');
const copyLinkButton = document.getElementById('copy-link');

const invitePage = document.getElementById('invite-page');
const taskPage = document.getElementById('task-page');
const storePage = document.getElementById('store-page');
const leaderboardPage = document.getElementById('leaderboard-page');

// Prevent zooming when tapping on the frog
frog.addEventListener('touchstart', function (event) {
    event.preventDefault(); // Prevent default behavior (zooming)
});

// Prevent zooming on all buttons and input fields
document.querySelectorAll('button, input, textarea').forEach(element => {
    element.addEventListener('touchstart', function (event) {
        event.preventDefault(); // Prevent default behavior (zooming)
    });
});

// Update Score Function
function updateScore() {
    scoreboard.innerText = `SCORE: ${score}`; // Corrected template literal
    localStorage.setItem('score', score); // Save score to localStorage
}

// Spawn Coin Animation Function
function spawnCoin(x, y) {
    const coin = document.createElement('img');
    coin.src = 'images/coin.png'; // Ensure you have coin.png in your images folder
    coin.classList.add('coin');
    document.getElementById('coin-container').appendChild(coin);

    const targetX = scoreboard.getBoundingClientRect().left + scoreboard.clientWidth / 2 - 25; // Center of scoreboard
    const targetY = scoreboard.getBoundingClientRect().top + scoreboard.clientHeight / 2 - 25;  // Center of scoreboard

    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;

    // Coin animation: Move upward and to the center of the scoreboard
    coin.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${(targetX - x)}px, ${targetY - y - 50}px)`, opacity: 0 } // Move upwards and horizontally
    ], {
        duration: 1000,
        easing: 'ease-out',
        fill: 'forwards'
    });

    // Remove the coin after the animation
    coin.addEventListener('animationend', () => {
        coin.remove();
    });
}

// Handle Frog Click Function
function handleFrogClick(event) {
    event.preventDefault();

    if (tappingPower > 0) {
        tappingPower -= tapPowerIncrease; // Decrease tapping power
        powerDisplay.innerText = `Power: ${tappingPower}`; // Corrected template literal
        powerBarFill.style.width = `${(tappingPower / 1000) * 100}%`;

        const rect = frog.getBoundingClientRect();

        // Determine coordinates based on whether it's a touch event or a mouse click
        const isTouchEvent = event.type === 'touchstart';
        const x = isTouchEvent ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
        const y = isTouchEvent ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

        spawnCoin(rect.left + x, rect.top + y);
        score += 5; // Increase score
        updateScore(); // Update score display
        checkLevelUp(); // Check for level up
    }
}

// Check Level Up Function
function checkLevelUp() {
    if (score >= level * 5000) {
        level++;
        tappingPower += 50; // Increase tapping power on level up
        levelDisplay.innerText = `Level: ${level}`; // Corrected template literal
        powerDisplay.innerText = `Power: ${tappingPower}`; // Corrected template literal
        powerBarFill.style.width = `${(tappingPower / 1000) * 100}%`;

        // Change frog skin based on the level
        if (level <= frogSkins.length) {
            currentFrogSkinIndex = level - 1;
            frog.src = frogSkins[currentFrogSkinIndex]; // Change the frog image based on level
        }
    }
}

// Gradually Refill Tapping Power
setInterval(() => {
    if (tappingPower < 1000) {
        tappingPower += 2;
        powerDisplay.innerText = `Power: ${tappingPower}`; // Corrected template literal
        powerBarFill.style.width = `${(tappingPower / 1000) * 100}%`;
    }
}, 1000);

// Referral Link Generation
function generateReferralLink() {
    const baseURL = window.location.href.split('?')[0];
    return `${baseURL}?ref=${currentUser.referralCode}`;
}

function updateReferralLink() {
    referralLinkField.value = generateReferralLink();
}

// Handle Referral Tracking
function handleReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerCode = urlParams.get('ref');

    if (referrerCode && users[referrerCode]) {
        let referrer = users[referrerCode];
        referrer.referCount += 1; 
        alert(`You were referred by ${referrerCode}!`); // Corrected template literal
    }
}

// Copy Referral Link to Clipboard
copyLinkButton.onclick = function () {
    referralLinkField.select();
    document.execCommand('copy');
    alert('Referral link copied to clipboard!');
};

// Task Functionality
document.addEventListener('DOMContentLoaded', () => {
    handleReferral();
    updateReferralLink();

    // Navigation Button Functionality
    document.getElementById('task-button').onclick = () => {
        taskPage.style.display = 'block';
    };

    document.getElementById('close-task-button').onclick = () => {
        taskPage.style.display = 'none';
    };

    document.getElementById('invite-button').onclick = () => {
        invitePage.style.display = 'block';
        updateReferralLink();
    };

    document.getElementById('close-invite-button').onclick = () => {
        invitePage.style.display = 'none';
    };

    document.getElementById('close-store-button').onclick = () => {
        storePage.style.display = 'none'; 
    };

    document.getElementById('store-button').onclick = () => {
        storePage.style.display = 'block'; 
    };

    document.getElementById('leaderboard-button').onclick = () => {
        leaderboardPage.style.display = 'block'; 
    }
    
    document.getElementById('close-leaderboard-button').onclick = () => {
        leaderboardPage.style.display = 'none'; 
    };

    document.getElementById('close-leaderboard-btn').onclick = () => {
        leaderboardPage.style.display = 'none'; 
    };

    // Frog Skin Purchase Functionality
    document.querySelectorAll('.buy-skin').forEach(button => {
        button.onclick = () => {
            const skinCost = button.parentElement.getAttribute('data-cost');
            const skinID = button.getAttribute('data-skin-id');

            if (score >= skinCost) {
                score -= skinCost; 
                currentFrogSkinIndex = skinID - 1; 
                frog.src = frogSkins[currentFrogSkinIndex]; 
                updateScore();
                button.disabled = true; 
                button.innerText = 'Purchased'; 
            } else {
                alert('Not enough coins!'); 
            }
        };
    });

    // Add event listeners for frog clicks
    frog.addEventListener('click', handleFrogClick);
    frog.addEventListener('touchstart', handleFrogClick); 

    // Add event listeners for task completion buttons
    document.querySelectorAll('.complete-task').forEach(button => {
        button.onclick = () => {
            const task = button.getAttribute('data-task');

            switch (task) {
                case 'twitter-follow':
                    alert('Thank you for following us on Twitter! You earned 100 coins!');
                    score += 100; 
                    updateScore();
                    break;
                case 'twitter-like-retweet':
                    alert('Thank you for liking and retweeting! You earned 150 coins!');
                    score += 150; 
                    updateScore();
                    break;
                case 'youtube-subscribe':
                    alert('Thank you for subscribing to our YouTube channel! You earned 200 coins!');
                    score += 200; 
                    updateScore();
                    break;
                case 'facebook-follow':
                    alert('Thank you for following us on Facebook! You earned 100 coins!');
                    score += 100; 
                    updateScore();
                    break;
                default:
                    console.log('Unknown task!');
            }

            button.disabled = true; 
            button.innerText = 'Completed'; 
        };
    });

    // Update score on page load
    updateScore();
});
