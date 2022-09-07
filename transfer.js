const list = require('./transactions.json');
const fileName = "./transactions.json";
const readline = require("readline");
const { SHA3 } = require("sha3");
const hashing = new SHA3(256);
const fs = require("fs");
const blockchain = require("./blockchain");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkWallet(wallet, sum) {
  var balance = 0;
  for (let i = 0; i < blockchain.length; i++) {
    for (let j = 0; j < blockchain[i].body.transactions.length; j++) {
      if (blockchain[i].body.transactions[j].body.to == wallet) {
        balance = balance + Number(blockchain[i].body.transactions[j].body.sum);
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].body.from == wallet) {
      balance = balance - Number(list[i].body.sum);
    }
  }
  if (sum <= balance) {
    return true
  } else {
    return false
  }
}

function generateTransaction(from, to, sum) {
  let transaction = {
    head: {
      type: "transfer",
      timestamp: new Date().getTime()
    },
    body: {
      from: from,
      to: to,
      sum: sum
    }
  }
  list.push(transaction);
  fs.writeFile(
    fileName,
    JSON.stringify(list, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
  console.log(`complete transfed ${sum} coins from ${from} to ${to}`);
}

const newTransfer = () => {
  rl.question("Enter your wallet secret code: ", function(walletFrom) {
    hashing.reset();
    hashing.update(walletFrom);
    const publicWalletFrom = hashing.digest("hex");
      rl.question("Enter wallet hash for transfer: ", function(walletTo) {
        rl.question("Enter sum of coins: ", function(sum) {
          if (checkWallet(publicWalletFrom, sum)) {

            generateTransaction(publicWalletFrom, walletTo, sum);

            rl.question('Do you want to new transfer? y/n: ', function(last) {
              if (last == 'y') {
                return newTransfer();
              } else {
                rl.on("close", function() {
                    process.exit(0);
                    rl.close();
                });
              }
              rl.close();
            })
          } else {
            console.log("input invalid | transaction was canceled");
            rl.question('Do you want to new transfer? y/n: ', function(last) {
              if (last == 'y') {
                return newTransfer();
              } else {
                rl.on("close", function() {
                    process.exit(0);
                    rl.close();
                });
              }
              rl.close();
            })
          }
        });
      });
  });
}

return newTransfer();
