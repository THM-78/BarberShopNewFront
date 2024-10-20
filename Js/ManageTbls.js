var TableDiv = document.getElementById('table-div')
var AddBtnDiv = document.getElementById('addbtn-div')
var TblServices = document.getElementById('services-tbl')
const MinuteInput = document.querySelector('.period-field')
var EditType = document.getElementById('editservice-type')
var EditTime = document.getElementById('editservice-time')
var EditStylistLevelId = 0

MinuteInput.addEventListener('input', function() {
  if (this.value.length > 3) {
    this.value = this.value.slice(0, 3);
  }
});
function getFileNameFromPath(filePath) {
  return filePath.split("\\").pop();
}
function getAllService(){
  AddBtnDiv.innerHTML = `<a class="menu-reserve-btn uk-button uk-text-emphasis add-service-btn" href="#modal-service-add" uk-toggle="" role="button">سرویس جدید<span class="uk-margin-small-right" uk-icon="plus"></span></a>`
  $.ajax({
      url:'https://localhost:44322/api/Service/AllServices',
      type:'GET',
      dataType:'json',
      contentType:'application/json',
      success: function(data){
          TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>آیدی<th>عنوان<th>بازه زمانی </thead><tbody id="services-tbl"></tbody></table>`
          var id = 0
          for(var i = 0; i <= data.length; i++){
              id++
              document.getElementById('services-tbl').innerHTML += `<tr><td>${id}</td><td>${data[i].type}</td><td>${data[i].periodOfTime} دقیقه</td><td><a id="service-edit${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditService(this)" href="#modal-service-edit" uk-toggle="" role="button">ویرایش</a></td><td><a id="service-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteService(this)" href="#modal-service-delete" uk-toggle="" role="button">حذف</a></td></tr>`
          }
      },
      error: function(){
        console.log('error')
      }
  })
}
function getAllHairStylist(){
  $.ajax({
    url:'https://localhost:44322/api/Stylist/AllStylists',
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
        TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>آیدی<th>نام<th>سطح<th>عکس</thead><tbody id="hairstylist-tbl"></tbody></table>`
        var id = 0
        for(var i = 0; i <= data.length; i++){
            id++
            document.getElementById('hairstylist-tbl').innerHTML += `<tr><td>${id}</td><td>${data[i].name}</td><td>${data[i].hairStylistLevel}</td><td style="display: grid;place-content: center;"><div class="stylist-image" style="background-image: url(../Resources/${data[i].imageUrl});"></div></td><td><a id="stylist-edit${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditStylist(this)" href="#modal-stylist-edit" uk-toggle="" role="button">ویرایش</a></td><td><a id="stylist-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="Deletestylist(this)" href="#modal-stylist-delete" uk-toggle="" role="button">حذف</a></td></tr>`
        }
    },
    error: function(){
      console.log('error')
    }
})
}
function EditStylist(t){
  document.querySelector('.stylistLevelEdit-dropdown-btn').style.border = '0'
  document.querySelector('.stylistLevelEdit-dropdown-title').innerHTML = 'سطح آرایشگر'
  document.querySelector('.stylist-image-name-edit').innerHTML = 'پروفایل جدید را آپلود نمایید'
  document.getElementById('editStylist-name').style.border = ''
  var id = t.id.substring(12).trim();
  levelsDropdown = document.querySelector('.stylistLevelEdit-dropdown');
  $.ajax({
    url:`https://localhost:44322/api/Stylist/StylistById/${id}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      document.querySelector('.edit-stylist-save').id = `${id}`
      document.getElementById('edit-stylist-img-tag').innerHTML = `<img src="Resources/${data.imageUrl}" >`
      document.getElementById('editStylist-name').value = data.name;
    },
    error: function(){
      console.log('error')
    }
})
  $.ajax({
      url:`https://localhost:44322/api/Stylist/AllStylistLevels`,
      type:'GET',
      dataType:'json',
      contentType:'application/json',
      success: function(data){
        levelsDropdown.innerHTML = ''
        data.forEach(stylistLevel => {
          levelsDropdown.innerHTML+= `<li id="level${stylistLevel.id}" onclick="receivestylistLevel(this)"><span>${stylistLevel.stylistLevel}</span></li>`
        });
      },
      error: function(){
        console.log('error')
      }
  })
}
function receivestylistLevel(t){
  EditStylistLevelId = t.id.substring(5).trim()
  document.querySelector('.stylistLevelEdit-dropdown-btn').style.border = '0'
  document.querySelector('.stylistLevelEdit-dropdown-title').innerHTML = t.innerHTML
  document.querySelector('.stylistLevelEdit-dropdown-title').id = `levelSelected${EditStylistLevelId}`
}
function StylistImgEdit(input){
  var imgName = getFileNameFromPath(input.value);
  document.querySelector('.stylist-image-name-edit').innerHTML = imgName
  document.getElementById('edit-stylist-img-tag').innerHTML = ''
}
function EditStylistSave(t){
  var level = document.querySelector('.stylistLevelEdit-dropdown-title').innerHTML
  var nameInput = document.getElementById('editStylist-name')
  var levelBtn = document.querySelector('.stylistLevelEdit-dropdown-btn')
  const StylistImg = document.getElementById('stylist-img-edit')
  if(level == 'سطح آرایشگر'){
    levelBtn.style.border = '2px solid red'
    return;
  }
  if(nameInput.value.trim() == ''){
    nameInput.style.border = '2px solid red'
    return;
  }
  if(StylistImg.value == ''){
    UIkit.notification('عکسی آپلود نکردید!' , {status:'danger' , timeout: 3000} )
    return;
  }
  var stylistToEdit = {
    id: t.id,
    name : nameInput.value.trim(),
    imageUrl : getFileNameFromPath(StylistImg.value),
    hairStylistLevelId : Number(EditStylistLevelId)
  }
  $.ajax({
    url: `https://localhost:44322/api/Stylist/EditStylist`,
    type:'POST',
    data: JSON.stringify(stylistToEdit),
    contentType:'application/json',
    success: function(data){
      UIkit.modal('#modal-stylist-edit').hide()
      getAllHairStylist()
    },
    error: function(data){
      UIkit.modal('#modal-BeforeAfter-add').hide()
      UIkit.notification( data.responseText , {status:'danger', timeout: 3000})
    }
  })
}
function Deletestylist(t){
  var id = t.id.substring(14).trim()
  document.querySelector('.delete-stylist-btn').id = `delete-stylist${id}`
}
function DeleteStylistSave(t){
  var id = document.querySelector('.delete-stylist-btn').id.substring(14).trim();
  $.ajax({
    url: `https://localhost:44322/api/Stylist/DelStylist/${id}`,
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){
      UIkit.modal('#modal-stylist-delete').hide()
      getAllHairStylist()
    },
    error: function(){
      console.log('error')
    }
  })
}
function getAllDiscodes(){
  AddBtnDiv.innerHTML = `<a class="menu-reserve-btn uk-button uk-text-emphasis add-discode-btn" href="#modal-discode-add" uk-toggle="" role="button">کد تخفیف جدید<span class="uk-margin-small-right" uk-icon="plus"></span></a>`
  $.ajax({
    url:'https://localhost:44322/api/DiscountCode/AllDiscountCode',
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
        TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>آیدی<th>کد<th>درصد تخفیف</thead><tbody id="discodes-tbl"></tbody></table>`
        var id = 0
        for(var i = 0; i <= data.length; i++){
            id++
            document.getElementById('discodes-tbl').innerHTML += `<tr><td>${id}</td><td>${data[i].code}</td><td>${data[i].discountPercent}%</td><td><a id="discode-edit${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditDiscode(this)" href="#modal-discode-edit" uk-toggle="" role="button">ویرایش</a></td><td><a id="discode-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteDiscode(this)" href="#modal-discode-delete" uk-toggle="" role="button">حذف</a></td></tr>`
        }
    },
    error: function(){
      TableDiv.innerHTML = ''
      console.log('error')
    }
})
}

function AddDiscodeSave(){
  const code = document.getElementById('addDiscode-code');
  const percent = document.getElementById('addDiscode-percent');
  if(code.value == '' || code.value.trim().length > 32){
    code.style.borderColor='red';
  }
  if(percent.value == '' || percent.value.trim().length > 3 || isNaN(percent.value) == true){
    percent.style.borderColor='red'
  }
  else{
    code.style.borderColor = ''
    percent.style.borderColor = ''
    var DiscodeToAdd = {
      code: code.value.trim(),
      discountPercent: percent.value.trim()
    }
    $.ajax({
      url: `https://localhost:44322/api/DiscountCode/AddDiscode`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(DiscodeToAdd),
      success: function(data){
        code.value = ''
        percent.value = ''
        UIkit.modal('#modal-discode-add').hide()
        getAllDiscodes()
      },
      error: function(){
        console.log('error')
      }
    })
  }
}
function EditDiscode(t){
  var id= t.id.substring(12).trim();
  $.ajax({
    url: `https://localhost:44322/api/DiscountCode/DiscodeById/${id}`,
    type: 'GET',
    contentType: 'application/json',
    success: function(data){
      document.getElementById('editDiscode-code').value = data.code
      document.getElementById('editDiscode-percent').value = data.discountPercent
    },
    error: function(){
      console.log('error')
    }
  })
}
function EditDiscodeSave(t){
  //bordan
}

