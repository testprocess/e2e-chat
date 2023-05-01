import crypto from 'crypto';

const rsaService = {
    generateKey: async function () {
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'pkcs1',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs1',
              format: 'pem'
            }
        });

        return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey }
    }
}

export { rsaService }