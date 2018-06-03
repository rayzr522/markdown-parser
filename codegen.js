let styles = {
    reset: '\033[0m',
    bold: '\033[1m',
    italic: '\033[3m',
    underline: '\033[4m',
    strikethrough: '\033[9m',
    blockquote: '\033[33m',
    blockquoteArrow: '\033[2m> \033[0m',
    code: '\033[40m\033[36m'
};

const codegen = (tokens, prepend = '') => {
    let output = '';

    [].concat(tokens).forEach(token => {
        output += prepend;
        switch (token.type) {
            case 'RAW':
                output += token.value;
                break;
            case 'BOLD':
                output += `${styles.bold}${codegen(token.value, styles.bold)}${styles.reset}`;
                break;
            case 'ITALIC':
                output += `${styles.italic}${codegen(token.value, styles.italic)}${styles.reset}`;
                break;
            case 'UNDERLINE':
                output += `${styles.underline}${codegen(token.value, styles.underline)}${styles.reset}`;
                break;
            case 'STRIKETHROUGH':
                output += '~~' + codegen(token.value) + '~~';
                break;
            case 'LINK':
                output += `${codegen(token.value)} (Link: ${token.url})`;
                break;
            case 'IMG':
                output += `${codegen(token.value)} (Image: ${token.url})`;
                break;
            case 'BLOCKQUOTE':
                output += `${styles.blockquoteArrow}${styles.blockquote}${codegen(token.value, styles.blockquote)}${styles.reset}`;
                break;
            case 'HEADER':
                output += `${styles.bold}${'='.repeat(token.level * 2)}|${styles.reset} ${codegen(token.value)}${token.level <= 2 ? '\n' + '-'.repeat(process.stdout.columns) : ''}`;
                break;
            case 'CODE':
                output += `${styles.code}${token.value}${styles.reset}`;
                break;
            case 'CODEBLOCK':
                let lines = token.value.split('\n');
                let longestLine = lines.reduce((mem, next) => next.length > mem ? next.length : mem, 0);
                let spacer = `${' '.repeat(longestLine)}`;

                lines.unshift(spacer);
                lines.push(spacer);

                output += lines.map(line => `${styles.code}  ${line}${' '.repeat(longestLine - line.length)}  ${styles.reset}`).join('\n');
                break;
        }
    });

    return output;
};

module.exports = codegen;