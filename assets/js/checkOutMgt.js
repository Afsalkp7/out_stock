function fillAddressFields(firstName, lastName, email, phone, address, address2, country, state, pin, id) {
    document.getElementById('firstName').value = firstName;
    document.getElementById('lastName').value = lastName;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
    document.getElementById('address').value = address;
    document.getElementById('address2').value = address2;
    document.getElementById('country').value = country;
    document.getElementById('state').value = state;
    document.getElementById('pin').value = pin;
    document.getElementById('id').value = id;
}


  document.querySelectorAll(".deleteAddress").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const adrId = await event.target.getAttribute("data-id");
  
      try {
        const response = await fetch(`/checkout/delete/${adrId}`);
        if (response.ok) {
          const addressData = await response.json();
          const categoryElement = document.getElementById("addressDetails");
          categoryElement.innerHTML = `
                <h4>Confirm Delete this address</h4><br>
                <form id="deleteData">
                  <input type="hidden" name="adr_id" value="${addressData._id}">
                  <button type="button" onclick="deleteAddress()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
                </form>
              `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(
            document.getElementById("addressDeleteShow")
          );
          Modal.show();
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
  function deleteAddress() {
    const form = document.getElementById("deleteData");
    const formData = new FormData(form);
    fetch("/checkout", {
      method: "DELETE",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.reload()
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  document.querySelectorAll(".deleteAddressFromUser").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const adrId = await event.target.getAttribute("data-id");
  
      try {
        const response = await fetch(`/myAddresses/delete/${adrId}`);
        if (response.ok) {
          const addressData  = await response.json();
          const categoryElement = document.getElementById("addressDetails");
          categoryElement.innerHTML = `
                <h4>Confirm Delete this address</h4><br>
                <form id="deleteData">
                  <input type="hidden" name="adr_id" value="${addressData._id}">
                  <button type="button" onclick="deleteAddressFromUser()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
                </form>
              `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(
            document.getElementById("addressDeleteShow")
          );
          Modal.show();
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });

  function deleteAddressFromUser() {
    const form = document.getElementById("deleteData");
    const formData = new FormData(form);
    fetch("/myAddresses", {
      method: "DELETE",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.reload("/")
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

async function redeem(){
  const grandTotal = document.getElementById("grandTotal").textContent
  console.log(grandTotal);
  const code = document.getElementById("couponCode").value
  try {
    const response = await fetch(`/checkout/coupon/${code}`);
    if (response.ok){
      const couponData = await response.json();
      console.log(couponData);
      let discound;
      let grandToCheck;
      if (couponData.couponType == "%"){
        discound = parseInt((grandTotal*couponData.couponProfit)/100);
        console.log(discound);
        if (discound > couponData.maxDis){
          grandToCheck = grandTotal - couponData.maxDis
        }else{
          grandToCheck = grandTotal - discound
        }
        console.log(grandToCheck);
      }
      fetch("/checkout", {
        method: "POST",
        body: JSON.stringify({
          grandToCheck,
          discound
        }),
        headers: { "Content-Type": "application/json" },
      })

    }
    
  } catch (error) {
    console.log(error);
  }

}