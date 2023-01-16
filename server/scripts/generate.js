const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

// private key
const privateKey = secp.utils.randomPrivateKey();

// get pubicKey
const publicKey = secp.getPublicKey(privateKey);

const addressHash = keccak256(publicKey.slice(1));

const address = addressHash.slice(addressHash.length - 20);

console.log("private key", toHex(privateKey));
console.log("**************************");
console.log("address", toHex(address));
console.log("**************************");
console.log("public key", toHex(publicKey));
