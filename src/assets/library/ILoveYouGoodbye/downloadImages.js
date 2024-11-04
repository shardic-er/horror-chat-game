// downloadImages.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const tsxFilePath = path.join(__dirname, 'ILoveYouGoodbye.tsx');

(async () => {
    try {
        console.log(`Reading TSX file from: ${tsxFilePath}`);
        const tsxContent = fs.readFileSync(tsxFilePath, 'utf-8');

        // Parse the TSX file into an AST
        const ast = parser.parse(tsxContent, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
        });

        const imageImports = {};
        const pages = [];

        // Traverse the AST to extract image imports and pages
        traverse(ast, {
            ImportDeclaration(path) {
                const importSource = path.node.source.value;
                path.node.specifiers.forEach((specifier) => {
                    if (specifier.type === 'ImportDefaultSpecifier') {
                        const varName = specifier.local.name;
                        imageImports[varName] = importSource;
                        console.log(`Found image import: ${varName} from ${importSource}`);
                    }
                });
            },
            ObjectProperty(path) {
                if (path.node.key.name === 'pages') {
                    const pagesArray = path.node.value.elements;
                    pagesArray.forEach((pageNode) => {
                        const page = {};
                        pageNode.properties.forEach((prop) => {
                            if (prop.key.name === 'text') {
                                if (prop.value.type === 'TemplateLiteral') {
                                    page.text = prop.value.quasis.map((elem) => elem.value.cooked).join('');
                                } else {
                                    page.text = prop.value.value;
                                }
                            } else if (prop.key.name === 'image') {
                                page.srcVar = prop.value.properties.find((p) => p.key.name === 'src').value.name;
                            } else if (prop.key.name === 'prompt') {
                                page.promptUrl = prop.value.value;
                            }
                        });
                        pages.push(page);
                    });
                }
            },
        });

        if (pages.length === 0) {
            console.error('No pages were found in the TSX file.');
            return;
        }

        // Process each page
        for (const page of pages) {
            const { srcVar, promptUrl } = page;
            const imageFileName = imageImports[srcVar];

            if (!imageFileName) {
                console.error(`Image file name for variable ${srcVar} not found.`);
                continue;
            }

            // Get the image file path from the import path
            const imageFilePath = path.join(__dirname, imageFileName);

            // Download the image
            console.log(`Downloading image for ${srcVar} from ${promptUrl}`);
            const response = await axios.get(promptUrl, { responseType: 'stream' });
            const writer = fs.createWriteStream(imageFilePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`Image saved to ${imageFilePath}`);
        }

        console.log('All images have been downloaded.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
