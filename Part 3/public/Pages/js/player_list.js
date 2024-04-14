function showPortfolioModal() {
    $('#portfolio-modal').css('display', 'block'); // Show the modal
}

// Function to hide the portfolio modal
function hidePortfolioModal() {
    $('#portfolio-modal').css('display', 'none'); // Hide the modal
}

// Close the modal when the user clicks on the close button
$('.close').on('click', function() {
    hidePortfolioModal();
    
});

async function populatePlayerList() {
    const playerListContainer = document.getElementById('player-list');

    // Clear previous content
    playerListContainer.innerHTML = '';
    const title = document.createElement('h3');
    title.textContent = 'Player List';
    title.classList.add('player-list-title'); // Add a class if needed for styling
    playerListContainer.appendChild(title);

    try {
        // Fetch player list data from the server
        const response = await fetch('/game_players');
        const players = await response.json();
        
        // Create and append clickable links for each player
        players.forEach(player => {
            const playerLink = document.createElement('a');
            playerLink.href = '#';
            playerLink.textContent = player;
            playerLink.classList.add('player'); // Add class for event delegation
            playerListContainer.appendChild(playerLink);
            playerListContainer.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error fetching player list:', error);
        // Handle error appropriately
    }
}

function showPortfolio(playerName) {
    fetch(`/info/${playerName}`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response to see its structure and contents

        // Display the player's name
        $('#player-name').text(playerName);
        // Display the portfolio data in your UI
        $('#portfolio-info').empty(); // Clear any existing data
        data.portfolio.forEach(entry => {
            let portfolioInfo = `<p>Symbol: ${entry.symbol}, Quantity: ${entry.quantity}, Cost: ${entry.cost}</p>`;
            $('#portfolio-info').append(portfolioInfo);
        });
        clearCanvasAndDestroyChart();
        // Prepare data for the pie chart
        const ctx = document.getElementById('pie-chart').getContext('2d');
        const labels = ['Cash'];
        const dataValues = [data.balance];
        data.portfolio.forEach(stock => {
            labels.push(stock.symbol);
            dataValues.push(stock.cost);
        });
        // Create the pie chart
        window.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#32CD32', '#8A2BE2'] // Set custom colors for each segment
                }]
            }
        });

        // Show the modal
        showPortfolioModal();
    })
    .catch(error => {
        console.error('Error fetching player portfolio:', error);
        // Handle errors
    });
}

function clearCanvasAndDestroyChart() {
    const canvas = document.getElementById('pie-chart');
    const ctx = canvas.getContext('2d');

    // Destroy the existing chart instance
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Clear the canvas content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
