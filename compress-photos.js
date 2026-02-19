const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Photos');
const outDir = path.join(dir, 'web');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

// Size tiers based on image purpose
function getWidth(filename) {
    if (/HERO|VIDEO|CHAPTER/.test(filename)) return 1400;  // Full-width backgrounds
    if (/SPREAD|GALLERY/.test(filename)) return 1000;       // Medium editorial
    if (/CARD|COLLAGE|PILLAR/.test(filename)) return 800;   // Smaller cards
    if (/SHARED/.test(filename)) return 600;                 // Decorative/icons
    return 1000;
}

async function processAll() {
    let totalOrig = 0;
    let totalNew = 0;

    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const w = getWidth(f);
        const inPath = path.join(dir, f);
        const outName = f.replace('.png', '.webp');
        const outPath = path.join(outDir, outName);

        try {
            await sharp(inPath)
                .resize(w, null, { withoutEnlargement: true })
                .webp({ quality: 82 })
                .toFile(outPath);

            const origSize = fs.statSync(inPath).size;
            const newSize = fs.statSync(outPath).size;
            totalOrig += origSize;
            totalNew += newSize;
            const ratio = ((1 - newSize / origSize) * 100).toFixed(0);

            console.log(
                `[${i + 1}/${files.length}] ${f.substring(0, 50).padEnd(50)} ` +
                `${(origSize / 1024).toFixed(0).padStart(5)}KB -> ${(newSize / 1024).toFixed(0).padStart(4)}KB  (-${ratio}%)`
            );
        } catch (e) {
            console.log(`FAILED: ${f} - ${e.message}`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`TOTAL: ${(totalOrig / 1024 / 1024).toFixed(1)} MB -> ${(totalNew / 1024 / 1024).toFixed(1)} MB  (-${((1 - totalNew / totalOrig) * 100).toFixed(0)}%)`);
    console.log(`Files: ${files.length} processed`);
}

processAll();
