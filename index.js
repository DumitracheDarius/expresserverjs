// index.js complet modificat ca sa deserveasca si imaginile:

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const allowedOrigin = "https://willowy-tapioca-e99011.netlify.app"; // <-- aici setezi domeniul frontend

// CORS pentru frontend
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Route pentru scraping (forward POST request)
app.post('/scrape', async (req, res) => {
  try {
    const response = await fetch('http://139.59.140.159:8000/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error forwarding /scrape request:', error);
    res.status(500).json({ error: 'Failed to forward /scrape request' });
  }
});

// Route pentru IMAGINI (forward GET image request)
app.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const imageResponse = await fetch(`http://139.59.140.159:8000/images/${filename}`);

    if (!imageResponse.ok) {
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', imageResponse.headers.get('Content-Type') || 'image/png');
    const buffer = await imageResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error forwarding /images request:', error);
    res.status(500).send('Failed to fetch image');
  }
});

// Pornim serverul
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
