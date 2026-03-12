// board_config.js
// สำหรับให้ครูแก้ไขการตั้งค่ากระดานเกมได้โดยตรง

const BoardSetup = {
    // กำหนดขนาดของกระดาน (คอลัมน์ x แถว)
    cols: 16,
    rows: 9,

    // ขนาดกว้าง x สูง ของแต่ละบล็อก (เช่น 60, 80)
    blockSize: 95,

    // กำหนดรายละเอียดของแต่ละบล็อก (เริ่มต้นที่ลำดับ 1)
    // type: 
    //   'A' = Start (รับเงินเดือน)
    //   'B' = พื้นที่เกาะ (ต้องทำโจทย์เพื่อลดค่าผ่านทาง)
    //   'C' = พื้นที่น้ำ (ว่างเปล่า) 
    //   'D' = คุก (ต้องทำโจทย์สุ่มเพื่อออก)
    //   'E' = ท่องเที่ยว (ทำโจทย์ผ่าน เลือกลงช่องไหนก็ได้)
    //   'F' = ตกค้าง/เสียภาษี (เสีย % ของเงินที่มี)
    blocks: [
        // เพิ่ม color: 'สี', image: 'path/to/img.png' เพื่อกำหนดรูปและสีพื้นหลังได้
        { id: 1, type: 'A', value: 3000, name: 'Start', color: '#ffde59', image: '' },
        { id: 2, type: 'B', value: 500, name: 'เกาะ 1', color: '#ff914d', image: '' },
        { id: 3, type: 'B', value: 800, name: 'เกาะ 2', color: '#c1ff72', image: '' },
        { id: 4, type: 'B', value: 600, name: 'เกาะ 3', color: '#7ed957', image: '' },
        { id: 5, type: 'C', value: 0, name: 'ทะเล' },
        { id: 6, type: 'B', value: 1000, name: 'เกาะ 4' },
        { id: 7, type: 'D', value: 0, name: 'คุกคณิต' },
        { id: 8, type: 'B', value: 500, name: 'เกาะ 5' },
        { id: 9, type: 'B', value: 1200, name: 'เกาะ 6' },
        { id: 10, type: 'C', value: 0, name: 'ทะเล' },
        { id: 11, type: 'F', value: 5, name: 'เสียภาษี 5%' },
        { id: 12, type: 'B', value: 500, name: 'เกาะ 1' },
        { id: 13, type: 'B', value: 800, name: 'เกาะ 2' },
        { id: 14, type: 'B', value: 600, name: 'เกาะ 3' },
        { id: 15, type: 'C', value: 0, name: 'ทะเล' },
        { id: 16, type: 'B', value: 1000, name: 'เกาะ 4' },
        { id: 17, type: 'D', value: 0, name: 'คุกคณิต' },
        { id: 18, type: 'B', value: 500, name: 'เกาะ 5' },
        { id: 19, type: 'B', value: 1200, name: 'เกาะ 6' },
        { id: 20, type: 'C', value: 0, name: 'ทะเล' },
        { id: 21, type: 'F', value: 5, name: 'เสียภาษี 5%' },
        { id: 22, type: 'B', value: 500, name: 'เกาะ 1' },
        { id: 23, type: 'B', value: 800, name: 'เกาะ 2' },
        { id: 24, type: 'B', value: 600, name: 'เกาะ 3' },
        { id: 25, type: 'C', value: 0, name: 'ทะเล' },
        { id: 26, type: 'B', value: 1000, name: 'เกาะ 4' },
        { id: 27, type: 'D', value: 0, name: 'คุกคณิต' },
        { id: 28, type: 'B', value: 500, name: 'เกาะ 5' },
        { id: 29, type: 'B', value: 1200, name: 'เกาะ 6' },
        { id: 30, type: 'C', value: 0, name: 'ทะเล' },
        { id: 31, type: 'F', value: 5, name: 'เสียภาษี 5%' }, // 5%
        { id: 32, type: 'B', value: 500, name: 'เกาะ 1' },
        { id: 33, type: 'B', value: 800, name: 'เกาะ 2' },
        { id: 34, type: 'B', value: 600, name: 'เกาะ 3' },
        { id: 35, type: 'C', value: 0, name: 'ทะเล' },
        { id: 36, type: 'B', value: 1000, name: 'เกาะ 4' },
        { id: 37, type: 'D', value: 0, name: 'คุกคณิต' },
        { id: 38, type: 'B', value: 500, name: 'เกาะ 5' },
        { id: 39, type: 'B', value: 1200, name: 'เกาะ 6' },
        { id: 40, type: 'C', value: 0, name: 'ทะเล' },
        { id: 41, type: 'F', value: 5, name: 'เสียภาษี 5%' },
        { id: 42, type: 'B', value: 500, name: 'เกาะ 1' },
        { id: 43, type: 'B', value: 800, name: 'เกาะ 2' },
        { id: 44, type: 'B', value: 600, name: 'เกาะ 3' },
        { id: 45, type: 'C', value: 0, name: 'ทะเล' },
        { id: 46, type: 'B', value: 1000, name: 'เกาะ 4' },
        { id: 47, type: 'D', value: 0, name: 'คุกคณิต' },
        { id: 48, type: 'B', value: 500, name: 'เกาะ 5' },
        { id: 49, type: 'B', value: 1200, name: 'เกาะ 6' },
        { id: 50, type: 'C', value: 0, name: 'ทะเล' },
        { id: 51, type: 'F', value: 5, name: 'เสียภาษี 5%' },
        // สำหรับบล็อกที่เหลือที่ไม่ได้กำหนด ระบบจะปรับให้เป็น 'C' พื้นที่น้ำอัตโนมัติ
    ]
};

// ฟังก์ชันดึงค่า Board Config
function getBoardConfig() {
    const totalOuterBlocks = (BoardSetup.cols * 2) + (BoardSetup.rows * 2) - 4;
    let config = {};

    // สร้างบล็อกกรอบนอก
    for (let i = 1; i <= totalOuterBlocks; i++) {
        // หาค่าที่ครูตั้งไว้ ถ้าไม่มีให้เป็น C (ทะเล)
        const customBlock = BoardSetup.blocks.find(b => b.id === i);
        if (customBlock) {
            config[i] = customBlock;
        } else {
            config[i] = { id: i, type: 'C', value: 0, name: 'ทะเล' };
        }
    }

    return { config, cols: BoardSetup.cols, rows: BoardSetup.rows, blockSize: BoardSetup.blockSize || 60 };
}
