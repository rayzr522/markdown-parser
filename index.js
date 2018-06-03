const fs = require('fs');
const tokenizer = require('./tokenizer');
const codegen = require('./codegen');

const main = args => {
    if (args.length < 1) {
        console.error('Usage: markdown-parser <input-file>');
        process.exit(1);
    }

    if (!fs.existsSync(args[0]) || !fs.statSync(args[0]).isFile()) {
        console.error(`The file '${args[0]}' does not exist or is not a file.`);
        process.exit(1);
    }

    let contents = fs.readFileSync(args[0]).toString();
    let tokens = tokenizer(contents);
    let output = codegen(tokens);

    console.log(output);
};

main(process.argv.slice(2));