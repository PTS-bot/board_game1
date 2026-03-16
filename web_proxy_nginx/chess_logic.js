// chess_logic.js
// ระบบการเดินและโจมตีสำหรับเกมหมากรุกคณิตศาสตร์ 8x8

let boardState = Array(8).fill(null).map(() => Array(8).fill(null));
let selectedPos = null;
let validMoves = [];

const PIECES = {
    'pawn':   { iconBlack: '♟', iconWhite: '♙', type: 'pawn' },
    'rook':   { iconBlack: '♜', iconWhite: '♖', type: 'rook' },
    'knight': { iconBlack: '♞', iconWhite: '♘', type: 'knight' },
    'bishop': { iconBlack: '♝', iconWhite: '♗', type: 'bishop' },
    'queen':  { iconBlack: '♛', iconWhite: '♕', type: 'queen' },
    'king':   { iconBlack: '♚', iconWhite: '♔', type: 'king' }
};

// เริ่มต้นกระดานและวางหมาก
function initChessBoard() {
    const container = document.getElementById('board-container');
    container.innerHTML = '';
    
    // ตั้งค่าขนาดและขอบของกระดานตามบอร์ดคอนฟิก
    container.style.gridTemplateColumns = `repeat(8, ${BOARD_CONFIG.cellSize}px)`;
    container.style.gridTemplateRows = `repeat(8, ${BOARD_CONFIG.cellSize}px)`;
    container.style.border = `${BOARD_CONFIG.borderSize}px solid ${BOARD_CONFIG.borderColor}`;
    
    // Setup initial board state
    // Black at top (row 0, 1), White at bottom (row 6, 7)
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            let pieceInfo = null;
            if(r === 0) pieceInfo = { type: backRow[c], color: 'black' };
            if(r === 1) pieceInfo = { type: 'pawn', color: 'black' };
            if(r === 6) pieceInfo = { type: 'pawn', color: 'white' };
            if(r === 7) pieceInfo = { type: backRow[c], color: 'white' };
            
            boardState[r][c] = pieceInfo;
            
            const cell = document.createElement('div');
            const isWhiteCell = (r+c)%2===0;
            cell.className = `block ${isWhiteCell ? 'white' : 'black'}`;
            cell.id = `cell-${r}-${c}`;
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            // ตั้งค่าสีกระดานให้กับช่อง
            cell.style.backgroundColor = isWhiteCell ? BOARD_CONFIG.colorLight : BOARD_CONFIG.colorDark;
            
            cell.onclick = () => onCellClick(r, c);
            
            if(pieceInfo) {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'piece';
                pieceDiv.innerText = pieceInfo.color === 'white' ? PIECES[pieceInfo.type].iconWhite : PIECES[pieceInfo.type].iconBlack;
                // ให้สีเห็นชัดเจน ขาว(เทาอ่อน) ดำ(ดำสนิท)
                pieceDiv.style.color = pieceInfo.color === 'white' ? '#ecf0f1' : '#111';
                if(pieceInfo.color === 'white') pieceDiv.style.textShadow = '0 0 5px #000, 2px 2px 4px #000';
                
                cell.appendChild(pieceDiv);
            }
            container.appendChild(cell);
        }
    }
}

function renderBoard() {
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.innerHTML = '';
            
            const isWhiteCell = (r+c)%2===0;
            cell.className = `block ${isWhiteCell ? 'white' : 'black'}`; // ติดสีพื้นฐาน
            cell.style.backgroundColor = isWhiteCell ? BOARD_CONFIG.colorLight : BOARD_CONFIG.colorDark;
            
            // Highlight selected
            if (selectedPos && selectedPos.r === r && selectedPos.c === c) {
                cell.classList.add('selected');
            }
            
            // Highlight valid moves/attacks
            const vMove = validMoves.find(m => m.r === r && m.c === c);
            if (vMove) {
                if(vMove.isAttack) cell.classList.add('attack');
                else cell.classList.add('highlight');
            }
            
            const pieceInfo = boardState[r][c];
            if(pieceInfo) {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'piece';
                pieceDiv.innerText = pieceInfo.color === 'white' ? PIECES[pieceInfo.type].iconWhite : PIECES[pieceInfo.type].iconBlack;
                pieceDiv.style.color = pieceInfo.color === 'white' ? '#ecf0f1' : '#111';
                if(pieceInfo.color === 'white') pieceDiv.style.textShadow = '0 0 5px #000, 2px 2px 4px #000';
                cell.appendChild(pieceDiv);
            }
        }
    }
}

