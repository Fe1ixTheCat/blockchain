const { SHA3 } = require("sha3");
const hashing = new SHA3(256);

let random1 = Math.random();
let random2 = Math.random();
let time = new Date().getTime();

hashing.reset();
hashing.update(JSON.stringify(random1,random2,time));
let privateKey = hashing.digest("hex");
hashing.reset();
hashing.update(privateKey);
let publicKey = hashing.digest("hex");
console.log("new wallet was generate:");
console.log(`private key: ${privateKey}`);
console.log(`public key: ${publicKey}`);
