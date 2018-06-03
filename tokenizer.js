const tokenTypes = {
    BOLD: /^\*\*(.*?)\*\*/,
    ITALIC: /^\*(.*)\*/,
    UNDERLINE: /^__(.*?)__/,
    STRIKETHROUGH: /^\~\~(.*?)~~__/,
    IMG: /^!\[(.*)\]\((.*?)\)/,
    LINK: /^\[(.*)\]\((.*?)\)/,
    BLOCKQUOTE: /^> (.*)/,
    HEADER: /^(#{1,6}) (.*)/,
    CODE: /^`([^`\n]+?)`/,
    CODEBLOCK: /^```[a-z]*?\n([^`]*?)\n```/
};

const tokenizer = input => {
    let rawBuffer = '';
    let pos = 0;
    let tokens = [];

    const pushRaw = () => {
        if (rawBuffer) {
            tokens.push({
                type: 'RAW',
                value: rawBuffer
            });

            rawBuffer = '';
        }
    };

    const addToken = (token, len) => {
        pushRaw();

        tokens.push(token);
        pos += len;
    };

    while (pos < input.length) {
        for (let type in tokenTypes) {
            let result = tokenTypes[type].exec(input.substr(pos));
            if (result) {
                let token = { type };

                if (type === 'LINK' || type === 'IMG') {
                    token.url = result[2];
                }

                if (type === 'HEADER') {
                    token.value = tokenizer(result[2]);
                    token.level = result[1].length;
                } else if (type === 'CODE' || type === 'CODEBLOCK') {
                    // No processing
                    token.value = result[1];
                } else {
                    token.value = tokenizer(result[1]);
                }

                addToken(token, result[0].length);
                break;
            }
        }

        rawBuffer += input[pos++] || '';
    }

    pushRaw();

    return tokens.length === 1 ? tokens[0] : tokens;
};

module.exports = tokenizer;