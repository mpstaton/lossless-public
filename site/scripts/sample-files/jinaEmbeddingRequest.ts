import https from 'https';

const data = JSON.stringify({
    model: "jina-clip-v2",
    input: [
        { text: "A beautiful sunset over the beach" },
        { text: "Un beau coucher de soleil sur la plage" },
        { text: "海滩上美丽的日落" },
        { text: "浜辺に沈む美しい夕日" },
        { image: "https://i.ibb.co/nQNGqL0/beach1.jpg" },
        { image: "https://i.ibb.co/r5w8hG8/beach2.jpg" },
        { image: "R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7" }
    ]
});

const options = {
    hostname: 'api.jina.ai',
    path: '/v1/embeddings',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer jina_2c4f8253e52e4f99992b554c5208922fP9e-wftz3bbPkjALpLNhaebfooH_',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(JSON.parse(responseBody));
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
