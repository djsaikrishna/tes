const express = require('express');
const multer = require('multer');
const Client = require('ftp'); // npm install ftp
const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    const ftpClient = new Client();

    ftpClient.connect({
        host: 'ftp.example.com',
        user: 'ftp_username',
        password: 'ftp_password'
    });

    ftpClient.on('ready', () => {
        const fileData = req.file.buffer;
        const fileName = req.file.originalname;

        ftpClient.put(fileData, fileName, (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error uploading file to FTP server.' });
            } else {
                res.json({ message: 'File uploaded successfully to FTP server.' });
            }

            ftpClient.end();
        });
    });

    ftpClient.on('error', (error) => {
        console.error(error);
        res.status(500).json({ message: 'Error connecting to FTP server.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
