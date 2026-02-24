const express = require('express');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { exec } = require('child_process');

const app = express();
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

// হোম পেজ
app.get('/', (req, res) => {
    res.send('QuickSave API is live! Use /fetch or /download endpoints.');
});

// সোশ্যাল মিডিয়া ডেটা সংগ্রহের রাউট
app.get('/fetch', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URL is required');

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
            proxyUsed: randomProxy.split('@')[1] 
        });
    }
});

// yt-dlp এর মাধ্যমে সরাসরি ডাউনলোড লিঙ্ক পাওয়ার রাউট
app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, message: 'URL is required' });

    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];

    // yt-dlp কমান্ড (প্রক্সিসহ সরাসরি লিঙ্ক বের করার জন্য -g ফ্ল্যাগ)
    const command = `yt-dlp --proxy "${randomProxy}" -g "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to extract link', 
                error: stderr 
            });
        }
        const downloadUrl = stdout.trim();
        res.json({
            success: true,
            title: "Link Generated Successfully",
            download_link: downloadUrl,
            proxy_used: randomProxy.split('@')[1]
        });
    });
});

// সার্ভার লিসেনিং
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
