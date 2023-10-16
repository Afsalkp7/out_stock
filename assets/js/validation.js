function validateForm() {
    let brand = document.forms["myForm"]["brandName"].value;
    let logo = document.forms["myForm"]["logo"].value;
    let date = document.forms["myForm"]["date"].value;
    let desc = document.forms["myForm"]["description"].value;
    
    if (brand == "") {
      alert("Brand Name must be filled out");
      return false;
    }else if( logo == ""){
        alert("logo must be filled out")
        return false;
    }else if( date == ""){
        alert("date must be filled out")
        return false;
    }else if( desc == ""){
        alert("description must be filled out")
        return false;
    }else{
        return true;
    }
  }