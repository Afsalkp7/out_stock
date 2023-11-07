function validateForm() {
  let brand = document.forms["myForm"]["brandName"].value;
  let logo = document.forms["myForm"]["logo"].value;
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
