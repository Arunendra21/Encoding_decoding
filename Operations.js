document.getElementById('encodeButton').addEventListener('click', () => {
    const inputString = document.getElementById('inputString').value;
    const baseScheme = document.getElementById('baseSelect').value;

    let encodedResult, steps;

    if (baseScheme === 'base32') {
        ({ encodedResult, steps } = base32Encode(inputString));
    } else if (baseScheme === 'base64') {
        ({ encodedResult, steps } = base64Encode(inputString));
    } else if (baseScheme === 'base85') {
        ({ encodedResult, steps } = base85Encode(inputString));
    }

    displayResult(encodedResult, steps);
    document.getElementById('decodeButton').style.display = 'inline-block';
});

document.getElementById('decodeButton').addEventListener('click', () => {
    const encodedString = document.getElementById('result').innerText;
    const baseScheme = document.getElementById('baseSelect').value;

    let decodedResult, steps;

    if (baseScheme === 'base32') {
        ({ decodedResult, steps } = base32Decode(encodedString));
    } else if (baseScheme === 'base64') {
        ({ decodedResult, steps } = base64Decode(encodedString));
    } else if (baseScheme === 'base85') {
        ({ decodedResult, steps } = base85Decode(encodedString));
    }

    displayResult(decodedResult, steps);
});

function displayResult(result, steps) {
    document.getElementById('result').innerText = result;

    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = ''; // Clear previous steps

    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.classList.add('step');
        stepElement.style.animationDelay = `${index * 0.5}s`;
        stepElement.innerText = step;
        stepsContainer.appendChild(stepElement);
    });
}

// Helper Functions
function stringToBinary(str) {
    return str.split('')
              .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
              .join('');
}

function binaryToString(binary) {
    let chars = [];
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.slice(i, i + 8);
        const char = binaryToDecimal(byte);
        chars.push(String.fromCharCode(char));
    }
    return chars.join('');
}

function binaryToDecimal(bin) {
    let decimal = 0;
    for (let i = 0; i < bin.length; i++) {
        decimal = decimal * 2 + (bin[i] === '1' ? 1 : 0);
    }
    return decimal;
}

function decimalToBinary(dec, bits) {
    let binary = '';
    for (let i = bits - 1; i >= 0; i--) {
        binary += dec >= Math.pow(2, i) ? '1' : '0';
        if (dec >= Math.pow(2, i)) dec -= Math.pow(2, i);
    }
    return binary;
}

// Base32 Encoding
function base32Encode(str) {
    let encodedResult = '';
    let steps = [];

    const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
   
    // Step 1: Convert string to binary
    const binaryString = stringToBinary(str);
    steps.push(`Step 1: Convert string to binary: ${binaryString}`);

    // Step 2: Pad binary string to make its length a multiple of 5
    const paddingLength = (5 - (binaryString.length % 5)) % 5;
    const paddedBinaryString = binaryString + '0'.repeat(paddingLength);
    steps.push(`Step 2: Pad binary string to multiple of 5: ${paddedBinaryString}`);

    // Step 3: Split binary into 5-bit chunks
    const binaryChunks = paddedBinaryString.match(/.{1,5}/g);
    steps.push(`Step 3: Split into 5-bit chunks: ${binaryChunks.join(' ')}`);

    // Step 4: Convert each 5-bit chunk to Base32 character
    binaryChunks.forEach((chunk, index) => {
        const decimal = binaryToDecimal(chunk);
        const base32Char = base32Alphabet[decimal];
        steps.push(`Step 4.${index + 1}: Convert ${chunk} to '${base32Char}'`);
        encodedResult += base32Char;
    });

    return { encodedResult, steps };
}

// Base32 Decoding
function base32Decode(encoded) {
    let decodedResult = '';
    let steps = [];

    const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
   
    // Step 1: Convert Base32 characters to binary
    let binaryString = '';
    encoded.split('').forEach((char, index) => {
        const decimal = base32Alphabet.indexOf(char.toUpperCase());
        const binary = decimalToBinary(decimal, 5);
        steps.push(`Step 1.${index + 1}: Convert '${char}' to binary: ${binary}`);
        binaryString += binary;
    });
    steps.push(`Step 1: Combined binary string: ${binaryString}`);

    // Step 2: Split binary string into 8-bit chunks
    const binaryChunks = binaryString.match(/.{1,8}/g) || [];
    steps.push(`Step 2: Split into 8-bit chunks: ${binaryChunks.join(' ')}`);

    // Step 3: Convert each 8-bit chunk to character
    binaryChunks.forEach((chunk, index) => {
        const decimal = binaryToDecimal(chunk);
        const char = String.fromCharCode(decimal);
        steps.push(`Step 3.${index + 1}: Convert ${chunk} to '${char}'`);
        decodedResult += char;
    });

    return { decodedResult, steps };
}

