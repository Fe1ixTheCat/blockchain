const blockchain = require("./blockchain");
const readline = require("readline");
const { SHA3 } = require("sha3");
const hashing = new SHA3(256);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function balance() {
  rl.question("Enter your private key: ", function(key) {
    hashing.reset();
    hashing.update(key);
    let publicKey = hashing.digest("hex");
    const wallet = {
      hash: publicKey,
      balance: 0
    }
    for (let i = 0; i < blockchain.length; i++) {
      for (let j = 0; j < blockchain[i].body.transactions.length; j++) {
        if (publicKey == blockchain[i].body.transactions[j].body.from) {
          wallet.balance -= blockchain[i].body.transactions[j].body.sum;
        } else if (publicKey == blockchain[i].body.transactions[j].body.to) {
          wallet.balance += Number(blockchain[i].body.transactions[j].body.sum);
        }

      }
    }
    console.log(`hash: ${wallet.hash} | balance: ${wallet.balance} coins`);
    process.exit(0);
    rl.close();
    // rl.question("Return to main menu? y/n ", function(a) {
    //   process.exit(0);
    //   if (a == 'y') {
    //     returnMenu();
    //     // rl.close();
    //     // process.exit(0);
    //   } else {
    //     balance()
    //   }
    // })
  })
}

function returnMenu() {
  return require('./main.js');
}

balance();
