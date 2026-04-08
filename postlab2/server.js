const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Home Route - Render the user-friendly search form
app.get('/', (req, res) => {
  res.render('index', { data: null, error: null });
});

// POST Route - Handle form submission and make API request with Axios
app.post('/check', async (req, res) => {
  const symbol = req.body.symbol.trim().toUpperCase();
  
  try {
    // Make the external API GET request using Axios
    const response = await axios.get(`https://api.blockchain.com/v3/exchange/tickers/${symbol}`);
    
    // Render the EJS template passing the retrieved data
    res.render('index', { data: response.data, error: null });
  } catch (error) {
    let errorMsg = 'Failed to fetch data. Please ensure the symbol is formatted correctly (e.g., BTC-USD).';
    
    // Axios wraps the response error gracefully in error.response
    if (error.response && error.response.status === 404) {
      errorMsg = `Cryptocurrency pair '${symbol}' not found. Try BTC-USD or ETH-USD.`;
    }
    
    res.render('index', { data: null, error: errorMsg });
  }
});

// Export the app (for Vercel or testing)
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Crypto Website (Postlab 2) running on http://localhost:${PORT}`);
  });
}