// Base64 Encoding
function base64Encode(str) {
    let encodedResult = '';
    let steps = [];

    const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
   
    // Step 1: Convert string to binary
    const binaryString = stringToBinary(str);
    steps.push(`Step 1: Convert string to binary: ${binaryString}`);

    // Step 2: Pad binary string to make its length a multiple of 6
    const paddingLength = (6 - (binaryString.length % 6)) % 6;
    const paddedBinaryString = binaryString + '0'.repeat(paddingLength);
    steps.push(`Step 2: Pad binary string to multiple of 6: ${paddedBinaryString}`);

    // Step 3: Split binary into 6-bit chunks
    const binaryChunks = paddedBinaryString.match(/.{1,6}/g);
    steps.push(`Step 3: Split into 6-bit chunks: ${binaryChunks.join(' ')}`);

    // Step 4: Convert each 6-bit chunk to Base64 character
    binaryChunks.forEach((chunk, index) => {
        const decimal = binaryToDecimal(chunk);
        const base64Char = base64Alphabet[decimal];
        steps.push(`Step 4.${index + 1}: Convert ${chunk} to '${base64Char}'`);
        encodedResult += base64Char;
    });

    // Step 5: Add padding characters '=' if necessary
    const paddingChars = (4 - (encodedResult.length % 4)) % 4;
    if (paddingChars > 0) {
        encodedResult += '='.repeat(paddingChars);
        steps.push(`Step 5: Add padding '=' characters: ${'='.repeat(paddingChars)}`);
    }

    return { encodedResult, steps };
}

// Base64 Decoding
function base64Decode(encoded) {
    let decodedResult = '';
    let steps = [];

    const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
   
    // Step 1: Remove padding characters
    const paddingCount = (encoded.match(/=/g) || []).length;
    const trimmedEncoded = encoded.replace(/=/g, '');
    if (paddingCount > 0) {
        steps.push(`Step 1: Remove padding '=' characters: ${trimmedEncoded}`);
    } else {
        steps.push(`Step 1: No padding characters to remove.`);
    }

    // Step 2: Convert Base64 characters to binary
    let binaryString = '';
    trimmedEncoded.split('').forEach((char, index) => {
        const decimal = base64Alphabet.indexOf(char);
        const binary = decimalToBinary(decimal, 6);
        steps.push(`Step 2.${index + 1}: Convert '${char}' to binary: ${binary}`);
        binaryString += binary;
    });
    steps.push(`Step 2: Combined binary string: ${binaryString}`);

    // Step 3: Remove padding bits
    const totalBits = binaryString.length;
    const paddingBits = paddingCount * 2;
    if (paddingBits > 0) {
        binaryString = binaryString.slice(0, totalBits - paddingBits);
        steps.push(`Step 3: Remove padding bits: ${binaryString}`);
    }

    // Step 4: Split binary string into 8-bit chunks
    const binaryChunks = binaryString.match(/.{1,8}/g) || [];
    steps.push(`Step 4: Split into 8-bit chunks: ${binaryChunks.join(' ')}`);

    // Step 5: Convert each 8-bit chunk to character
    binaryChunks.forEach((chunk, index) => {
        const decimal = binaryToDecimal(chunk);
        const char = String.fromCharCode(decimal);
        steps.push(`Step 5.${index + 1}: Convert ${chunk} to '${char}'`);
        decodedResult += char;
    });

    return { decodedResult, steps };
}

