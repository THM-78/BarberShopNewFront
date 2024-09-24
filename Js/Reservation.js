const root = document.documentElement;
const dropdownServiceTitle = document.querySelector(".dropdown-service-title");
const dropdownStylistsTitle = document.querySelector(".dropdown-Stylists-title");
var dropdownList = document.querySelector(".dropdown-list-services");
var dropdownList2 = document.querySelector(".dropdown-list-stylists");
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
var serviceId = 0;
var StylistId = 0;
var StylistName = '';
var IntervalTime = 0;
document.getElementById('mainCnt').style.height = `calc(100% - ${document.querySelector('.uk-reservation-footer').offsetHeight}px)`

if (mediaQuery.matches) {
  document.querySelector('.reservation').classList.add('uk-container')   
}
window.addEventListener('resize', function() {
  if (mediaQuery.matches) {
    document.querySelector('.reservation').classList.add('uk-container')   
  }
  else{
    document.querySelector('.reservation').classList.remove('uk-container')   
  }
}, true);
async function services(){
  await Serviceajax();
  
  const setDropdownProps = (deg, ht, opacity) => {
    root.style.setProperty("--rotate-service-arrow", deg !== 0 ? deg + "deg" : 0);
    root.style.setProperty("--dropdown-service-height", ht !== 0 ? ht + "rem" : 0);
    root.style.setProperty("--list-opacity", opacity);
  };
  
  mainButton.addEventListener("click", () => {
    document.querySelector('.errService').style.display = 'none';
    document.querySelector('.errStylist').style.display = 'none';
    const listWrapperSizes = 3.5; // margins, paddings & borders
    const dropdownOpenHeight = 4.6 * ServicelistCount + listWrapperSizes;
    root.style.setProperty("--dropdown-stylists-height", 0);
    const currDropdownHeight =
      root.style.getPropertyValue("--dropdown-service-height") || "0";
  
    currDropdownHeight === "0"
      ? setDropdownProps(180, dropdownOpenHeight, 1)
      : setDropdownProps(0, 0, 0);
  });
  
  dropdownList.addEventListener("click", (e) => {
    const clickedItemText = e.target.innerText.toLowerCase().trim();
    dropdownServiceTitle.innerHTML = clickedItemText;
    setDropdownProps(0, 0, 0);
  });
}


function hairStylists(){
  const setDropdownProps = (deg, ht, opacity) => {
    root.style.setProperty("--rotate-stylists-arrow", deg !== 0 ? deg + "deg" : 0);
    root.style.setProperty("--dropdown-stylists-height", ht !== 0 ? ht + "rem" : 0);
    root.style.setProperty("--list-opacity", opacity);
  };
  
  mainButton2.addEventListener("click", () => {
    document.querySelector('.errStylist').style.display = 'none'
    const listWrapperSizes = 3.5; // margins, paddings & borders
    const dropdownOpenHeight = 4.6 * StylistlistCount + listWrapperSizes;
    root.style.setProperty("--dropdown-service-height", 0);
    const currDropdownHeight =
      root.style.getPropertyValue("--dropdown-stylists-height") || "0";
  
    currDropdownHeight === "0"
      ? setDropdownProps(180, dropdownOpenHeight, 1)
      : setDropdownProps(0, 0, 0);
  });
  
  dropdownList2.addEventListener("click", (e) => {
    const clickedItemText = e.target.innerText.toLowerCase().trim();
    dropdownStylistsTitle.innerHTML = clickedItemText;
    setDropdownProps(0, 0, 0);
  });
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
      url: `https://localhost:44342/api/Reservation/DisCode`,
      type:'POST',
      dataType:'json',
      contentType: 'application/json',
      data: JSON.stringify(discountCode),
      success: function(data){
        console.log(data)
        document.getElementById('error-code').style.display = 'none'
        ReservationPrice.style.textDecoration = 'line-through'
        BeforeCode.style.display = 'none'
        document.getElementById('new-price').innerHTML = data.price
        AfterCode.style.display = 'block'
      },
      error: function(){
        console.log('error')
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
    url:`https://localhost:44342/api/Reservation/ServiceById/${serviceId}`,
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
        url:`https://localhost:44342/api/Reservation/ReservationHours`,
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
// function AddServiceItem(serviceTypeList, listItems){
//   serviceTypeList.forEach(servicee => {
//     listItems.push(servicee)
//   });
// }
// var listItems = []
var StylistlistCount = 0;
var ServicelistCount = 0;
function Serviceajax(){
  $.ajax({
    url:'https://localhost:44342/api/Reservation/ReservationServices',
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      data.forEach(service => {
        ServicelistCount++
        dropdownList.innerHTML+= `<li class="dropdown-list-item"><button id="${service.id}" onclick="getstylists(this)" class="dropdown-button dropdown-Service-button list-button"><span class="text-truncate">${service.type}</span></button></li>`
      });
    },
    error: function(){
      console.log('error')
    }
  })
}
function getstylists(t){
  serviceId = t.id
  document.querySelector('.dropdown-Stylists-title').innerHTML = 'همه'
  $.ajax({
    url:`https://localhost:44342/api/Reservation/ReservavtionStylists/${serviceId}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      dropdownList2.innerHTML = ''
      data.forEach(stylistRel => {
        StylistlistCount++
        dropdownList2.innerHTML+= `<li class="dropdown-list-item"><button id="${stylistRel.hairStylistId}" onclick="receivestylists(this)" class="dropdown-stylists-button list-button"><span class="text-truncate">${stylistRel.name+' '}</span><span class="text-truncate">${'('+stylistRel.price+')'}</span></button></li>`
      });
    },
    error: function(){
      console.log('error')
    }
  })
}
function receivestylists(t){
  StylistId = t.id;
  $.ajax({
    url:`https://localhost:44342/api/Reservation/GetStylistById/${t.id}`,
    type: 'GET',
    dataType: 'json',
    contentType:'application/json',
    success: function(data){
      StylistName = data.hairStylistNAme
      timetableAjax()
    },
    error: function(){
      
    }
  })
}
services()
hairStylists()

function ReserveStep1(){
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none'
  document.querySelector('.progress-yellow').value = '1';
  var activedP = document.getElementById('ReservationStep2');
  activedP.classList.remove('active')
  document.getElementById('ReservationStep1').classList.add('active')
}
function ReserveStep2(){
  if(dropdownServiceTitle.innerHTML == 'نوع سرویس'){
    document.querySelector('.errService').style.display = 'block'
  }
  if(dropdownStylistsTitle.innerHTML == 'همه'){
    document.querySelector('.errStylist').style.display = 'block'
  }
  else
  {
    if(!document.querySelector('.chosen-time')){
      timetableAjax();
    }
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block'
    document.querySelector('.progress-yellow').value = '2';
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
    document.querySelector('.progress-yellow').value = '3';
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
  if(StylistId != 0){
    var ForGetPrice ={
      serviceId : serviceId,
      hairStylistId : StylistId
  
    }
    $.ajax({
      url:`https://localhost:44342/api/Reservation/GetPrice`,
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
    if(Itell.value == ''){
      errUser.innerHTML += '<li class="err">لطفا شماره همراه خود را وارد نمایید</li>'
    }
    else{
      errUser.innerHTML = ''
      setTimeout(function() {
        document.getElementById('step5').style.display = 'none';
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step4').style.display = 'block'
        document.querySelector('.progress-yellow').value = '4';
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
  document.querySelector('.progress-yellow').value = '5';
  var activedP = document.getElementById('ReservationStep4');
  activedP.classList.remove('active')
  document.getElementById('ReservationStep5').classList.add('active')
}
