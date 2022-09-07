const { SHA3 } = require("sha3");
const hashing = new SHA3(256);
const fs = require("fs");
const os = require('os');

const blockchain = require("./blockchain.json");

const checking = (blockchain) => {
  const checkList = [];
  for (let i = 0; i < blockchain.length; i++) {
    checkList.push(blockchain[i]);
    if (blockchain[i + 1]) {
      hashing.reset();
      hashing.update(JSON.stringify(checkList) + blockchain[i + 1].head.nonce);
      hashed = hashing.digest("hex");
      if (hashed == blockchain[i + 1].head.hash) {
      } else {
        throw new Error('Error, blockchain is wrong!');
      }
    }
  }
  let cpu = os.cpus();
  console.log(`CPU: ${cpu[0].model} | cores(threads): ${cpu.length} | speed: ${cpu[0].speed} MHz`);
  console.log('hash checked, working...');
}

return checking(blockchain);
