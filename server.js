const express = require('express');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors()); // ফ্রন্টএন্ড থেকে এক্সেস করার জন্য

const PORT = process.env.PORT || 10000;

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
    res.send('QuickSave API is live! Use /download?url=YOUR_URL');
});

// এই রাউটটিই আপনার এরর দিচ্ছে, তাই এটি নিশ্চিতভাবে যোগ করুন
app.get('/download', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, message: 'URL is required' });

    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    const command = `yt-dlp --proxy "${randomProxy}" -g "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ success: false, error: stderr });
        }
        res.json({
            success: true,
            download_link: stdout.trim(),
            proxy_used: randomProxy.split('@')[1]
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
