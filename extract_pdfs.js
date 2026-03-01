const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const pdfDir = 'd:\\Google Antigravity\\Tarang 2026\\Resources\\Technical events';

const files = [
    'TARANG-GPTC KANNUR-CIVIL ENGINEERING.pdf',
    'TARANG-GPTC KANNUR-ELECTRICAL AND ELECTRONICS ENGINEERING.pdf',
    'TARANG-GPTC KANNUR-ELECTRONICS ENGG.pdf',
    'TARANG-GPTC KANNUR-MECHANICAL ENGINEERING.pdf',
    'TARANG-GPTC KANNUR-TEXTILE TECHNOLOGY.pdf',
    'TARANG-GPTC KANNUR-WOOD AND PAPER TECHNOLOGY.pdf'
];

async function extractAll() {
    for (const file of files) {
        const filePath = path.join(pdfDir, file);
        try {
            const buf = fs.readFileSync(filePath);
            const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
            const parser = new PDFParse(uint8);
            const data = await parser.getText();
            console.log('========================================');
            console.log('FILE: ' + file);
            console.log('========================================');
            console.log(data);
            console.log('\n\n');
        } catch (err) {
            console.log('ERROR reading ' + file + ': ' + err.message);
        }
    }
}

extractAll();
