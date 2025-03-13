import https from 'https';

const data = JSON.stringify({
    model: false,
    messages: [
        {
            role: "user",
            content: "Hi!"
        },
        {
            role: "assistant",
            content: "Hi, how can I help you?"
        },
        {
            role: "user",
            content: "what's the latest blog post from jina ai?"
        }
    ],
    stream: true,
    reasoning_effort: false
});

const options = {
    hostname: 'deepsearch.jina.ai',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (d) => {
        responseData += d;
    });

    res.on('end', () => {
        console.log('Response:', responseData);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
