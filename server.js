const express = require('express');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();

// পোর্ট ডিক্লারেশন (শুধুমাত্র একবার)
const PORT = process.env.PORT || 10000;

// আপনার WebShare প্রক্সি লিস্ট
const proxies = [
    'http://usiarqrc:1h9wgccswilx@31.59.20.176:6754',
    'http://usiarqrc:1h9wgccswilx@23.95.150.145:6114',
    'http://usiarqrc:1h9wgccswilx@198.23.239.134:6540',
    'http://usiarqrc:1h9wgccswilx@45.38.107.97:6014',
    'http://usiarqrc:1h9wgccswilx@107.172.163.27:6543',
    'http://usiarqrc:1h9wgccswilx@198.105.121.200:6462',
    'http://usiarqrc:1h9wgccswilx@64.137.96.74:6641',
    'http://usiarqrc:1h9wgccswilx@216.10.27.159:6837',
    'http://usiarqrc:1h9wgccswilx@142.111.67.146:5611',
    'http://usiarqrc:1h9wgccswilx@23.26.53.37:6003'
];

app.get('/', (req, res) => {
    res.send('QuickSave API is running with Proxy Rotation!');
});

// সোশ্যাল মিডিয়া ডেটা সংগ্রহের রাউট
app.get('/fetch', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URL is required');

    // র‍্যান্ডম প্রক্সি সিলেক্ট করা
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    const agent = new HttpsProxyAgent(randomProxy);

    try {
        const response = await axios.get(targetUrl, {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message, 
            proxyUsed: randomProxy.split('@')[1] // পাসওয়ার্ড হাইড করে শুধু আইপি দেখানো
        });
    }
});

// সার্ভার স্টার্ট (শুধুমাত্র একবার)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
