const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();

// আপনার ওয়েবসাইটের ডোমেইন থেকে রিকোয়েস্ট আসার অনুমতি দেওয়া
app.use(cors());

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    
    if (!videoURL) {
        return res.status(400).json({ error: 'Please provide a video URL' });
    }

    try {
        // ভিডিওর ইনফো চেক করা (বট ডিটেকশন এড়াতে Headers ব্যবহার করা হয়েছে)
        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                }
            }
        });

        // ভিডিও টাইটেল থেকে অপ্রয়োজনীয় চিহ্ন সরানো
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || "video";

        // ব্রাউজারকে ভিডিও ফাইল হিসেবে ডাউনলোড করতে বলা
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(videoURL, {
            format: 'mp4',
            quality: 'highest',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
                }
            }
        }).pipe(res);

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Failed to process video. The link might be private or restricted.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
});
