var stylistTitle = document.querySelector('.stylist-price-dropdown-title');
var serviceTitle = document.querySelector('.service-price-dropdown-title');
var Price = document.getElementById('addServicePrice-price');


function GetBarberShopInfo(){
  $.ajax({
    url: 'https://localhost:44322/api/Info/Get',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      document.getElementById('tbl-shopinfo').innerHTML = `<tr><td>${data.phoneNumber}</td><td>${data.address}</td><td style="direction: ltr;">${data.instaPage}</td><td><a id="shopinfo${data.id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="Editinfo(this)" href="#modal-shopinfo" uk-toggle="" role="button">ویرایش</a></td></tr>`
      document.querySelector('.edit-info-btn').id = data.id
    },
    error: function(){
        console.log('error')
    }
  })
}
function getFileNameFromPath(filePath) {
  return filePath.split("\\").pop();
}
const PageOptions = ["dashboard", "shopinfo", "managereservation", "photoalbum"];
const expand_btn = document.querySelector(".expand-btn");

let activeIndex;

expand_btn.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

const current = window.location.href;

const allLinks = document.querySelectorAll(".sidebar-links a");

allLinks.forEach((elem) => {
  elem.addEventListener('click', function() {
    const hrefLinkClick = elem.href;

    allLinks.forEach((link) => {
      if (link.href == hrefLinkClick){
        link.classList.add("active");
      } else {
        link.classList.remove('active');
      }
    });
  })
});


window.addEventListener("load", function() {
  history.replaceState(null, null, "Admin.html");
  PageOptions.forEach(option =>{
    var toNone = document.getElementById(option)
    if(toNone){
      toNone.style.display = 'none'
    }
  })
  document.getElementById('dashboard').style.display = ''
});
window.onhashchange = function(){
  if(window.location.href.lastIndexOf("#") != -1){
    var urlchild = window.location.href.substring(window.location.href.lastIndexOf("#")).replace('#', '')
    const [foundItem] = PageOptions.filter(option => option === urlchild);
    if(foundItem != null){
      var section = document.getElementById(`${urlchild}`)
      PageOptions.forEach(option =>{
        var toNone = document.getElementById(option)
        if(toNone){
          toNone.style.display = 'none'
        }
      })
      section.style.display = 'block'
    }
  }
  else{
    var section = document.getElementById(`${urlchild}`)
    PageOptions.forEach(option =>{
      var toNone = document.getElementById(option)
      if(toNone){
        toNone.style.display = 'none'
      }
    })
    document.getElementById('dashboard').style.display = ''
  }
}
//ShopInfo
GetBarberShopInfo()
async function MainOption(t){
  var SectionId = t.href.substring(t.href.lastIndexOf("#")).replace('#', '')
  var section = document.getElementById(`${SectionId}`)
  if(section){
    PageOptions.forEach(option =>{
      var toNone = document.getElementById(option)
      if(toNone){
        toNone.style.display = 'none'
      }
    })
    section.style.display = 'block'
  }
  
}
function Editinfo(t){
  var id = t.id.substring(8).trim();
  $.ajax({
    url: `https://localhost:44322/api/Info/Get/${id}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      document.getElementById('editinfo-tell').value = data.phoneNumber;
      document.getElementById('editinfo-address').value = data.address;
      document.getElementById('editinfo-insta').value = data.instaPage;
    },
    error: function(){
        console.log('error')
    }
  })
}
function EditInfoBtn(){
  var Id = document.querySelector('.edit-info-btn').id;
  var PhoneNumber = document.getElementById("editinfo-tell")
  var Address = document.getElementById("editinfo-address")
  var InstaPage = document.getElementById("editinfo-insta")
  if(PhoneNumber.value == ''){
    PhoneNumber.style.borderColor = 'red'
  }
  if(Address.value == ''){
    Address.style.borderColor = 'red'
  }
  if(InstaPage.value == ''){
    InstaPage.style.borderColor = 'red'
  }
  else{
    PhoneNumber.style.borderColor = ''
    InstaPage.style.borderColor = ''
    Address.style.borderColor = ''
    var infoToEdit={
      id : Id,
      phoneNumber : PhoneNumber.value,
      address :Address.value ,
      instaPage :InstaPage.value
    }
    $.ajax({
      url: `https://localhost:44322/api/Info/Edit`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(infoToEdit),
      success: function(data){
        console.log('edited!')
        GetBarberShopInfo()
        UIkit.modal('#modal-shopinfo').hide();
      },
      error: function(){
          console.log('error')
      }
    })
  }
}
//..
//ImgAlbum
function AllWorkPhoto(){
  document.getElementById('tbl-work-photos').innerHTML = ''
  $.ajax({
    url: 'https://localhost:44322/api/Photo/AllWorkPhotos',
    type: 'GET',
    dataType:'json',
  contentType: 'application/json',
  success: function(data){
    for(var i = 0; i <= data.length; i++){
      document.getElementById('tbl-work-photos').innerHTML += `<tr><td>${data[i].title}</td><td><img src="../Resources/${data[i].imageUrl}"></td><td><a id="workphoto${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditWorkPhoto(this)" href="#modal-work-photos" uk-toggle="" role="button">ویرایش</a></td></tr>`
    }
  
  },
  error: function(data)
  {
    console.log('Error')
  },
  })
}
AllWorkPhoto()
function EditWorkPhoto(t){
  document.querySelector('.image-name').innerHTML = 'عکس مورد نظر را آپلود نمایید'
  document.getElementById('photo').value = ''
  var EditImgDiv = document.getElementById('img-edit-div')
  var EditTitle = document.getElementById('edit-work-photo-title')

  var id = t.id.substring(9).trim();
  console.log(id)
  $.ajax({
    url: `https://localhost:44322/api/Photo/WorkPhotoById/${id}`,
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(data){
      EditImgDiv.innerHTML = `<img style="max-width: 50%;" src="Resources/${data.imageUrl}">`
      EditTitle.value = data.title
      document.querySelector('.edit-work-photo-btn').id = id
    },
    error: function(){
        console.log('error')
    }
  })
}
function WorkPhotoinput(input){
  var imgName = getFileNameFromPath(input.value)
  document.querySelector('.image-name').innerHTML = imgName
}