function DeleteDiscode(t){
  var id = t.id.substring(14).trim();
  document.querySelector('.delete-discode-btn').id = `dicodeToDel${id}`;
}

function DeleteDiscodeSave(t){
  var id = t.id.substring(11);
  $.ajax({
    url: `https://localhost:44322/api/DiscountCode/DelDiscode/${id}`,
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){
      UIkit.modal('#modal-discode-delete').hide()
      getAllDiscodes()
    },
    error: function(){
      console.log('error')
    }
  })
}
function getSuggestions(PageNo){
  $.ajax({
    url: `https://localhost:44322/api/Suggestion/AllSuggestion/${PageNo}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      var suggestions = data.result.suggestions
      var PageDiv = document.getElementById('pagination-pages')
      PageDiv.innerHTML = ''
      AddBtnDiv.innerHTML = ``
      var id = PageNo * 20 - 20;
      TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>آیدی<th>نام<th>ایمیل<th>متن پیام</thead><tbody id="suggestion-tbl"></tbody></table>`
      for(var i = 1; i <= data.pageCount; i++){
        if(i == PageNo){
          PageDiv.innerHTML += `<li><a class="current-page" <a onclick="ChangePage(this)"><span class="visuallyhidden"></span>${i}</a></li>`
        }
        else{
          PageDiv.innerHTML += `<li><a onclick="ChangePage(this)"><span class="visuallyhidden"></span>${i}</a></li>`
        }
      }
      for(var i = 0; i <= suggestions.length; i++){
        id++
        document.getElementById('suggestion-tbl').innerHTML += `<tr><td>${id}</td><td>${suggestions[i].name}</td><td>${suggestions[i].email}</td><td><a id="suggestion-view${suggestions[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="ViewSuggestion(this)" href="#modal-suggestion-view" uk-toggle="" role="button">مشاهده</a></td><td><a id="suggestion-delete${suggestions[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteSuggestion(this)" href="#modal-suggestion-delete" uk-toggle="" role="button">حذف</a></td></tr>`
        document.getElementById('pagination-nav').style.display = ''
      }
    },
    error: function(){
      console.log('error')
    }
  })
}
function getAllBeforeAfterImg(){
  $.ajax({
    url:'https://localhost:44322/api/BeforeAfter/All',
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
        AddBtnDiv.innerHTML = `<a onclick="BeforeAfteAddBtn()" class="menu-reserve-btn uk-button uk-text-emphasis add-BeforeAfter-btn" href="#modal-BeforeAfter-add" uk-toggle="" role="button">اضافه کردن<span class="uk-margin-small-right" uk-icon="plus"></span></a>`
        TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>ردیف<th>قبل<th>بعد</thead><tbody id="BeforeAfter-tbl"></tbody></table>`
        var id = 0
        for(var i = 0; i <= data.length; i++){
            id++
            document.getElementById('BeforeAfter-tbl').innerHTML += `<tr><td>${id}</td><td><center><div class="BeforeAfter-image" style="background-image: url(../Resources/${data[i].beforeImgUrl});"></div></center></td><td><center><div class="BeforeAfter-image" style="background-image: url(../Resources/${data[i].afterImgUrl});"></div></center></td><td><a id="BeforeAfter-edit${data[i].id}" class="uk-button uk-text-emphasis menu-reserve-btn" onclick="EditBeforeAfter(this)" href="#modal-BeforeAfter-edit" uk-toggle="" role="button">ویرایش</a></td><td><a id="BeforeAfter-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteBeforeAfter(this)" href="#modal-BeforeAfter-delete" uk-toggle="" role="button">حذف</a></td></tr>`
        }
    },
    error: function(){
      console.log('error')
    }
})
}
function getTodayReserves(){
  $.ajax({
    url:'https://localhost:44322/api/Reservation/GetTodayReserves',
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
        AddBtnDiv.innerHTML = `<a onclick="ReservationSearchBtn()" class="menu-reserve-btn uk-button uk-text-emphasis search-Reservation-btn" href="#modal-Reservation-search" uk-toggle="" role="button">جستجو براساس تاریخ<span class="uk-margin-small-right" uk-icon="search"></span></a>`
        TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>آیدی<th>سرویس<th>تایم<th>آرایشگر<th></thead><tbody id="Reservation-tbl"></tbody></table>`
        var id = 0
        for(var i = 0; i <= data.length; i++){
            id++
            document.getElementById('Reservation-tbl').innerHTML += `<tr><td>${id}</td><td>${data[i].serviceType}</td><td>${extractTime(data[i].reserveDate)}</td><td>${data[i].hairStylist}</td><td><a id="reservation-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteReservation(this)" href="#modal-reservation-delete" uk-toggle="" role="button">حذف</a></td></tr>`
        }
    },
    error: function(data){
      UIkit.notification( 'فعلا رزروی برای روز جاری صورت نگرفته است' , {status:'danger', timeout: 3000})
      AddBtnDiv.innerHTML = `<a onclick="ReservationSearchBtn()" class="menu-reserve-btn uk-button uk-text-emphasis search-Reservation-btn" href="#modal-Reservation-search" uk-toggle="" role="button">جستجو براساس تاریخ<span class="uk-margin-small-right" uk-icon="search"></span></a>`
    }
})
}
function ChangePage(t){//for suggestions
  var pageNo = $(t).text();
  getSuggestions(pageNo)

}
var parameter = window.location.href.substring(window.location.href.lastIndexOf("?")).replace('?', '').trim()
if(parameter == 'services'){
  getAllService()
}
else if(parameter == 'hairsylists'){
  getAllHairStylist()
}
else if(parameter == 'discodes'){
  getAllDiscodes()
}
// parameter.includes('suggestions')
else if(parameter == 'suggestions'){
  getSuggestions(1)
}
else if(parameter == 'before-afters'){
  getAllBeforeAfterImg()
}
else if(parameter == 'reserves'){
  getTodayReserves()
}

