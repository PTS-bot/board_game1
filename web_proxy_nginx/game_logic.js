// game_logic.js
// ระบบตัวช่วยจัดการเกมแต่ละประเภท

// กำหนดตัวเลือกความยากและบทลงโทษในนี้ได้เลย
const LevelOptions = {
    4: { label: "Lv.4 (รอด 100%)", discount: 1.0, penaltyMultiplier: 0, color: '#3498db' },
    3: { label: "Lv.3 (ลดเงินปรับ 50%)", discount: 0.5, penaltyMultiplier: 0.5, color: '#3498db' },
    2: { label: "Lv.2 (ลดเงินปรับ 20%)", discount: 0.2, penaltyMultiplier: 0.8, color: '#3498db' },
    1: { label: "Lv.1 (ลดเงินปรับ 10%)", discount: 0.1, penaltyMultiplier: 0.9, color: '#3498db' },
    0: { label: "ยอมจ่ายเต็ม", discount: 0.0, penaltyMultiplier: 1.0, color: '#e74c3c', skipQuestion: true }
};

function handleBlockLanding(player, block, callback) {
    if (block.type === 'A') {
        // รับเงินเดือน (จัดการใน main loop แล้ว)
        alert(`🎉 ${player.name} อยู่ที่จุด Start!`);
        callback(true); // จบเทิร์นปกติ
    }
    else if (block.type === 'B') {
        // เกาะ: ต้องเลือกความยากเพื่อรับส่วนลดค่าผ่านทาง
        showLevelSelectionModal(player, block, callback);
    }
    else if (block.type === 'C') {
        // ทะเล/ว่างเปล่า
        console.log("ลอยคอในทะเล...");
        callback(true);
    }
    else if (block.type === 'D') {
        // คุก: สุ่มข้อ 1-4 บังคับทำ
        alert(`🚓 ${player.name} ตกคุก ต้องตอบคำถามแบบสุ่มเพื่อออกมา!`);
        const randomLevel = Math.floor(Math.random() * 4) + 1;
        fetchQuestionForBlock(randomLevel, 'D', block, callback);
    }
    else if (block.type === 'E') {
        // ท่องเที่ยว: ทำ Lv 1 สำเร็จ ถึงไปลงไหนก็ได้
        alert(`✈️ ${player.name} ตกช่องตั๋วเที่ยว! ตอบข้อ Lv1 ถูกจะได้เลือกบินไปไหนก็ได้!`);
        fetchQuestionForBlock(1, 'E', block, callback);
    }
    else if (block.type === 'F') {
        // เสียภาษี X%
        const taxPercent = block.value;
        const taxAmount = Math.floor(player.money * (taxPercent / 100));
        alert(`💸 จ่ายภาษี ${taxPercent}% เป็นเงิน ฿${taxAmount.toLocaleString()}`);
        player.money -= taxAmount;
        if (player.money <= 0) player.money = 0;
        callback(true);
    }
    else {
        callback(true);
    }
}

// แทรกลอจิกการให้หน้าต่างเลือกระดับ (ส่งต่อไปยัง UI)
function showLevelSelectionModal(player, block, callback) {
    // บังคับแสดง Modal สำหรับเลือก Lv1 - Lv4 แทนทีจะขึ้นคำถามเลย
    document.getElementById('level-select-modal').classList.remove('hidden');

    const container = document.getElementById('level-options-container');
    container.innerHTML = '';

    // สร้างปุ่มตามที่ตั้งค่าไว้ใน LevelOptions เรียงจากมากไปน้อย
    Object.keys(LevelOptions).sort((a, b) => b - a).forEach(level => {
        const opt = LevelOptions[level];
        const btn = document.createElement('button');
        btn.className = 'btn-lvl';
        btn.style.background = opt.color;
        btn.innerText = opt.label;
        btn.onclick = () => selectLevelAndFetch(parseInt(level));
        container.appendChild(btn);
    });

    // กำหนดให้ปุ่ม Level กดแล้วดึงคำถามมา
    window.selectLevelAndFetch = function (level) {
        document.getElementById('level-select-modal').classList.add('hidden');

        const opt = LevelOptions[level];
        // แนบ rule ย่อยไปด้วย
        block.currentRule = { level, penaltyMultiplier: opt.penaltyMultiplier, originalValue: block.value };

        if (opt.skipQuestion) {
            // ยอมจ่ายทันที
            const penaltyValue = Math.floor(block.value * opt.penaltyMultiplier);
            alert(`💸 ${player.name} ยอมจ่ายเงิน ฿${penaltyValue} เพื่อไม่ได้ทำโจทย์!`);
            player.money -= penaltyValue;
            if (player.money <= 0) {
                player.money = 0;
                player.bankrupt = true;
                alert(`💀💸 ${player.name} ล้มละลาย และออกจากเกม!`);
            }
            callback(true); // ข้ามไปเทิร์นถัดไป
        } else {
            fetchQuestionForBlock(level, 'B', block, callback);
        }
    }
}
