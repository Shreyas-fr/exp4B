const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// blockchain.com Ticker API
app.get('/crypto/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const response = await fetch(`https://api.blockchain.com/v3/exchange/tickers/${symbol}`);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Cryptocurrency trading pair not found (Ensure format like BTC-USD)' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to communicate with Blockchain API', details: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Crypto API (Postlab 2) running on http://localhost:${PORT}`);
  });
}

module.exports = app;
