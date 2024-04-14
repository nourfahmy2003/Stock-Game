function updatePlayerInfo(playerName, cur_Game) {
    const playerInfoContainer = document.getElementById('player-info');
    playerInfoContainer.innerHTML = `
        <p>Greeting, ${playerName}!</p>
        <p>Current Game: ${cur_Game}</p>
    `;
}

// Fetch player info from the server
function fetchPlayerInfo() {
    fetch('/info')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const playerName = data.name;
            const cur_Game = data.cur_game;
            updatePlayerInfo(playerName, cur_Game);
        })
        .catch(error => console.error('Error fetching player info:', error));
}
// Call the function to fetch and update player info when the page loads
$(document).ready(function () {
    fetchPlayerInfo();
}); 