const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // รองรับ JSON payload

const server = http.createServer(app);
const io = new Server(server);

const generateIslandBoard = () => {
    let board = {};
    for (let i = 1; i <= 40; i++) {
        // กำหนดบล็อกหลัก 4 มุม
        if (i === 1) board[i] = { type: 'A', name: 'START' };
        else if (i === 11) board[i] = { type: 'D', name: 'JAIL' };
        else if (i === 21) board[i] = { type: 'E', name: 'TRAVEL' };
        else if (i === 31) board[i] = { type: 'F', name: 'TAX 5%' };
        // กระจายที่ดิน (B) และโจทย์ (C) ให้เท่าๆ กัน
        else if (i % 5 === 0) board[i] = { type: 'C', name: 'CHALLENGE' };
        else if (i % 2 === 0) board[i] = { type: 'B', name: 'ISLAND' };
        // ที่เหลือเป็นน้ำ
        else board[i] = { type: 'empty' };
    }
    return board;
};

io.on('connection', (socket) => {
    socket.on('getBoardConfig', () => {
        socket.emit('sendBoardConfig', generateIslandBoard());
    });
});

// รับค่าจากหน้าบ้าน (index.html) เพื่อบันทึกเกม
app.post('/api/saveGameLog', (req, res) => {
    try {
        const { gameName, gradeLevel, studentName, logData } = req.body;
        
        if (!gameName || !studentName || !gradeLevel) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const logDir = path.join(__dirname, '..', 'web_proxy_nginx', 'all_game', gameName, 'log', gradeLevel.toString());
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        // เขียนส่วนหัว CSV (รองรับ UTF-8 ด้วย \uFEFF)
        let csvContent = '\uFEFFข้อความโจทย์/ID,ระดับความยาก,ผลการตอบ\n';
        
        if (logData && Array.isArray(logData)) {
            logData.forEach(l => {
                const safeQuestion = `"${(l.question || '').replace(/"/g, '""')}"`;
                const safeLevel = `"${(l.level || '').toString().replace(/"/g, '""')}"`;
                const safeStatus = `"${(l.status || '').replace(/"/g, '""')}"`;
                csvContent += `${safeQuestion},${safeLevel},${safeStatus}\n`;
            });
        }

        const fileName = `${gameName}_${studentName}.csv`.replace(/[<>:"/\\|?*]+/g, '_');
        const filePath = path.join(logDir, fileName);

        fs.writeFileSync(filePath, csvContent, 'utf8');

        res.json({ success: true, filePath: `/all_game/${gameName}/log/${gradeLevel}/${fileName}` });
    } catch (err) {
        console.error("Save Log Error:", err);
        res.status(500).json({ error: 'Failed to write CSV log file' });
    }
});

server.listen(3000, () => console.log('Server Island Mode Active'));