import fs from 'fs';
import path from 'path';

const stylesDir = path.join(process.cwd(), 'src', 'styles');

// Find all css files
function getCssFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getCssFiles(file));
        } else if (file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = getCssFiles(stylesDir);

let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // We want to replace `color: var(--accent-primary);` and `color: var(--color-gold);` with `color: var(--text-accent);`
    // We are only targeting text-related color attributes, explicitly avoiding properties like border-color, background-color, box-shadow, etc.
    const regex = /^\s*color\s*:\s*var\(--(accent-primary|color-gold)\)\s*;/gm;
    
    const newContent = content.replace(regex, (match) => {
        return match.replace(/var\(--(accent-primary|color-gold)\)/, 'var(--text-accent)');
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
        console.log(`Updated ${path.basename(file)}`);
    }
});

console.log(`Updated ${changedFiles} files successfully.`);
