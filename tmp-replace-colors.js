const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'styles');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Safe replacements that translate well across both themes
    // --color-gold -> --accent-primary
    content = content.replace(/var\(--color-gold\)/g, 'var(--accent-primary)');
    // --color-gold-dark -> --accent-primary
    content = content.replace(/var\(--color-gold-dark\)/g, 'var(--accent-primary)');
    // --color-crimson -> --accent-secondary
    content = content.replace(/var\(--color-crimson\)/g, 'var(--accent-secondary)');
    
    // Some variables like --color-navy/--color-ivory need context.
    // If it's a color attribute: color: var(--color-ivory) -> color: var(--text-primary)
    // If it's a color attribute: color: var(--color-navy) -> color: var(--text-primary) -- Wait, in dark mode text is ivory. If something hardcoded navy, it was likely meant to be text-primary in light mode, text-primary in dark mode. 
    // Wait, if it hardcoded --color-ivory for text in a dark section, and that section became a var(--card-bg) section, it should be --text-primary.
    content = content.replace(/color:\s*var\(--color-ivory\)/g, 'color: var(--text-primary)');
    content = content.replace(/color:\s*var\(--color-navy\)/g, 'color: var(--text-primary)');
    
    // Backgrounds
    content = content.replace(/background-color:\s*var\(--color-navy-light\)/g, 'background-color: var(--bg-secondary)');
    content = content.replace(/background:\s*var\(--color-navy-light\)/g, 'background: var(--bg-secondary)');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}

fs.readdirSync(stylesDir).forEach(file => {
    if (file.endsWith('.css')) {
        processFile(path.join(stylesDir, file));
    }
});
console.log('Done.');
