const {VM} = require('vm2');

const vm = new VM({
    console: 'redirect',
    timeout: 1000,
    allowAsync: false,
    sandbox: {},

});

let number = vm.run('console.log(1323)'); // returns 1337

console.log(number)
