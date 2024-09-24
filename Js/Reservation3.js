const root = document.documentElement;
var reservationDropdown = document.querySelector('.reservation-dropdown')
var serviceDropdown = document.querySelector('.service-dropdown');
var stylistDropdown = document.querySelector('.stylist-dropdown');
var serviceId = 0;
var stylistd = 0;
const mainButton = document.querySelector(".service-dropdown-button");
const mainButton2 = document.querySelector(".stylist-dropdown-button");
var TimeBtns = document.querySelector(".reserve-active");
var ReservationPrice = document.getElementById("reserve-price")
let DatePickerInput = document.getElementById('DatePicker');
var TimeTable = document.getElementById('time-table');
var BeforeCode = document.getElementById('before-code');
var CodeInput = document.getElementById('checkdiscount')
var AfterCode = document.getElementById('after-code');
const mediaQuery = window.matchMedia('(max-width: 768px)')
var StylistName = '';
var IntervalTime = 0;

Serviceajax();
function Serviceajax(){
    $.ajax({
      url:'https://localhost:44322/api/Service/ReservationServices',
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
  serviceId = 0
  serviceId = t.id.substring(7).trim();
  document.querySelector('.service-dropdown-title').innerHTML = t.innerHTML;
  document.querySelector('.errService').style.display = 'none'
  document.querySelector('.stylist-dropdown-title').innerHTML = 'همه';
  $.ajax({
      url:`https://localhost:44322/api/ServicePrice/GetByService/${serviceId}`,
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


function FinishReserve(){
  //مرحله آخر
}
$('#checkdiscount').keypress(function (e) {                                       
  if (e.which == 13) {
       e.preventDefault();
       CheckCode();
  }
});
function CheckCode(){//Check discount code Onclick
  if(CodeInput.value.trim() != ''){
    CodeInput.style.borderColor = ''
    var discountCode ={
      code: CodeInput.value.trim(),
      price: ReservationPrice.innerHTML
    }
    $.ajax({
      url: `https://localhost:44322/api/DiscountCode/ValidateDiscode`,
      type:'POST',
      contentType: 'application/json',
      data: JSON.stringify(discountCode),
      success: function(data){
        console.log(data)
        document.getElementById('error-code').style.display = 'none'
        ReservationPrice.style.textDecoration = 'line-through'
        BeforeCode.style.display = 'none'
        document.getElementById('new-price').innerHTML = data
        AfterCode.style.display = 'block'
      },
      error: function(error){
        console.log(error)
        document.getElementById('error-code').style.display = 'block'
      }
    })
  }
  else{
    CodeInput.style.borderColor = 'red'
  }
}
async function chooseReserve(t){
  if (document.querySelector('.chosen-time')) {
    document.querySelector('.chosen-time').classList.remove('chosen-time')
  }
  document.querySelector('.errTime').style.display = 'none'
  await document.getElementById(t.id).classList.add('chosen-time')
}
function timetableAjax(){
  $.ajax({
    url:`https://localhost:44322/api/Service/ServiceIntervalById/${serviceId}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      IntervalTime = data.periodOfTime;
      var ReservationHour={
        date:DatePickerInput.value,
        intervalTime: IntervalTime,
        serviceId: serviceId,
        hairStylist: StylistName.trim()
      }
      $.ajax({
        url:`https://localhost:44322/api/Reservation/ReservationHours`,
        type:'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify(ReservationHour),
        success: function(data){
          console.log(serviceId)
          TimeTable.innerHTML = '';
          for(var i=0; i < data.length; i+=2){
            if(data.length -1 == i){
              if(data[i].isReserved == true){

                TimeTable.innerHTML+= `<td><button id="time${i}" class="uk-button uk-button-default" disabled>${data[i].time}</button></td>`
              }
              else{
                TimeTable.innerHTML+= `<td><button id="time${i}" onclick="chooseReserve(this)" class="uk-button uk-button-default reserve-active">${data[i].time}</button></td>`
              }
            }
            else{
              if(data[i].isReserved == true && data[i+1].isReserved == false){
                TimeTable.innerHTML+= `<td><button id="time${i}" class="uk-button uk-button-default" disabled>${data[i].time}</button></td><td><button id="time${i-1}" onclick="chooseReserve(this)" class="uk-button uk-button-default reserve-active">${data[i+1].time}</button></td>`
              }
              else if(data[i+1].isReserved == true && data[i].isReserved == false){
                TimeTable.innerHTML+= `<td><button id="time${i}" onclick="chooseReserve(this)" class="uk-button uk-button-default reserve-active">${data[i].time}</button></td><td><button id="time${i+1}" class="uk-button uk-button-default" disabled>${data[i+1].time}</button></td>`
              }
              else if(data[i+1].isReserved == true && data[i].isReserved == true){
                TimeTable.innerHTML+= `<td><button id="time${i}" class="uk-button uk-button-default" disabled>${data[i].time}</button></td><td><button id="time${i+1}" class="uk-button uk-button-default" disabled>${data[i+1].time}</button></td>`
              }
              else{
                TimeTable.innerHTML+= `<td><button id="time${i}" onclick="chooseReserve(this)" class="uk-button uk-button-default reserve-active">${data[i].time}</button></td><td><button id="time${i+1}" onclick="chooseReserve(this)" class="uk-button uk-button-default reserve-active">${data[i+1].time}</button></td>`
              }
            }
          }
        },
        error: function(){
          console.log('error')
        }
      })
    },
    error: function(){
      console.log('error')
    }
  })
}
function TableDays(){//Date Time Picker onClick
  if(serviceId != 0){
    document.getElementById('time-table').style.display = 'block'
    document.querySelector('.errHoliday').style.display = 'none'
    timetableAjax();
    
  }
}

var StylistlistCount = 0;
var ServicelistCount = 0;

function ReserveStep1(){
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none'
  document.querySelector('.work-time').style.display = 'block';
  document.querySelector('.reservation-progress').value = '1';
  var activedP = document.getElementById('ReservationStep2');
  activedP.classList.remove('active')
  document.getElementById('ReservationStep1').classList.add('active')
}

function ReserveStep2(){
    if(document.querySelector('.service-dropdown-title').innerHTML == 'نوع سرویس'){
        document.querySelector('.errService').style.display = 'block'
    }
    if(document.querySelector('.stylist-dropdown-title').innerHTML == 'همه'){
        document.querySelector('.errStylist').style.display = 'block'
    }
    else{
        StylistName = $('span.stylist-dropdown-title').find('span').eq(0).text().trim();
        timetableAjax();
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block'
        document.querySelector('.work-time').style.display = 'none';
        document.querySelector('.reservation-progress').value = '2';
        var activedP = document.getElementById('ReservationStep1');
        var activedP2 = document.getElementById('ReservationStep3');
        activedP.classList.remove('active')
        activedP2.classList.remove('active')
        document.getElementById('ReservationStep2').classList.add('active')
    }
}
function ReserveStep3(){
  CodeInput.value = '';
  AfterCode.style.display = 'none';
  BeforeCode.style.display = 'block'
  ReservationPrice.style.textDecoration = 'none'
  //..........................................
  var activedP = document.getElementById('ReservationStep2');
  var activedP2 = document.getElementById('ReservationStep4');
  if(document.querySelector('.chosen-time')){
    document.querySelector('.reservation-progress').value = '3';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block'
    activedP.classList.remove('active')
  }
  else{
    document.querySelector('.errTime').style.display = 'block'
  }
  document.getElementById('step4').style.display = 'none';
  activedP2.classList.remove('active')
  document.getElementById('ReservationStep3').classList.add('active')
}
function ReserveStep4(){
  var errFirstName = document.querySelector('.err-firstname')
  var errUser = document.querySelector('.err-user')
  var errLastName = document.querySelector('.err-lastname')
  var errTell =  document.querySelector('.err-tell')

  var Ifirstname =  document.getElementById('user-firstname')
  var IlastName = document.getElementById('user-lastname')
  var Itell = document.getElementById('user-tell')
  var Iemail = document.getElementById('user-email')
  if(stylistd != 0){
    var ForGetPrice ={
      serviceId : serviceId,
      hairStylistId : stylistd
  
    }
    $.ajax({
      url:`https://localhost:44322/api/ServicePrice/GetPrice`,
      type:'POST',
      dataType:'json',
      contentType:'application/json',
      data: JSON.stringify(ForGetPrice),
      success: function(data){
        ReservationPrice.innerHTML = data.price;
      },
      error: function(){
        console.log('error')
      }
    })
    errUser.innerHTML = ''
    if(Ifirstname.value == ''){
      errUser.innerHTML += '<li class="err">لطفا نام و نام خانوادگی را وارد نمایید</li>'
    }
    else if(Itell.value == ''){
      errUser.innerHTML += '<li class="err">لطفا شماره همراه خود را وارد نمایید</li>'
    }
    else{
      errUser.innerHTML = ''
      setTimeout(function() {
        document.getElementById('step5').style.display = 'none';
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step4').style.display = 'block'
        document.querySelector('.reservation-progress').value = '4';
        var activedP = document.getElementById('ReservationStep3');
        var activedP2 = document.getElementById('ReservationStep5');
        activedP.classList.remove('active')
        activedP2.classList.remove('active')
        document.getElementById('ReservationStep4').classList.add('active')
      }, 300);
    }

  }
}
function ReserveStep5(){
  document.getElementById('step4').style.display = 'none';
  document.getElementById('step5').style.display = 'block'
  document.querySelector('.reservation-progress').value = '5';
  var activedP = document.getElementById('ReservationStep4');
  activedP.classList.remove('active')
  document.getElementById('ReservationStep5').classList.add('active')
}
