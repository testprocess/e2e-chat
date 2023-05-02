
const rsaUtil = {
    encrypt: async ({ publicKey, message }) => {
        let encrypt = new JSEncrypt()
        encrypt.setPublicKey(publicKey)
        const encrypted = encrypt.encrypt(message);

        console.log("encryptRsa", encrypted, publicKey, message)

        return encrypted
    },
    
    decrypt: async ({ privateKey, encrypted }) => {
        let decrypt = new JSEncrypt()
        decrypt.setPrivateKey(privateKey)
        const undecrypt = decrypt.decrypt(encrypted);

        return undecrypt
    }
}

export { rsaUtil }