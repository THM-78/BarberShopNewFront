const mediaQuery = window.matchMedia('(max-width: 768px)')
if (mediaQuery.matches) {
    
}
var img1before = document.querySelector('#img1before')
var img1after = document.querySelector('#img1after')
var img2before = document.querySelector('#img2before')
var img2after = document.querySelector('#img2after')

$.ajax({
    url: 'https://localhost:44322/api/BeforeAfter/GetRandomFour',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
        $("#img1before").prop('src', `Resources/${data[0].beforeImgUrl}`);
        $("#img1after").prop('src', `Resources/${data[0].afterImgUrl}`);
        $("#img2before").prop('src', `Resources/${data[1].beforeImgUrl}`);
        $("#img2after").prop('src', `Resources/${data[1].afterImgUrl}`);
    },
    error: function (data) {
        console.log('Error')
    }
})


var HairStylists = document.querySelector('.Hair-stylist-prof')
$.ajax({
    url: 'https://localhost:44322/api/Stylist/AllStylists',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
        data.forEach(element => {
            HairStylists.innerHTML += `<li><div class="uk-panel card card${element.id}"><div class="border"><h2>${element.name}</h2> <div class="icons"><a href=""><i class="fab fa-instagram" aria-hidden="true"></i></a> <a href=""><i class="fab fa-twitter" aria-hidden="true"></i></a></div></div></div></li>`
            document.querySelector(`.card${element.id}`).style.background = `url("./Resources/${element.imageUrl}") center no-repeat`
            document.querySelector(`.card${element.id}`).style.backgroundSize = 'cover'
        });
    },
    error: function(){
        console.log('error')
    }
})
