// Function to update player info
function updatePlayerInfo(playerName, currentGame) {
    const playerInfo = $('#player-info');
    playerInfo.html(`<p>Greeting: Hey, ${playerName}</p><p>Current Game: ${currentGame ? currentGame : 'None'}</p>`);
}

// Fetch player info and update player info
fetch('/info')
    .then(response => response.json())
    .then(data => {
        const playerName = data.name;
        const currentGame = data.cur_game;
        console.log(data);
        updatePlayerInfo(playerName, currentGame);
    })
    .catch(error => console.error('Error fetching player info:', error));

// Function to hide the create game button if cur_game is not null
function hideCreateGameButton(currentGame) {
    const createGameButton = $('#create-game');
    console.log(currentGame)
    if (currentGame !== null) {
        createGameButton.hide(); // Hide the button if cur_game is not null
    } else {
        createGameButton.show(); // Show the button if cur_game is null
    }
}

// Display the create game popup when the switch button is clicked
$(document).ready(function() {
    $('#create-game').click(function() {
        $('#create-game-popup').css('display', 'block');
    });
});

// Hide the create game popup if the user clicks outside the popup or presses the escape key
$(document).mouseup(function(e) {
    var popup = $('#create-game-popup');
    if (!popup.is(e.target) && popup.has(e.target).length === 0) {
        popup.hide();
    }
});

// Submit the form when the user enters a game name
$(document).ready(function() {
    $('#create-game-form').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission
        var gameName = $('#game-name').val();
        if (gameName.trim() !== '') {
            // Close the popup and submit the form
            $('#create-game-popup').hide();
            createGame(gameName);
        }
    });
});

// Function to create a game
function createGame(gameName) {
    // Send a request to the server to create the game
    fetch(`/create_game/${gameName}`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                alert(`Game "${gameName}" created successfully.`);
                hideCreateGameButton(gameName); // Update the button visibility
            } else {
                alert(`Failed to create game "${gameName}".`);
            }
        })
        .catch(error => console.error('Error creating game:', error));
}