// คลิกบนช่อง 8x8
function onCellClick(r, c) {
    // กำลังรอต่อสู้ ห้ามคลิก
    if (window.activeBlockMetaData) return;
    
    const clickedPiece = boardState[r][c];
    
    // ถ้ามีการเลือกหมากตัวเองไว้แล้ว แล้วคลิกช่องที่เดินไปได้
    if (selectedPos) {
        const vMove = validMoves.find(m => m.r === r && m.c === c);
        if (vMove) {
            executeMove(selectedPos, {r, c}, vMove.isAttack);
            return;
        }
    }
    
    // ถ้าคลิกเลือกหมากตัวเอง
    if (clickedPiece && clickedPiece.color === turnColor) {
        selectedPos = {r, c};
        validMoves = getValidMovesFor(r, c, clickedPiece);
        renderBoard();
        return;
    }
    
    // คลิกช่องว่าง หรือของฝั่งตรงข้ามโดยไม่ได้ผ่านการเดินปกติ
    selectedPos = null;
    validMoves = [];
    renderBoard();
}

function getValidMovesFor(r, c, piece) {
    let moves = [];
    const dir = piece.color === 'white' ? -1 : 1; // ขาวเดินขึ้น(-1), ดำเดินลง(+1)
    
    function addMove(nr, nc) {
        if(nr<0 || nr>7 || nc<0 || nc>7) return false;
        const target = boardState[nr][nc];
        if(!target) {
            moves.push({r: nr, c: nc, isAttack: false});
            return true; // ช่องว่าง เดินต่อได้ (สำหรับ rook, bishop, queen)
        } else if(target.color !== piece.color) {
            moves.push({r: nr, c: nc, isAttack: true});
            return false; // เจอศัตรู กินได้แต่เดินทะลุไม่ได้
        }
        return false; // เจอพวกเดียวกัน ขวางทาง
    }

    if (piece.type === 'pawn') {
        // เดินหน้า 1 ช่อง
        if (r+dir >= 0 && r+dir <= 7 && !boardState[r+dir][c]) {
            moves.push({r: r+dir, c, isAttack: false});
            // ก้าวแรก เดิน 2 ช่องได้
            let isFirstMove = (piece.color === 'white' && r === 6) || (piece.color === 'black' && r === 1);
            if(isFirstMove && !boardState[r+(dir*2)][c]) {
                moves.push({r: r+(dir*2), c, isAttack: false});
            }
        }
        // กินเฉียง
        for(let dc of [-1, 1]) {
            if(r+dir >= 0 && r+dir <= 7 && c+dc >= 0 && c+dc <= 7) {
                const tgt = boardState[r+dir][c+dc];
                if(tgt && tgt.color !== piece.color) {
                    moves.push({r: r+dir, c: c+dc, isAttack: true});
                }
            }
        }
    }
    else if (piece.type === 'rook') {
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        dirs.forEach(d => {
            let nr=r+d[0], nc=c+d[1];
            while(addMove(nr, nc)) { nr+=d[0]; nc+=d[1]; }
        });
    }
    else if (piece.type === 'bishop') {
        const dirs = [[1,1], [1,-1], [-1,1], [-1,-1]];
        dirs.forEach(d => {
            let nr=r+d[0], nc=c+d[1];
            while(addMove(nr, nc)) { nr+=d[0]; nc+=d[1]; }
        });
    }
    else if (piece.type === 'queen') {
        const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
        dirs.forEach(d => {
            let nr=r+d[0], nc=c+d[1];
            while(addMove(nr, nc)) { nr+=d[0]; nc+=d[1]; }
        });
    }
    else if (piece.type === 'knight') {
        const jumps = [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]];
        jumps.forEach(j => addMove(r+j[0], c+j[1]));
    }
    else if (piece.type === 'king') {
        const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
        dirs.forEach(d => addMove(r+d[0], c+d[1]));
    }

    return moves;
}

