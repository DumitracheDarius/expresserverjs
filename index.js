import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const allowedOrigin = "https://willowy-tapioca-e99011.netlify.app"; // <-- aici setezi domeniul tău Netlify

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

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
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Failed to forward request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
