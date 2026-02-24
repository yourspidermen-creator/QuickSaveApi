const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// আপনার WebShare প্রক্সি লিস্ট (A to Z list)
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

// র‍্যান্ডম প্রক্সি পাওয়ার ফাংশন
function getRandomProxy() {
    return proxies[Math.floor(Math.random() * proxies.length)];
}

// সোশ্যাল মিডিয়া রিকোয়েস্ট হ্যান্ডলার
async function handleSocialRequest(url) {
    const proxyUrl = getRandomProxy();
    const agent = new HttpsProxyAgent(proxyUrl);

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Proxy ${proxyUrl} failed. Retrying...`);
        // এরর হলে অন্য একটি প্রক্সি দিয়ে ট্রাই করা যেতে পারে
        throw error;
    }
}
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`API is active on port ${PORT}`);
});