function executeMove(from, to, isAttack) {
    const attackerPiece = boardState[from.r][from.c];
    const defenderPiece = isAttack ? boardState[to.r][to.c] : null;

    if (!isAttack) {
        // เดินช่องว่างปกติ เปลี่ยนตา
        boardState[to.r][to.c] = attackerPiece;
        boardState[from.r][from.c] = null;
        selectedPos = null;
        validMoves = [];
        turnColor = turnColor === 'white' ? 'black' : 'white';
        renderBoard();
        window.updateUI(); // ของ index.html
        return;
    }

    // กรณีเกิดการต่อสู้ (Attack)
    selectedPos = null;
    validMoves = [];
    renderBoard();

    // -- คำนวณเลเวลความยากตามกฎที่ USER ระบุ --
    const combatData = {
        level: calculateCombatLevel(from, to, attackerPiece, defenderPiece),
        attackerPiece,
        defenderPiece,
        from,
        to
    };

    // ส่งเข้า UI ของหน้า index.html
    window.fetchQuestionForCombat(combatData.level, combatData);
}

function countAura(r, c, allyColor, ignorePos) {
    let count = 0;
    // ลูปดูระยะ 1 ช่องรอบตัวเป้าหมาย (r, c)
    for(let dr=-1; dr<=1; dr++) {
        for(let dc=-1; dc<=1; dc++) {
            if(dr===0 && dc===0) continue;
            let nr = r + dr, nc = c + dc;
            if (ignorePos && nr === ignorePos.r && nc === ignorePos.c) continue; // ข้ามตัวที่ถูกระบุ (เพื่อไม่ให้บัพตัวเอง)
            
            if(nr>=0 && nr<=7 && nc>=0 && nc<=7) {
                const adjPiece = boardState[nr][nc];
                if(adjPiece && adjPiece.color === allyColor && (adjPiece.type === 'bishop' || adjPiece.type === 'queen')) {
                    count++;
                }
            }
        }
    }
    return count;
}

function calculateCombatLevel(from, to, attacker, defender) {
    let baseLevel = 2; // Default for non-specified 

    // กฎพิเศษ
    if (attacker.type === 'pawn' && defender.type === 'knight') {
        baseLevel = 4;
    } 
    else if (attacker.type === defender.type) {
        baseLevel = 3; // หมากชนิดเดียวกันสู้กันเอง
    }
    else if (attacker.type === 'knight' && defender.type !== 'king' && defender.type !== 'queen') {
        baseLevel = 1; // อัศวิน โจมตี ตัวอื่น(ที่ไม่ใช่คิงกับควีน)
    }
    else if (attacker.type === 'king' && defender.type !== 'king' && defender.type !== 'queen') {
        baseLevel = 1; // คิงมีความสามารถเหมือนอัศวิน
    }
    else if (attacker.type === 'rook') {
        baseLevel = 2; // เรือโจมตีอะไรก็ Lv2
    }
    else if (defender.type === 'rook') {
        baseLevel = 2; // ใครโจมตีเรือก็ Lv2 (เว้นแต่จะเจอบัฟ)
    }

    // เช็คออร่า Buff ของ 8 ทิศรอบตัวเป้าหมาย
    const attackerBuffCount = countAura(to.r, to.c, attacker.color, from); // ท่าดีขึ้น ตัวบัฟยืนใกล้เป้าหมาย (ไม่นับตัวเอง)
    const defenderBuffCount = countAura(to.r, to.c, defender.color, to);   // ยืนป้องกันเพื่อน (ไม่นับตัวเอง)

    baseLevel -= attackerBuffCount;
    baseLevel += defenderBuffCount;

    // Lock range 1-4
    if(baseLevel < 1) baseLevel = 1;
    if(baseLevel > 4) baseLevel = 4;

    return baseLevel;
}

