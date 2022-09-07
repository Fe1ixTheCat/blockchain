const readline = require("readline");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu() {
  console.log('---------MAIN MENU----------');
  console.log('1) start miner');
  console.log('2) new transfer');
  console.log('3) check balance');
  console.log('4) register new wallet');
  console.log('-----------------------------');
  rl.question("Enter answer: ", function(key) {
    switch (Number(key)) {
      case 1:
        console.log(1);
        rl.close();
        return require('./app.js');
        break;
      case 2:
        console.log(2);
        rl.close();
        return require('./transfer.js');
        break;
      case 3:
        console.log('check balance');
        rl.close();
        return require('./balance.js');
        break;
      case 4:
        return require('./register.js');
      default:
        console.log('invalid value');
        mainMenu();
    }
  })
}

mainMenu();