// Base85 Encoding (ASCII85)
function base85Encode(str) {
    let encodedResult = '';
    let steps = [];

    const base85Alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';
   
    // Step 1: Convert string to binary
    const binaryString = stringToBinary(str);
    steps.push(`Step 1: Convert string to binary: ${binaryString}`);

    // Step 2: Pad binary string to make its length a multiple of 32 bits (4 bytes)
    const paddingLength = (32 - (binaryString.length % 32)) % 32;
    const paddedBinaryString = binaryString + '0'.repeat(paddingLength);
    steps.push(`Step 2: Pad binary string to multiple of 32 bits: ${paddedBinaryString}`);

    // Step 3: Split binary into 32-bit (4-byte) chunks
    const binaryChunks = paddedBinaryString.match(/.{1,32}/g);
    steps.push(`Step 3: Split into 32-bit chunks: ${binaryChunks.join(' ')}`);

    // Step 4: Convert each 32-bit chunk to a decimal number
    binaryChunks.forEach((chunk, index) => {
        const decimal = binaryToDecimal(chunk);
        steps.push(`Step 4.${index + 1}: Convert ${chunk} to decimal: ${decimal}`);
       
        // Step 5: Convert decimal to Base85
        let base85Chunk = '';
        let tempDecimal = decimal;
        for (let i = 0; i < 5; i++) {
            const remainder = tempDecimal % 85;
            base85Chunk = base85Alphabet[remainder] + base85Chunk;
            tempDecimal = Math.floor(tempDecimal / 85);
        }
        steps.push(`Step 5.${index + 1}: Convert ${decimal} to Base85: ${base85Chunk}`);
        encodedResult += base85Chunk;
    });

    // Step 6: Add terminating sequence '~>'
    encodedResult += '~>';
    steps.push(`Step 6: Add terminating sequence '~>': ${encodedResult}`);

    return { encodedResult, steps };
}

// Base85 Decoding (ASCII85)
function base85Decode(encoded) {
    let decodedResult = '';
    let steps = [];

    const base85Alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';
   
    // Step 1: Remove terminating sequence '~>'
    let trimmedEncoded = encoded.endsWith('~>') ? encoded.slice(0, -2) : encoded;
    if (trimmedEncoded !== encoded) {
        steps.push(`Step 1: Remove terminating sequence '~>': ${trimmedEncoded}`);
    } else {
        steps.push(`Step 1: No terminating sequence to remove.`);
    }

    // Step 2: Pad the encoded string to make its length a multiple of 5
    const paddingLength = (5 - (trimmedEncoded.length % 5)) % 5;
    trimmedEncoded += 'u'.repeat(paddingLength); // 'u' maps to highest Base85 value
    steps.push(`Step 2: Pad encoded string to multiple of 5: ${trimmedEncoded}`);

    // Step 3: Split encoded string into 5-character chunks
    const encodedChunks = trimmedEncoded.match(/.{1,5}/g);
    steps.push(`Step 3: Split into 5-character chunks: ${encodedChunks.join(' ')}`);

    // Step 4: Convert each 5-character chunk to a 32-bit binary string
    let binaryString = '';
    encodedChunks.forEach((chunk, index) => {
        let decimal = 0;
        chunk.split('').forEach((char, i) => {
            const value = base85Alphabet.indexOf(char);
            if (value === -1) {
                throw new Error(`Invalid Base85 character: ${char}`);
            }
            decimal = decimal * 85 + value;
            steps.push(`Step 4.${index + 1}.${i + 1}: Convert '${char}' to ${value}, cumulative decimal: ${decimal}`);
        });
        const binary = decimalToBinary(decimal, 32);
        steps.push(`Step 4.${index + 1}: Convert decimal ${decimal} to binary: ${binary}`);
        binaryString += binary;
    });

    // Step 5: Remove padding bits
    if (paddingLength > 0) {
        binaryString = binaryString.slice(0, binaryString.length - paddingLength * 8 / 5);
        steps.push(`Step 5: Remove padding bits: ${binaryString}`);
    }

    // Step 6: Split binary string into 8-bit chunks
    const binaryChunks = binaryString.match(/.{1,8}/g) || [];
    steps.push(`Step 6: Split into 8-bit chunks: ${binaryChunks.join(' ')}`);

    // Step 7: Convert each 8-bit chunk to character
    binaryChunks.forEach((chunk, index) => {
        const decimal = binaryToDecimal(chunk);
        const char = String.fromCharCode(decimal);
        steps.push(`Step 7.${index + 1}: Convert ${chunk} to '${char}'`);
        decodedResult += char;
    });

    return { decodedResult, steps };
}