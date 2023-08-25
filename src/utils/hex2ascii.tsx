export const hex2ascii = (hex: any) => {
    if (!(typeof hex === 'number' || typeof hex == 'string')) {
        return ''
    }

    hex = hex.toString().replace(/\s+/gi, '')
    const stack = []

    for (let i = 0; i < hex.length; i += 2) {
        const code = parseInt(hex!.substr(i, 2), 16)
        if (!isNaN(code) && code !== 0) {
            stack.push(String.fromCharCode(code))
        }
    }
    return stack.join('')
};
