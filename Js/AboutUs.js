
var namee;
var email;
var suggestion;
function CheckMediaQuerry(){
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    $("#notif").remove();
    if(mediaQuery.matches){
        
        namee = document.getElementById('user-nameS')
        email = document.getElementById('user-emailS')
        suggestion = document.getElementById('user-suggestionS')
    }
    else{
        namee = document.getElementById('user-name')
        email = document.getElementById('user-email')
        suggestion = document.getElementById('user-suggestion')
    }
}
function SendSuggestion(){
    $("#notif").remove();
    CheckMediaQuerry();
    if(namee.value == ''){
        namee.style.borderColor = 'red';
        email.style.borderColor = '';
    }
    else if(namee.value != '' && namee.value.length <= 4){
        namee.style.borderColor = 'red';
        email.style.borderColor = '';
    }
    else if(email.value == ''){
        email.style.borderColor = 'red';
        namee.style.borderColor = '';
    }
    else if(suggestion.value.length <= 10){
        suggestion.style.borderColor = 'red';
        namee.style.borderColor = '';
        email.style.borderColor = '';
    }
    else{
        suggestion.style.borderColor = '';
        namee.style.borderColor = '';
        email.style.borderColor = '';
        var Message={
            name: namee.value,
            email: email.value,
            message: suggestion.value.trim(),
        }

        $.ajax({
            url: 'https://localhost:44322/api/Suggestion/AddSuggestion',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(Message),
            success: function (data) {
                document.getElementById('body').innerHTML += '<div id="notif" class="succeded-notification"><p>نظر شما با موفقیت ثبت شد</p><span class="notification__progress"></span></div>'
            },
            error: function (data) {
                console.log(data)
            }
        })
    }
}