/*
* Sonetel Callback API JavaScript Client
* 
* Version 0.1
* Author: Aashish Joshi (aashish@sonetel.com)
* Last Updated: 21 January 2022
* 
*/

console.log('load success')

/*
* If the access_token is available:
* - do not show the login form.
* - show the callback form.
*/ 

if(window.sessionStorage.getItem('access_token')){
    console.log('access token available');
    document.getElementById('sign-in-status').innerHTML = '<i class="w3-green fa fa-check" aria-hidden="true"></i>';
    document.getElementById('loginForm').reset();
    document.getElementById('signin').style.display = 'none';
    document.getElementById('callback').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'block';
}else{
    console.log('access token not available');
    document.getElementById('sign-in-status').innerHTML = '<i class="w3-red fa fa-times" aria-hidden="true"></i>';
    document.getElementById('callback').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'none';
}

async function getSonetelToken(){
    /*
    * 
    * Get an access token from the Sonetel API
    * 
    * Documentation: https://docs.sonetel.com/docs/sonetel-documentation/b3A6MTUxMzg1OTc-create-token
    * 
    */
    
    console.log('get token');
    
    myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic c29uZXRlbC13ZWI6c29uZXRlbC13ZWI=');
    url = "https://api.sonetel.com/SonetelAuth/beta/oauth/token"
    
    const response = await fetch(url,{
        method: "post",
        headers: myHeaders,
        body: new FormData(document.getElementById("loginForm"))

    });

    if(response.ok){
        return response.json();
    }else{
        const message = `${response.status}`;
        throw new Error(message);
    }
}

function login(){
    // Call the Sonetel API to get an access token to authenticate the callback call.

    console.log('login');
    
    getSonetelToken()
    .then(data => {

        window.sessionStorage.setItem('access_token',data['access_token']);
        document.getElementById('sign-in-status').innerHTML = '<i class="w3-green fa fa-check" aria-hidden="true"></i>';
        document.getElementById('loginForm').reset();
        document.getElementById('signin').style.display = 'none';
        document.getElementById('callback').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
    
    }).catch(err => alert('Login Failed!\n' + err));
    
    return false;
}


function logout(){
    
    /*
    * Remove the access_token from the session storage and reset the forms on the page
    */

    if (window.confirm("Do you want to logout?")){
        window.sessionStorage.removeItem('access_token');
        document.getElementById('loginForm').reset();
        document.getElementById('signin').style.display = 'block';
        document.getElementById('callback').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('sign-in-status').innerHTML = '<i class="w3-red fa fa-times" aria-hidden="true"></i>';
    }
    return false;
    
}

function makeCall(){

    /*
    * Use the Sonetel callback API to make calls between two phone numbers.
    * 
    * Documentation: https://docs.sonetel.com/docs/sonetel-documentation/b3A6MTU5MzM5MjM-start-a-callback-call
    *
    * */

    callbackApiUrl = 'https://beta-api.sonetel.com/make-calls/call/call-back';

    // Get the form data
    formData = new FormData(document.getElementById('callbackForm'));
    if(formData.has('number1') && formData.has('number2')){
        number1 = formData.get('number1');  // The first number that will be called i.e. your phone number
        number2 = formData.get('number2');  // The second number that will be called i.e. the called party's number
    }else{
        // If number 1 or number 2 are not defined, thow an error
        const message = 'Either Number 1 or Number 2 is not defined!!';
        alert(message);
        return false;
    }   

    // set the headers for the POST request
    reqHeaders = new Headers();
    reqHeaders.append("Content-Type", "application/json;charset=UTF-8");
    reqHeaders.append("Authorization", "Bearer " + window.sessionStorage.getItem('access_token'));

    // set the data for the request.
    const callData = {
        "app_id" : "myUniqueCallbackApp_v0.1",
        "call1" : number1,
        "call2" : number2,
        "show_1" : "automatic",
        "show_2" : number1
    };

    fetch(callbackApiUrl,{
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(callData)
    })
    // Handle success response
    .then(response => response.json())
    // Show the user a success message
    .then(
        json => {
            console.log(json['statusCode']);
            console.log(json['response']['session_id']);
            if(json['statusCode'] == 202){
                alert("The call is being connected...");
            }
        })
    // Handle errors
    .catch(err => console.log('Request Failed', err));

    return false;

}


function toggleDisplay(id){
    // toggle the how to use tips
    elem = document.getElementById(id);
    if (elem.className.indexOf("w3-show") == -1){
        elem.className += " w3-show";
    }else{
        elem.className = elem.className.replace(" w3-show", "");
    }
}