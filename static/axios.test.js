const axios = require('axios');
const microServices = require('../config.json').microServices


const AvailableLanguages = {
    JavaScript: "JavaScript",
    Python: "Python",
    Cpp: "C++"
}



function test(language) {

    let endPoint;
    switch (language) {
        case AvailableLanguages.Cpp:
            // TODO melikşah'ın url'i ve portu eklenmesi lazım
            endPoint = `http://${microServices.Cpp.url}:${microServices.Cpp.port}`;
            break
        case AvailableLanguages.JavaScript:
            // must need body
            endPoint = `http://${microServices.Javascript.url}:${microServices.Javascript.port}/code-statistics`;
            break
        case AvailableLanguages.Python:
            endPoint = `http://${microServices.Pyhton.url}:${microServices.Pyhton.port}/code-statistics`;
            break
    }

    console.log("endPoint",endPoint);

    const body = {
        "code": "ZnVuY3Rpb24gcXVlc3Rpb24odGVzdF9jYXNlKSB7CiAgbGV0IHRvcGxhbSA9IDA7ICAKICBmb3IgKGxldCBpID0gMDsgaSA8IHRlc3RfY2FzZS5sZW5ndGg7IGkrKykgewogICAgdG9wbGFtICs9IHRlc3RfY2FzZVtpXTsKICB9CiAgcmV0dXJuIHRvcGxhYW07Cn0=",
        "test_cases": [[12,13,25],[1,2,3,4,5,6,7,8,9,10,11,12],[]],
        "expected_results": [50,78,0]
    }

    axios.post(endPoint,body).then( response => {
        console.log("*******************")
       // console.log("Axios Response",response)
        console.log("*******************")
        console.log("response.data",response.data)
        console.log("*******************")
    }).catch( error => {
        console.log("*******************")
        console.log("Axios Error",error)
        console.log("*******************")
        console.log("Axios Error Message",error.message)
        console.log("*******************")
    })

}

test(AvailableLanguages.Python);