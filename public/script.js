window.onload = function(){
    $(".ui.dropdown").dropdown();
    $('.ui.checkbox').checkbox();
}
$('.message .close').on('click', function(){
  $(this).closest('.message').transition('fade');
})
setInterval(function(){
  $('i.bell').transition('shake');
}, 10000);
setInterval(function(){
  $('.tagline').transition('flash');
}, 600000);

function showForm(){
  document.getElementById("receiver").classList.toggle("display");
}
function submitForm(){
  document.getElementById("receiver").submit();
  $(this).closest('input').value ='';
}
//===================================================================================
window.document.addEventListener('DOMContentLoaded', savedAddress);

function savedAddress(){
  let addressStorage;
  if(localStorage.getItem('address') === null){
    console.log("You have not registered as a resident/officer.")
  }else{
    addressStorage = JSON.parse(localStorage.getItem("address"));
    addressStorage.forEach(function(Home) {
      document.getElementById("home").value = Home; 
});
}
}

function officer(){
  let addressVal = officerAdd();
  if(localStorage.getItem('address') === null){
    address = [];
    address.push(addressVal);
    localStorage.setItem("address", JSON.stringify(address));
  }else{
    console.log("Your browser already has an address in memory.")
  }

}
function officerAdd(){
  return document.getElementById("officerAddress").value; 
}


function saveInfo(){
  let addressValue = value();
  if(localStorage.getItem('address') === null){
    address = [];
    address.push(addressValue);
    localStorage.setItem("address", JSON.stringify(address));
  }else{
    console.log("Your browser already has an address in memory.")
  }

}
function value(){
  return document.getElementById("add").value;
  
}

//====================================================================================================
$(document).ready(function(){
    $('.ui.form').form({
            fields: {
            username: {
                identifier: 'username',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your full name'
                  },
                  {
                      type: 'regExp[/^[a-zA-Z ]*$/]',
                      prompt: 'Your full name cannot contain special characters or numbers'
                  }
                ]
              },
              email: {
                identifier: 'email',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your email address'
                  }
                ]
              },
              phone: {
                identifier: 'phone',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your phone number'
                  }
                ]
              },
              
              city: {
                identifier: 'city',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your LGA'
                  },
                  {
                    type: 'regExp[/^[a-zA-Z ]*$/]',
                    prompt: 'Your LGA should contain aphalbets only'
                }
                ]
              },
              state: {
                identifier: 'state',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please choose your state from the dropdown.'
                  }
                ]
              },
              password: {
                identifier: 'password',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter a password'
                  },
                  {
                    type   : 'minLength[6]',
                    prompt : 'Your password must be at least {ruleValue} characters'
                  }
                ]
              },
              accessKey: {
                identifier: 'key',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter the access key'
                  }
                ]
              },
              access_code: {
                identifier: 'access_code',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your street\'s/estate\'s access code'
                  }
                ]
              },
              resident: {
                identifier: 'address',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter your residential address.'
                  }
                ]
              },
            
              terms: {
                identifier: 'terms',
                rules: [
                  {
                    type   : 'checked',
                    prompt : 'You must agree to the terms and conditions'
                  }
                ]
              }
            }
          });
        
      });
  