function EditWorkPhotoBtn(t){
  var inputFileImage = document.getElementById("photo");
  var formData = new FormData();
  if(inputFileImage.value != ''){
    var file = inputFileImage.files[0];
    formData.append('file', file)
  }
  var vmWork={
    id: t.id,
    title: document.getElementById('edit-work-photo-title').value,
    imageUrl: getFileNameFromPath(inputFileImage.value).trim(),
  }
  //below ajax make page refresh on success function!!
  $.ajax({
    url: 'https://localhost:44322/api/Photo/EditWorkPhoto',
    type: "POST",
    data: JSON.stringify(vmWork),
    processData: false,
    contentType: 'application/json',
    success: function (data) {
      if(inputFileImage.value != ''){
        var file = inputFileImage.files[0];
        formData.append('file', file)
        $.ajax({
          url:'https://localhost:44322/api/Admin/SaveImg',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data){
            
          },
          error: function(){
            console.log('error')
          }
        })
      }
      // AllWorkPhoto()
      // UIkit.modal('#modal-work-photos').hide()
    },
    error: function () {
    }
});
}

function AllServicePrice(){
  document.getElementById('tbl-service-price').innerHTML = ''
  $.ajax({
    url: 'https://localhost:44322/api/ServicePrice/All',
    type: 'GET',
    dataType:'json',
  contentType: 'application/json',
  success: function(data){
    for(var i = 0; i <= data.length; i++){
      document.getElementById('tbl-service-price').innerHTML += `<tr><td>${data[i].id}</td><td>${data[i].service}</td><td>${data[i].hairStylist}</td><td>${data[i].price}</td><td><a id="servicePrice${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditServicePrice(this)" href="#modal-service-price-edit" uk-toggle="" role="button">ویرایش</a></td><td><a id="servicePrice-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteServicePrice(this)" href="#modal-servicePrice-delete" uk-toggle="" role="button">حذف</a></td></tr>`
    }
  
  },
  error: function(data)
  {
    console.log('Error')
  },
  })
}
AllServicePrice();
function allservices(){
  stylistTitle.innerHTML = 'آرایشگر'
  serviceTitle.innerHTML = 'نوع سرویس'
  Price.style.border = ''
  Price.value = ''
  var serviceDropdown = document.querySelector('.service-price-dropdown');
  $.ajax({
    url:'https://localhost:44322/api/Service/AllServices',
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
  document.querySelector('.service-price-dropdown-btn').style.border = ''
  var stylistDropdown = document.querySelector('.stylist-price-dropdown');
  serviceId = t.id.substring(7).trim();
  document.querySelector('.service-price-dropdown-title').innerHTML = t.innerHTML;
  document.querySelector('.service-price-dropdown-title').id = `serviceId${serviceId}`
  document.querySelector('.stylist-price-dropdown-title').innerHTML = 'آرایشگر';
  $.ajax({
    url:`https://localhost:44322/api/Stylist/GetAdminStylist/${serviceId}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      stylistDropdown.innerHTML = ''
      data.forEach(stylist => {
        stylistDropdown.innerHTML+= `<li id="stylist${stylist.id}" onclick="receivestylists(this)"><span>${stylist.name}</span></li>`
      });
    },
    error: function(){
      console.log('error')
    }
})
}
function receivestylists(t){
  document.querySelector('.stylist-price-dropdown-btn').style.border = ''
  stylistId = t.id.substring(7).trim();
  document.querySelector('.stylist-price-dropdown-title').innerHTML = t.innerHTML;
  document.querySelector('.stylist-price-dropdown-title').id = `stylistId${stylistId}`;
}
function AddServicePriceSave(t){
  Price.style.border = ''
  if(serviceTitle.innerHTML == 'نوع سرویس'){
    document.querySelector('.service-price-dropdown-btn').style.border = '2px solid red'
    return;
  }
  if(stylistTitle.innerHTML == 'آرایشگر'){
    document.querySelector('.stylist-price-dropdown-btn').style.border = '2px solid red'
    return;
  }
  if(Price.value.length < 4){
    Price.style.border = '2px solid red'
    return;
  }
  var StylistId = stylistTitle.id.substring(9);
  var ServiceId = serviceTitle.id.substring(9);
  var servicePriceRel ={
    serviceId :ServiceId,
    hairStylistId : StylistId,
    price: Price.value.trim()

  }
  $.ajax({
    url: `https://localhost:44322/api/ServicePrice/Add`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(servicePriceRel),
    success: function(data){
      stylistTitle.innerHTML = 'آرایشگر'
      serviceTitle.innerHTML = 'نوع سرویس'
      Price.value = ''
      UIkit.modal('#modal-servicePrice-add').hide()
      AllServicePrice()
    },
    error: function(){
      console.log('error')
    }
  })

}
function DeleteServicePrice(t){
  document.querySelector('.delete-servicePrice-btn').id = t.id.substring(19)
}
function DeleteServicePriceSave(t){
  $.ajax({
    url: `https://localhost:44322/api/ServicePrice/Delete/${t.id}`,
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){
      UIkit.modal('#modal-servicePrice-delete').hide()
      AllServicePrice()
    },
    error: function(){
      console.log('error')
    }
  })
}

function EditServicePrice(t){
  var id = t.id.substring(12);
  // var serviceDropdownTitle = document.querySelector('.service-price-edit-dropdown-title');
  // var stylistDropdownTitle = document.querySelector('.stylist-price-edit-dropdown-title');
  var price = document.getElementById('editServicePrice-price');
  $.ajax({
    url: `https://localhost:44322/api/ServicePrice/Get/${id}`,
    type: 'GET',
    contentType: 'application/json',
    success: function(data){
      // serviceDropdownTitle.innerHTML = data.serviceType
      // stylistDropdownTitle.innerHTML = data.hairStylist
      price.value = data.price
      document.querySelector('.edit-servicePrice-save').id = id;
    },
    error: function(){
      console.log('error')
    }
  })
}

function EditServicePriceSave(t){
  var Id = t.id
  var Price = document.getElementById('editServicePrice-price');
  if(Price.value.length < 4){
    Price.style.border = '2px solid red'
    return;
  }
  var servicePriceToEdit = {
    id: Id,
    price : Price.value.trim()
  }
  console.log(servicePriceToEdit.id)
  $.ajax({
    url: `https://localhost:44322/api/ServicePrice/Edit`,
    type:'POST',
    data: JSON.stringify(servicePriceToEdit),
    contentType:'application/json',
    success: function(data){
      UIkit.modal('#modal-service-price-edit').hide()
      AllServicePrice()
    },
    error: function(data){
      UIkit.modal('#modal-service-price-edit').hide()
      UIkit.notification( data.responseText , {status:'danger', timeout: 3000})
    }
  })
}