const express = require('express');
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'request_logs.txt');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
const loggingMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    res.on('finish', () => {
        const endTime = Date.now();
        const processingTime = endTime - startTime;
        const logMessage = `${timestamp} | ${method} ${url} | Status: ${res.statusCode} | Processing Time: ${processingTime}ms\n`;
        console.log(logMessage.trim());
        logStream.write(logMessage);
    });
    next();
};
const app = express();
app.use(loggingMiddleware);
app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

app.get('/about', (req, res) => {
    res.send('Hello sir, this about route is working fine hehe!.');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
