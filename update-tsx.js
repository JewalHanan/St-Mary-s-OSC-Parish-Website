import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

function getTsxFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getTsxFiles(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = getTsxFiles(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace `color: 'var(--color-gold)'` and `color: 'var(--accent-primary)'`
    // ONLY when inside of an inline style object or string, applied to text colors.
    
    const regex1 = /color:\s*'var\(--color-gold\)'/g;
    const regex2 = /color:\s*'var\(--accent-primary\)'/g;
    
    // We also might have backtick strings or double quotes
    const regex3 = /color:\s*"var\(--color-gold\)"/g;
    const regex4 = /color:\s*"var\(--accent-primary\)"/g;

    let newContent = content
        .replace(regex1, "color: 'var(--text-accent)'")
        .replace(regex2, "color: 'var(--text-accent)'")
        .replace(regex3, 'color: "var(--text-accent)"')
        .replace(regex4, 'color: "var(--text-accent)"');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
        console.log(`Updated ${path.basename(file)}`);
    }
});

console.log(`Updated ${changedFiles} files successfully.`);