//service operation
function AddServiceSave(){
  const AddServiceType = document.getElementById('addservice-type');
  const AddServiceTime = document.getElementById('addservice-time');
  if(AddServiceType.value == '' || AddServiceType.value.trim().length > 32){
    AddServiceType.style.borderColor='red';
  }
  if(AddServiceTime.value == '' || AddServiceTime.value.trim().length > 3 || isNaN(AddServiceTime.value) == true){
    AddServiceTime.style.borderColor='red'
  }
  else{
    AddServiceType.style.borderColor = ''
    AddServiceTime.style.borderColor = ''
    var ServiceToAdd = {
      type: AddServiceType.value.trim(),
      periodOfTime: AddServiceTime.value.trim()
    }
    $.ajax({
      url: `https://localhost:44322/api/Service/AddService`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(ServiceToAdd),
      success: function(data){
        AddServiceType.value = ''
        AddServiceTime.value = ''
        UIkit.modal('#modal-service-add').hide()
        getAllService()
      },
      error: function(){
        console.log('error')
      }
    })
  }
}
function EditService(t){
  EditTime.style.border = ''
  EditType.style.border = ''
  var id = t.id.substring(12).trim()
  $.ajax({
    url:`https://localhost:44322/api/Service/ServiceById/${id}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      document.querySelector('.edit-service-btn').id = `service-edit-save${data.id}`
      EditTime.value = data.periodOfTime,
      EditType.value = data.type
    },
    error: function(){
      console.log('error')
    }
})
}
function EditServiceSave(t){
  var id = t.id.substring(17).trim()
  if(document.getElementById('editservice-type').value.trim() == ''){
    EditType.style.borderColor = 'red'
  }
  if(EditTime.value.trim() == '' || isNaN(EditTime.value) == true || EditTime.value.length > 3){
    EditTime.style.borderColor = 'red'
  }
  else if(document.getElementById('editservice-type').value.trim() != '' && document.getElementById('editservice-time').value.trim() != ''){
    EditTime.style.border = ''
    EditType.style.border = ''
    var ServiceToEdit= {
      id : id,
      type: EditType.value,
      periodOfTime: EditTime.value.trim()
    }
    $.ajax({
      url: `https://localhost:44322/api/Service/EditService`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(ServiceToEdit),
      success: function(data){
        UIkit.modal('#modal-service-edit').hide()
        getAllService()
      },
      error: function(){
        console.log('error')
      }
    })
  }
}
function DeleteService(t){
  var id = t.id.substring(14).trim()
  document.querySelector('.delete-service-btn').id = `delete${id}`
}
function DeleteServiceSave(t){
  var id = t.id.substring(6).trim();
  $.ajax({
    url: `https://localhost:44322/api/Service/DelService/${id}`,
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){
      UIkit.modal('#modal-service-delete').hide()
      getAllService()
    },
    error: function(){
      console.log('error')
    }
  })
}

