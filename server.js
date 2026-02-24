const express = require('express');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const cors = require('cors');
const youtubeDl = require('yt-dlp-exec'); // সরাসরি লাইব্রেরি ইমপোর্ট করুন

const app = express();
app.use(cors()); 

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

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ success: false, message: 'URL is required' });

    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];

    try {
        // সরাসরি লাইব্রেরি ফাংশন কল করা (npx এর দরকার নেই)
        const output = await youtubeDl(videoUrl, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
            proxy: randomProxy,
            getUrl: true // শুধু লিঙ্কটি পাওয়ার জন্য
        });

        res.json({
            success: true,
            download_link: output.trim(),
            proxy_used: randomProxy.split('@')[1]
        });
    } catch (error) {
        console.error("Extraction error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Extraction failed', 
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
