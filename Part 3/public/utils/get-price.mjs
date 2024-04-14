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


export async function getStockList() {
  const apiUrl = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const stocksData = response.data;
    
    // Extract stock symbols
    const stockList = stocksData; 
    return stockList;
  } catch (error) {
    console.error('Error fetching stock list:', error);
    throw error;
  }
  
}
