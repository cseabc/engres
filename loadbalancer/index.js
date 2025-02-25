const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.LB_PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Get backend URLs from environment variable (comma-separated)
const backendURLs = process.env.BACKEND_URLS ? process.env.BACKEND_URLS.split(',') : [];
if (backendURLs.length === 0) {
    console.error('No backend URLs provided in BACKEND_URLS');
    process.exit(1);
}

// Round-robin load balancing
let currentIndex = 0;

app.all('*', async (req, res) => {
    const targetUrl = backendURLs[currentIndex].trim() + req.originalUrl;
    currentIndex = (currentIndex + 1) % backendURLs.length;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: req.headers,
            data: req.body,
            params: req.query,
            timeout: 10000
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error forwarding request:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Error forwarding request' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Load Balancer running on port ${PORT}`);
});
