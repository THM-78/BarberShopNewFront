const root = document.documentElement;
var reservationDropdown = document.querySelector('.reservation-dropdown')
var serviceDropdown = document.querySelector('.service-dropdown');
var stylistDropdown = document.querySelector('.stylist-dropdown');
var serviceId = 0;
var stylistd = 0;
Serviceajax();
function Serviceajax(){
    $.ajax({
      url:'https://localhost:44342/api/Reservation/ReservationServices',
      type:'GET',
      dataType:'json',
      contentType:'application/json',
      success: function(data){
        serviceDropdown.innerHTML = ''
        data.forEach(service => {
            serviceDropdown.innerHTML += `<li id="service${service.id}" class="service-option" onclick="getstylists(this)">${service.type}</li>`
        });
      },
      error: function(){
        console.log('error')
      }
    })
}

function getstylists(t){
    serviceId = t.id.substring(7).trim();
    document.querySelector('.service-dropdown-title').innerHTML = t.innerHTML;
    document.querySelector('.errService').style.display = 'none'
    document.querySelector('.stylist-dropdown-title').innerHTML = 'همه';
    $.ajax({
        url:`https://localhost:44342/api/Reservation/ReservavtionStylists/${serviceId}`,
        type:'GET',
        dataType:'json',
        contentType:'application/json',
        success: function(data){
          stylistDropdown.innerHTML = ''
          data.forEach(stylistRel => {
            stylistDropdown.innerHTML+= `<li id="stylist${stylistRel.hairStylistId}" onclick="receivestylists(this)"><span>${stylistRel.name + ' '}</span><span class="service-price">(${stylistRel.price})</span></li>`
          });
        },
        error: function(){
          console.log('error')
        }
    })
}
function receivestylists(t){
    stylistd = t.id.substring(7).trim();
    document.querySelector('.stylist-dropdown-title').innerHTML = t.innerHTML;
    document.querySelector('.errStylist').style.display = 'none'
}

function ReserveStep2(){
    if(document.querySelector('.service-dropdown-title').innerHTML == 'نوع سرویس'){
        document.querySelector('.errService').style.display = 'block'
    }
    if(document.querySelector('.stylist-dropdown-title').innerHTML == 'همه'){
        document.querySelector('.errStylist').style.display = 'block'
    }
    else{
        console.log('Ok')
    }
}