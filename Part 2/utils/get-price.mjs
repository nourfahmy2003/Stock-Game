import axios from 'axios';

const apiKey = 'QPFEUC0S6MCKWJKK';

export async function getStockPrice(symbol) {
  // API endpoint URL
  const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const stockData = response.data['Global Quote'];
    const price = stockData['05. price'];

    return price;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}


// const stockSymbol = 'AAPL';
// getStockPrice(stockSymbol)
//   .then(price => {
//     console.log(`Current Price for ${stockSymbol}:`, price);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
