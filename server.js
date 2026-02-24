const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    
    if (!videoURL) {
        return res.status(400).json({ error: 'ভিডিও লিঙ্ক প্রদান করুন।' });
    }

    try {
        // ভিডিওর ইনফরমেশন পাওয়ার চেষ্টা
        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    // এটি ইউটিউবকে বোঝাবে যে এটি একটি আসল ক্রোম ব্রাউজার
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive',
                }
            }
        });

        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || "video";
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // ডাউনলোড শুরু
        ytdl(videoURL, {
            format: 'mp4',
            quality: 'highest', // বা '18' দিতে পারেন যা ৩৬০পি নিশ্চিত করবে
            filter: 'audioandvideo',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Cookie': '' // এখানে কুকি দিলে ১০০% কাজ করবে, তবে আপাতত খালি রাখুন
                }
            }
        }).pipe(res);

    } catch (err) {
        console.error('Detailed Error:', err.message);
        res.status(500).json({ 
            error: 'Failed to process video.', 
            reason: err.message,
            tip: 'ইউটিউব অনেক সময় ক্লাউড আইপি ব্লক করে দেয়। কিছুক্ষণ পর আবার চেষ্টা করুন।' 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`API is active on port ${PORT}`);
});
