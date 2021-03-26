/**
 * This module will generate a public and private keypair and save to current directory
 * 
**/
const crypto = require('crypto');
//The crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.

const fs = require('fs');

// using the crypto library to generate the key pairs

// run (node + filename) on console to generate the two keys

function genKeyPair() {
    
    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`

    // rsa algorithm
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1" 
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        }
    });

    // Create the public key file
    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey); 
    
    // Create the private key file
    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);

}

// Generate the keypair
genKeyPair();