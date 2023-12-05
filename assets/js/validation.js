function validateForm() {
  let brand = document.forms["myForm"]["brandName"].value;
  let logo = document.forms["myForm"]["brandLogo"].value;
  let desc = document.forms["myForm"]["description"].value;

  if (brand == "") {
    alert("Brand Name must be filled out");
    return false;
  } else if (logo == "") {
    alert("logo must be filled out");
    return false;
  } else if (desc == "") {
    alert("description must be filled out");
    return false;
  } else {
    return true;
  }
}

function validateBannerForm() {
  let bannerName = document.forms["bannerForm"]["bannerName"].value;
  let bannerImage = document.forms["bannerForm"]["bannerImage"].value;
  let status = document.forms["bannerForm"]["status"].value;
  let place = document.forms["bannerForm"]["place"].value;
  let desc = document.forms["bannerForm"]["description"].value;

  if (bannerName == "") {
    alert("Brand Name must be filled out");
    return false;
  } else if (bannerImage == "") {
    alert("logo must be filled out");
    return false;
  } else if (status == "") {
    alert("description must be filled out");
    return false;
  } else if (place == "") {
    alert("description must be filled out");
    return false;
  } else if (desc == "") {
    alert("description must be filled out");
    return false;
  } else {
    return true;
  }
}

function validateCategoryForm() {
  let name = document.forms["categoryForm"]["categoryName"].value;
  let desc = document.forms["categoryForm"]["description"].value;

  if (name == "") {
    alert("category Name must be filled out");
    return false;
  } else if (desc == "") {
    alert("description must be filled out");
    return false;
  } else {
    return true;
  }
}

function validateProductForm() {
  let productName = document.forms["ProductForm"]["productName"].value;
  let category = document.forms["ProductForm"]["category"].value;
  let image = document.forms["ProductForm"]["image"].value;
  let price = document.forms["ProductForm"]["price"].value;
  let netPrice = document.forms["ProductForm"]["netPrice"].value;
  let brand = document.forms["ProductForm"]["brand"].value;
  let quantity = document.forms["ProductForm"]["quantity"].value;
  let description = document.forms["ProductForm"]["description"].value;
  let additional = document.forms["ProductForm"]["additional"].value;

  if (productName == "") {
    alert("product Name must be filled out");
    return false;
  } else if (category == "") {
    alert("category must be filled out");
    return false;
  } else if (image == "") {
    alert("image must be filled out");
    return false;
  } else if (price == "") {
    alert("price must be filled out");
    return false;
  } else if (netPrice == "") {
    alert("netPrice must be filled out");
    return false;
  } else if (brand == "") {
    alert("brand must be filled out");
    return false;
  } else if (quantity == "") {
    alert("quantity must be filled out");
    return false;
  } else if (description == "") {
    alert("description must be filled out");
    return false;
  } else if (additional == "") {
    alert("additional must be filled out");
    return false;
  } else {
    return true;
  }
}

function registerValidation() {
  let password = document.forms["fillingForm"]["password"].value;
  let userName = document.forms["fillingForm"]["userName"].value;
  let phone = document.forms["fillingForm"]["phone"].value;
  let email = document.forms["fillingForm"]["email"].value;

  if (email == "") {
    alert("email Name must be filled out");
    return false;
  } else if (phone == "") {
    alert("phone must be filled out");
    return false;
  } else if (userName == "") {
    alert("userName must be filled out");
    return false;
  } else if (password == "") {
    alert("password must be filled out");
    return false;
  } else {
    return true;
  }
}

function checkValidation(){
  let firstName = document.forms["checkForm"]["firstName"].value
  let lastName = document.forms["checkForm"]["lastName"].value
  let email = document.forms["checkForm"]["email"].value
  let address = document.forms["checkForm"]["address"].value
  let country = document.forms["checkForm"]["country"].value
  let state = document.forms["checkForm"]["state"].value
  let pin = document.forms["checkForm"]["pin"].value
  let phone = document.forms["checkForm"]["phone"].value
  let isValidEmail = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
  let containsOnlyDigits = /^\d+$/.test(phone);

  if (firstName == "" || firstName.length<3) {
    document.getElementById("fNameAknwoledgment").style.display = "block";
    return false
  }else if(lastName == "") {
    document.getElementById("lNameAknwoledgment").style.display = "block";
    return false
  }else if(email == "" || !isValidEmail) {
    document.getElementById("emailAknwoledgment").style.display = "block";
    return false
  }else if(address == "") {
    document.getElementById("adrressAknwoledgment").style.display = "block";
    return false
  }else if(country == "") {
    document.getElementById("countryAknwoledgment").style.display = "block";
    return false
  }else if(state == "") {
    document.getElementById("stateAknwoledgment").style.display = "block";
    return false
  }else if(pin == "" || pin.length<6 || pin.length>6 || isNaN(pin)) {
    document.getElementById("pinAknwoledgment").style.display = "block";
    return false
  }else if(phone === "" || phone.length !== 10 || !containsOnlyDigits) {
    document.getElementById("phoneAknwoledgment").style.display = "block";
    return false
  }else{
    return true
  }
}


function placeOrderValidation(){
  var getSelectedValue = document.querySelector( 'input[name="paymentMethod"]:checked');
  if(getSelectedValue != null) {
    return true;
  }else {  
    document.getElementById("paymentAlert").style.display = "block";
    return false;
  }
}

function cancelOrderValidation(){
  let reason = document.getElementById("reason").value
  if(reason.length<1){
    document.getElementById("reasonAknowledgment").innerHTML="Please write reason for cancelation..."
    return false;
  }else if(reason.length<6){
    document.getElementById("reasonAknowledgment").innerHTML="Reason must be 7 or more characters..."
    return false;
  }else{
    return true;
  }
}

function validateCouponForm(){
  let couponCode = document.forms["couponForm"]["couponCode"].value;
  let couponProfit = document.forms["couponForm"]["couponProfit"].value;
  let maxDis = document.forms["couponForm"]["maxDis"].value;
  let start = document.forms["couponForm"]["startDate"].value;
  let end = document.forms["couponForm"]["endDate"].value;
  if (couponCode == ""||couponCode.length<5){
    document.getElementById("codeAknowledgment").innerHTML="Code must contain 6 or more characters"
    return false
  }else if (couponProfit == ""){
    document.getElementById("couponProfitAknowledgment").innerHTML="Please fill coupon profit column"
    return false
  }else if (start == ""){
  }else if (maxDis == ""){
    document.getElementById("maxDisAknowledgment").innerHTML="Please fill maximum discound column"
    return false
  }else if (start == ""){
    document.getElementById("startAknowledgment").innerHTML="Select a starting date"
    return false
  }else if (end == ""){
    document.getElementById("endAknowledgment").innerHTML="Select a ending date"
    return false
  }else{
    return true
  }
}
function validContact(){
  let email = document.forms["contactForm"]["email"].value;
  let name = document.forms["contactForm"]["customerName"].value;
  let msg = document.forms["contactForm"]["message"].value;
  let isValidEmail = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)

  if(email==""||!isValidEmail){
    document.getElementById("emailMessanger").innerHTML = "Put a valid email..."
    return false
  }else if (name==""||name.length<3){
    document.getElementById("nameMessanger").innerHTML = "Customer name must be include  minimum 3 characters..."
    return false
  } else if (msg==""||msg.length<6){
    document.getElementById("messageMessanger").innerHTML = "Message mustbe include minimum 6 characters..."
    return false
  } else {
    return true
  } 

}
