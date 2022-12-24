
function setJWT(jwt){ //sets jwt token
    localStorage.setItem('jwt', jwt);
}
function getJWT(){ //returns jwt token
    return localStorage.getItem('jwt');
}


function addAuthHeader(request) //adds authorization header to given request
{
    request.headers.append("\"Authorization\": \"Bearer "+ getJWT() +"\" ");
}