// ------------------------------------------
// Callback ที่ถูกเรียกกลับมาจากหน้า index.html 
// ------------------------------------------
window.handleCombatResult = function(isCorrect, combatData) {
    const { from, to, attackerPiece, defenderPiece, isCounterAttack, originalTurnColor } = combatData;
    
    // หากนี่คือผลจากการสวนกลับ
    if (isCounterAttack) {
        // คืนค่าตาเดินกลับเป็นของคนที่เริ่มโจมตีตอนแรก (เพื่อให้ตอนท้ายฟังก์ชันมันสลับไปเป็นตาของอีกฝั่งให้ถูกต้อง)
        turnColor = originalTurnColor;
        
        if (isCorrect) {
            alert(`🚨 ${attackerPiece.type} สวนกลับสำเร็จ! หมากฝั่งตรงข้ามถูกกิน`);
            boardState[to.r][to.c] = null; // เป้าหมายของการสวนกลับ (คือผู้โจมตีตอนแรก) ตาย, แต่ตัวสวนกลับอยู่ที่เดิม
            
            if (defenderPiece.type === 'king') { // ถ้าคนที่ไปปะทะตายเป็นคิง
                const defeatedPlayerIndex = players.findIndex(p => p.color === defenderPiece.color);
                players[defeatedPlayerIndex].isDefeated = true;
                renderBoard();
                window.endGame();
                return;
            }
        } else {
            alert(`💥 มึนงง! สวนกลับล้มเหลว!`);
        }
        
        // จบกรณีสวนกลับ มันจะไหลลงไปข้างล่างเพื่อสลับเทิร์นปกติ (turnColor = turnColor === 'white' ? 'black' : 'white')
    } 
    else {
        // กรณีการโจมตีธรรมดา
        if (isCorrect) {
            // ตอบถูก - โจมตีสำเร็จ กินหมาก กินคิงชนะเลย
            alert(`⚔️ โจมตีสำเร็จ! กิน ${defenderPiece.type} ศัตรูได้`);
            boardState[to.r][to.c] = attackerPiece;
            boardState[from.r][from.c] = null;
            
            if (defenderPiece.type === 'king') {
                const defeatedPlayerIndex = players.findIndex(p => p.color === defenderPiece.color);
                players[defeatedPlayerIndex].isDefeated = true;
                renderBoard();
                window.endGame();
                return;
            }

        } else {
            // ตอบผิด - โจมตีไม่สำเร็จ
            alert(`💢 โจมตีไม่สำเร็จ! ถอยกลับจุดเดิม`);
            
            // กฎสวนกลับของ King และ Queen
            if (defenderPiece.type === 'king' || defenderPiece.type === 'queen') {
                alert(`🚨 ระวัง! ${defenderPiece.type} เตรียมโจมตีสวนกลับ! ฝั่ง ${defenderPiece.color} โปรดมาตอบคำถามโจทย์ป้องกันตัว`);
                
                // สลับ turnColor ชั่วคราวเพื่อให้ UI บันทึก log ได้ถูกต้องเวลารับคำตอบ
                let currentAtkColor = turnColor;
                turnColor = turnColor === 'white' ? 'black' : 'white';
                window.updateUI();

                // คำนวณเลเวลสวนกลับ (เริ่ม 2 + บัฟออร่าเพื่อน)
                let baseLevel = 2;
                // หาบัพแถวๆ เป้าหมาย (from) ที่เป็นสีของคนสวนกลับ (ไม่นับตัวเองที่ to)
                let counterBuffCount = countAura(from.r, from.c, defenderPiece.color, to); 
                baseLevel -= counterBuffCount;
                if(baseLevel < 1) baseLevel = 1;
                if(baseLevel > 4) baseLevel = 4;

                const counterCombatData = {
                    level: baseLevel,
                    attackerPiece: defenderPiece, // คนสวนกลับคือ attacker ของตาใหม่
                    defenderPiece: attackerPiece, // เป้าหมายของการสวนคือคนที่ทำตีพลาด
                    from: to, // สวนกลับจากตำแหน่งที่มันยืนอยู่ (to)
                    to: from, // เป้าหมายของการสวนกลับคือตำแหน่งคนโจมตี (from)
                    isCounterAttack: true,
                    originalTurnColor: currentAtkColor
                };
                
                window.fetchQuestionForCombat(counterCombatData.level, counterCombatData);
                return; // หยุดการทำงานตรงนี้ เพื่อรอผลจากหน้า UI สำหรับสวนกลับ
            }
        }
    }

    // เปลี่ยนเทิร์น
    turnColor = turnColor === 'white' ? 'black' : 'white';
    renderBoard();
    window.updateUI();
};
