// Sha3 - это модуль для хеширования документов
const { SHA3 } = require("sha3");
const hashing = new SHA3(256);
const fs = require("fs");
const fileName = "./blockchain.json";
const transactions = require('./transactions.json');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your secret key for reward: ', function(key) {
  if (key) {
    hashing.reset();
    hashing.update(key);
    let wallet = hashing.digest("hex");
    // console.log(wallet);
    mining(wallet);
  } else {
    console.log('invalid value');
  }
  rl.close();
})

// Мы начинаем наш nonce с 0
let nonce = 0;
// Сложность блокчейна. Чем больше вы добавите 0, тем сложнее будет добывать блок
const difficulty = "0000";
// Переключатель, чтобы завершить цикл while
let notFounded = true;
// Функция, используемая для обновления вашей цепочки блоков
const genesisBlockchain = (hash, prevHash, timestamp, difficulty, nonce, transactions) => {
  let blockchain = require(fileName);
  // Создаем новый Блок
  const addBlock = {
    head: {
      id: 0,
      hash: hash,
      prevHash: prevHash,
      timestamp: timestamp,
      difficulty: difficulty,
      nonce: nonce
    },
    body: {
      transactions: transactions
    }
  };
  // Добавляем в блокчейн
  blockchain.push(addBlock);
  fs.writeFile(
    fileName,
    JSON.stringify(blockchain, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
};
const updateBlockchain = (id, hash, prevHash, timestamp, difficulty, nonce, transactions) => {
  let blockchain = require(fileName);
  // Создаем новый Блок
  const addBlock = {
    head: {
      id: 0,
      hash: hash,
      prevHash: prevHash,
      timestamp: timestamp,
      difficulty: difficulty,
      nonce: nonce
    },
    body: {
      transactions: transactions
    }
  };
  // Добавляем в блокчейн
  blockchain.push(addBlock);
  fs.writeFile(
    fileName,
    JSON.stringify(blockchain, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
};

// Функция майнинга блока
const mining = (wallet) => {
  var start = new Date().getTime();
  // Импортируем блокчейн
  const blockchain = require(fileName);
  if (blockchain.length == 0) {
    while (notFounded) {
      // Нам нужно сбрасывать наш хеш в каждом цикле
      hashing.reset();
      // Мы хэшируем новые данные (блок + одноразовый номер)
      hashing.update(JSON.stringify(blockchain) + nonce);
      let hashed = hashing.digest("hex");
      // ЕСЛИ новые хешированные данные начинаются с «000»
      if (hashed.startsWith(difficulty)) {
        var diff = (new Date().getTime() - start) / 1000;
        // Выключаем переключатель, чтобы завершить цикл while
        notFounded = false;
        console.log("//// FOUNDED ! ////");
        console.log(`Hash : ${hashed}`);
        console.log(`Nonce : ${nonce}`);
        console.log(`Difficulty : ${difficulty}`);
        console.log(`Total time : ${diff}s`);
        // Выполняем updateBlockchain
        transactions.push({
          head: {
            type: "miner",
            timestamp: new Date().getTime()
          },
          body: {
            from: "blockchain",
            to: wallet,
            sum: "10"
          }
        })
        genesisBlockchain(hashed, 0, Date.now(), difficulty, nonce, transactions);
        fs.writeFile(
          './transactions.json',
          JSON.stringify([], null, 2),
          function writeJSON(err) {
            if (err) return console.log(err);
          }
        );
      } else {
        // ПОЖАЛУЙСТА, ОБРАТИТЕ ВНИМАНИЕ: если вы хотите, чтобы процесс майнинга был быстрее, удалите или закомментируйте следующий console.log ()
        // console.log(hashed);
        // Мы увеличиваем значение nonce и снова запускаем цикл
        nonce++;
      }
    }
  } else {
    console.log(`blockchain ready: ${new Date().getTime() - 60000 > blockchain[blockchain.length - 1].head.timestamp}`);
    function startBlock() {
      if (new Date().getTime() - 60000 > blockchain[blockchain.length - 1].head.timestamp) {
        console.log(`blockchain ready: ${new Date().getTime() - 60000 > blockchain[blockchain.length - 1].head.timestamp}`);
        while (notFounded) {
          let check = require("./check.js");
          // Нам нужно сбрасывать наш хеш в каждом цикле
          hashing.reset();
          // Мы хэшируем новые данные (блок + одноразовый номер)
          hashing.update(JSON.stringify(blockchain) + nonce);
          let hashed = hashing.digest("hex");
          // ЕСЛИ новые хешированные данные начинаются с «000»
          if (hashed.startsWith(difficulty)) {
            var diff = (new Date().getTime() - start) / 1000;
            // Выключаем переключатель, чтобы завершить цикл while
            notFounded = false;
            console.log("//// FOUNDED ! ////");
            console.log(`Hash : ${hashed}`);
            console.log(`Nonce : ${nonce}`);
            console.log(`Total time : ${diff}s`);
            // Выполняем updateBlockchain
            transactions.push({
              head: {
                type: "miner",
                timestamp: new Date().getTime()
              },
              body: {
                from: "blockchain",
                to: wallet,
                sum: "10"
              }
            })
            updateBlockchain(blockchain.length, hashed, blockchain[blockchain.length - 1].head.hash, Date.now(), difficulty, nonce, transactions);
            fs.writeFile(
              './transactions.json',
              JSON.stringify([], null, 2),
              function writeJSON(err) {
                if (err) return console.log(err);
              }
            );
          } else {
            // ПОЖАЛУЙСТА, ОБРАТИТЕ ВНИМАНИЕ: если вы хотите, чтобы процесс майнинга был быстрее, удалите или закомментируйте следующий console.log ()
            // console.log(hashed);
            // Мы увеличиваем значение nonce и снова запускаем цикл
            nonce++;
          }
        }
      }
      else {
        console.log('fixing...');
        setTimeout(() => {
          startBlock();
        }, 1000)
      }
    }
    startBlock();
  }
};

// Запускаем майнинг
