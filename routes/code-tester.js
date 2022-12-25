const {NodeVM} = require('vm2');

const vm = new NodeVM({
    console: 'redirect',
    timeout: 1000,
    allowAsync: false,
    sandbox: {},

});

let number = vm.run('console.log(1323)'); // returns 1337
//todo add console.log and console.read overrides
//todo add eslint
//todo
vm.on('console.log', (data)=>{
    console.log("output",data)
});

vm.on()

vm.run('console.log("hello "+ "who");');



