document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-button');

    // Functionality to return to the game page
    backButton.onclick = () => {
        window.location.href = "index.html"; // Go back to the main game page
    };

    // Functionality for social media sharing
    document.getElementById('share-twitter').onclick = () => {
        const tweetText = `Check out my achievements and leaderboard score in Meme Frog Game!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
    };

    document.getElementById('share-facebook').onclick = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    // Load achievements and leaderboard (you may customize as per your logic)
    displayAchievements();
    displayLeaderboard();
});

// Placeholder Functions for Achievements and Leaderboard
function displayAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = "<li>First Click</li><li>100 Points</li><li>Level Up</li>"; // Examples
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = "<li>User ID: XYZ - Score: 1000</li><li>User ID: ABC - Score: 900</li>"; // Examples
}