const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
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

server.listen(3000, () => console.log('Server Island Mode Active'));