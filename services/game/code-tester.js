const {NodeVM, VMScript} = require('vm2');




const vm = new NodeVM({
    console: 'redirect', // this redirects console.logs to events;
    timeout: 1000, //VM will time out after this amount of time (not sure if seconds or milli seconds);
    allowAsync: false,
    sandbox: {}, // we can specify whitelisted libraries here;
});


//TODO: Replace test case with a question from the database;
//a basic test case
let input, expectedOutput;
input = [];
input.push([2,1]);
input.push([3,1]);
input.push([5,6]);
expectedOutput = [3,4,11];
//test case declaration ends;



//TODO: Create an endpoint to receive user-sent scripts
//TODO: Replace hardcoded script with user-sent script;
//TODO: Add error handling;
//let mainFunction = vm.run('module.exports = function (input){return input[0]+input[1];}') // this later will be replaced by code received from the user


function TestProgram(testCases, expectedOutputs, script){ //This piece will run the code with each test case AND return executionTime with the test result;
    let compiledScript;
    try {
        compiledScript = new VMScript(script).compile();
    } catch (err) {
        console.log(err);
        let result;
        return {err, result};
    }

    let mainFunction = vm.run(script)
    let results = [];
    let err;
    console.log('Test Cases: ' + testCases);
    console.log('Expected Results: ' + expectedOutputs)

    //TODO: Run each test multiple times to get more consistent result;
    testCases.forEach((element , index)=> {    //run for each test case;
        let executionTime = process.hrtime(); //get a start time;
        let resultString = `Test ${index}: `;
        if(expectedOutputs[index] ===mainFunction(element)){
            resultString += "Passed";
        }else {
            resultString += "Failed";
        }
        executionTime = process.hrtime(executionTime) //get end time which is a 2 element array a[0] seconds part, a[1] nanoseconds part;
        results.push([resultString, FormatExecutionTime(executionTime)]);//push the results to array;
    });
    return {err, results};
}


function FormatExecutionTime(executionTime){  //converts second and nanosecond parts to milliseconds;
    const nanoSecToMiliSeconds = 1e6;
    const secondsToMilliSeconds = 1e3;
    return executionTime[0]*secondsToMilliSeconds + executionTime[1]/nanoSecToMiliSeconds

}


//console.log(TestProgram(input,expectedOutput));


vm.on('console.log' ,(value => { //console output on the sandbox redirects to here;
    console.log(value);
}));




module.exports.testProgram = TestProgram;
//vm.run('console.log(1323)'); // returns 1337

//todo add eslint