function ViewSuggestion(t){
  var id = t.id.substring(15).trim()
  $.ajax({
    url: `https://localhost:44322/api/Suggestion/SuggestionTextById/${id}`,
    type:'GET',
    contentType:'application/json',
    success: function(data){
      document.getElementById('suggestion-view-text').innerHTML = data
    },
    error: function(){
      console.log('error')
    }
  })
}
function DeleteSuggestion(t){
  var id = t.id.substring(17)
  document.querySelector('.delete-suggestion-btn').id = `delete${id}`
}
function DeleteSuggestionSave(t){
  var id = t.id.substring(6).trim();
  $.ajax({
    url: `https://localhost:44322/api/Suggestion/DelSuggestion/${id}`,
    type: 'DELETE',
    contentType: 'application/json',
    success: function(data){
      UIkit.modal('#modal-suggestion-delete').hide()
      getSuggestions(1)
    },
    error: function(){
      console.log('error')
    }
  })
}

//BeforeAfter Operation
function BeforeAfteAddBtn(){
  document.querySelector('.before-image-name-add').innerHTML = 'عکس قبلی را آپلود نمایید'
  document.querySelector('.after-image-name-add').innerHTML = 'عکس بعدی را آپلود نمایید'
  document.getElementById('before-img-add').value = ''
  document.getElementById('after-img-add').value = ''
}
function BeforeImgAdd(input){
  var imgName = getFileNameFromPath(input.value);
  document.querySelector('.before-image-name-add').innerHTML = imgName
}
function AfterImgAdd(input){
  var imgName = getFileNameFromPath(input.value);
  document.querySelector('.after-image-name-add').innerHTML = imgName
}
function BeforeImgEdit(input){
  var imgName = getFileNameFromPath(input.value);
  document.querySelector('.before-image-name-edit').innerHTML = imgName
}
function AfterImgEdit(input){
  var imgName = getFileNameFromPath(input.value);
  document.querySelector('.after-image-name-edit').innerHTML = imgName
}
function AddBeforeAfterSave(){
  const beforeImg = document.getElementById('before-img-add')
  const afterImg = document.getElementById('after-img-add')
  if(beforeImg.value == ''){
    UIkit.notification('عکس قبلی رو آپلود نکردید!' , {status:'danger' , timeout: 3000} )
  }
  if(afterImg.value == ''){
    UIkit.notification('عکس بعدی رو آپلود نکردید!' , {status:'danger', timeout: 3000})
  }
  else{
    var BeforeAfterToAdd={
      beforeImgUrl : getFileNameFromPath(beforeImg.value),
      afterImgUrl : getFileNameFromPath(afterImg.value)
    }
    $.ajax({
      url: `https://localhost:44322/api/BeforeAfter/Add`,
      type:'POST',
      data: JSON.stringify(BeforeAfterToAdd),
      contentType:'application/json',
      success: function(data){
        UIkit.modal('#modal-BeforeAfter-add').hide()
        getAllBeforeAfterImg()
      },
      error: function(data){
        UIkit.modal('#modal-BeforeAfter-add').hide()
        UIkit.notification( data.responseText , {status:'danger', timeout: 3000})
      }
    })
  }
}
function EditBeforeAfter(t){
  document.querySelector('.before-image-name-edit').innerHTML = 'عکس قبلی را آپلود نمایید'
  document.querySelector('.after-image-name-edit').innerHTML = 'عکس بعدی را آپلود نمایید'
  document.getElementById('before-img-edit').value = ''
  document.getElementById('after-img-edit').value = ''
  var id = t.id.substring(16).trim()
  var images = document.querySelector('.BeforeAfter-image-edit')
  $.ajax({
    url: `https://localhost:44322/api/BeforeAfter/Get/${id}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      images.innerHTML = `<div><h4>after</h4> <div><img src="../Resources/${data.afterImgUrl}" ></div></div><div><h4>before</h4><div><img src="../Resources/${data.beforeImgUrl}"></div></div>`
      document.querySelector('.before-image-name-edit').innerHTML = data.beforeImgUrl
      document.querySelector('.after-image-name-edit').innerHTML = data.afterImgUrl
      document.querySelector('.edit-BeforeAfter-save').id = id;

    },
    error: function(){
      console.log('error')
    }
  })

}
function EditBeforeAfterSave(t){
  var id = document.querySelector('.edit-BeforeAfter-save').id;
  const beforeImg = document.getElementById('before-img-edit')
  const afterImg = document.getElementById('after-img-edit')
  if(beforeImg.value == ''){
    UIkit.notification('عکس قبلی رو آپلود نکردید!' , {status:'danger' , timeout: 3000} )
  }
  if(afterImg.value == ''){
    UIkit.notification('عکس بعدی رو آپلود نکردید!' , {status:'danger', timeout: 3000})
  }
  else{
    var BeforeAfterToEdit={
      id: id,
      beforeImgUrl : getFileNameFromPath(beforeImg.value),
      afterImgUrl : getFileNameFromPath(afterImg.value)
    }
    $.ajax({
      url: `https://localhost:44322/api/BeforeAfter/Edit`,
      type:'POST',
      data: JSON.stringify(BeforeAfterToEdit),
      contentType:'application/json',
      success: function(data){
        UIkit.modal('#modal-BeforeAfter-edit').hide()
        getAllBeforeAfterImg()
      },
      error: function(data){
        UIkit.modal('#modal-BeforeAfter-edit').hide()
        UIkit.notification( data.responseText , {status:'danger', timeout: 3000})
      }
    })
  }
}
function DeleteBeforeAfter(t){
  var id = t.id.substring(18).trim()
  var images = document.querySelector('.BeforeAfter-image-delete')

  $.ajax({
    url: `https://localhost:44322/api/BeforeAfter/Get/${id}`,
    type:'GET',
    dataType:'json',
    contentType:'application/json',
    success: function(data){
      images.innerHTML = `<div><h4>after</h4> <div><img src="../Resources/${data.afterImgUrl}" ></div></div><div><h4>before</h4><div><img src="../Resources/${data.beforeImgUrl}"></div></div>`
      document.querySelector('.delete-BeforeAfter-save').id = id;

    },
    error: function(){
      console.log('error')
    }
  })
}
function DeleteBeforeAfterSave(t){
  var id=document.querySelector(".delete-BeforeAfter-save").id;
  $.ajax({
    url: `https://localhost:44322/api/BeforeAfter/Get/${id}`,
    type:'DELETE',
    contentType:'application/json',
    success: function(data){
      UIkit.modal('#modal-BeforeAfter-delete').hide()
      getAllBeforeAfterImg()
    },
    error: function(data){
    }
  })
}
function DeleteReservation(t){
  var id = t.id.substring(18)
  document.querySelector('.delete-reservation-btn').id = id;
}
function DeleteReservationSave(t){
  var id = t.id;
  $.ajax({
    url: `https://localhost:44322/api/Reservation/Delete/${id}`,
    type:'DELETE',
    contentType:'application/json',
    success: function(data){
      UIkit.modal('#modal-reservation-delete').hide()
      getTodayReserves()
    },
    error: function(data){
    }
  })
}
function ReservationSearchBtn(){
  document.getElementById('searchReservation-FromMonth').style.borderColor = '';
  document.getElementById('searchReservation-UntilMonth').style.borderColor = '';
  document.getElementById('searchReservation-FromYear').style.borderColor = '';
  document.getElementById('searchReservation-UntilYear').style.borderColor = '';
  document.getElementById('searchReservation-FromMonth').value = '';
  document.getElementById('searchReservation-UntilMonth').value = '';
  document.getElementById('searchReservation-FromYear').value = '';
  document.getElementById('searchReservation-UntilYear').value = '';
  $('#searchReservation-FromMonth').on("input", function () {
    var input = document.getElementById('searchReservation-FromMonth')
    let num = +this.value, max = 12, min = 1;
    if (num > max || num < min) {
       input.style.borderColor = 'red'
        return false;
      }
      input.style.borderColor = ''
    })
  $('#searchReservation-UntilMonth').on("input", function () {
    var input = document.getElementById('searchReservation-UntilMonth')
    let num = +this.value, max = 12, min = 1;
    if (num > max || num < min) {
        input.style.borderColor = 'red'
        return false;
      }
      input.style.borderColor = ''
    })
  $('#searchReservation-FromYear').on("input", function () {
    var input = document.getElementById('searchReservation-FromYear')
    let num = +this.value, max = 1500, min = 1400;
    if (num > max || num < min) {
        input.style.borderColor = 'red'
        return false;
      }
      input.style.borderColor = ''
    })
  $('#searchReservation-UntilYear').on("input", function () {
    var input = document.getElementById('searchReservation-UntilYear')
    let num = +this.value, max = 1500, min = 1400;
    if (num > max || num < min) {
        input.style.borderColor = 'red'
        return false;
      }
      input.style.borderColor = ''
    })
}
function SearchReservationSave(){
  var FromYear = document.getElementById('searchReservation-FromYear')
  var UntilYear = document.getElementById('searchReservation-UntilYear')
  var FromMonth = document.getElementById('searchReservation-FromMonth')
  var UntilMonth = document.getElementById('searchReservation-UntilMonth')
  var FromDay = document.getElementById('searchReservation-FromDay')
  var UntilDay = document.getElementById('searchReservation-UntilDay')
  if(FromMonth.style.borderColor == 'red' || FromMonth.value.trim() == ''){
    return;
  }
  if(UntilMonth.style.borderColor == 'red' || UntilMonth.value.trim() == ''){
    return;
  }
  if(FromYear.style.borderColor =='red' || FromYear.value.trim() == ''){
    return;
  }
  if(UntilYear.style.borderColor == 'red' || UntilYear.value.trim() == ''){
    return;
  }
  if(FromDay.value.trim() == ''){
    return;
  }
  if(FromDay.value.trim() == '31'){
    if(parseInt(UntilMonth.value.trim()) <= 6){
      FromDay.style.borderColor = ''
    }
    else if(parseInt(UntilMonth.value.trim()) > 6){
      FromDay.style.borderColor = 'red'
      return;
    }
  }
  if(UntilDay.value.trim() == '31'){
    if(parseInt(UntilMonth.value.trim()) <= 6){
      UntilDay.style.borderColor = ''
    }
    else if(parseInt(UntilMonth.value.trim()) > 6){
      UntilDay.style.borderColor = 'red'
      return;
    }
  }
  if(FromMonth.value.trim() == '12' && FromDay.value.trim() == '30'){
    if(isKabiseYear(parseInt(FromYear.value.trim()))){
      FromDay.style.borderColor = ''
    }
    else{
      FromDay.style.borderColor = 'red'
      return;
    }
  }
  if(UntilMonth.value.trim() == '12' && UntilMonth.value.trim() == '30'){
    if(isKabiseYear(parseInt(untilYear.value.trim()))){
      UntilDay.style.borderColor = ''
    }
    else{
      UntilDay.style.borderColor = 'red'
      return;
    }
  }
  var dates ={
    fromYear: FromYear.value.trim(),
    fromMonth: FromMonth.value.trim(),
    fromDay: FromDay.value.trim(),
    untilYear: UntilYear.value.trim(),
    untilMonth: UntilMonth.value.trim(),
    untilDay: UntilDay.value.trim()
  }
  $.ajax({
    url: `https://localhost:44322/api/Reservation/GetByTimePeriod`,
    type:'POST',
    data: JSON.stringify(dates),
    contentType:'application/json',
    success: function(data){
      AddBtnDiv.innerHTML = `<a onclick="ReservationSearchBtn()" class="menu-reserve-btn uk-button uk-text-emphasis search-Reservation-btn" href="#modal-Reservation-search" uk-toggle="" role="button">جستجو براساس تاریخ<span class="uk-margin-small-right" uk-icon="search"></span></a>`
      TableDiv.innerHTML = `<table class="uk-width-1-1"><thead><th>آیدی<th>سرویس<th>تایم<th>آرایشگر<th></thead><tbody id="Reservation-tbl"></tbody></table>`
      var id = 0
      UIkit.modal('#modal-Reservation-search').hide()
      for(var i = 0; i <= data.length; i++){
        id++
        document.getElementById('Reservation-tbl').innerHTML += `<tr><td>${id}</td><td>${data[i].serviceType}</td><td>${data[i].reserveDate}</td><td>${data[i].hairStylist}</td><td><a id="reservation-delete${data[i].id}" class="uk-button uk-button-danger uk-text-emphasis menu-reserve-btn" onclick="DeleteReservation(this)" href="#modal-reservation-delete" uk-toggle="" role="button">حذف</a></td></tr>`
      }
    },
    error: function(data){
      AddBtnDiv.innerHTML = `<a onclick="ReservationSearchBtn()" class="menu-reserve-btn uk-button uk-text-emphasis search-Reservation-btn" href="#modal-Reservation-search" uk-toggle="" role="button">جستجو براساس تاریخ<span class="uk-margin-small-right" uk-icon="search"></span></a>`
      UIkit.modal('#modal-Reservation-search').hide()
      UIkit.notification( data.responseText , {status:'danger', timeout: 3000})
    }
  })

}
function extractTime(isoDateTimeString) {
  // ایجاد یک شیء Date از رشته ورودی
  const dateTime = new Date(isoDateTimeString);

  // گرفتن ساعت و دقیقه و فرمت‌بندی آنها
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');

  // ترکیب ساعت و دقیقه برای تشکیل رشته خروجی
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
}
function isKabiseYear(year) {

  if (year % 4 === 0) {
    return true; // معمولاً هر 4 سال یکبار کبیسه است
  } else if (year % 33 === 1 || year % 33 === 5 || year % 33 === 9 ||
             year % 33 === 13 || year % 33 === 17 || year % 33 === 21 ||
             year % 33 === 25 || year % 33 === 29) {
    return true; // برخی سال‌های خاص در چرخه 33 ساله نیز کبیسه هستند
  } else {
    return false;
  }
}