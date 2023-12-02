document.addEventListener('DOMContentLoaded', () => {
const quantityInput = document.getElementById('quantity');
const addToCartButton = document.getElementById('addToCartButton');
if (addToCartButton){
  addToCartButton.addEventListener('click', () => {
    const quantityValue = quantityInput.value;
    const itemId = addToCartButton.getAttribute('data-item-id');

    const cartItem = {
        itemId: itemId,
        quantity: quantityValue
      };

      fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartItem)
      })
      .then((response)=>{
        if(response.ok) {
          Toastify({
            text: "Item Added to cart successfully",
            duration: 1000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "black",
            },
            
          }).showToast();

          window.location.reload="/"
        }
      })
    });  
}

});

document.querySelectorAll(".deleteCartItem").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const proId = await event.target.getAttribute("data-user-id");

    try {
      const response = await fetch(`/cart/delete/${proId}`);
      if (response.ok) {
        const productData = await response.json();
        const categoryElement = document.getElementById("productDetails");
        categoryElement.innerHTML = `
            <h4>Confirm Delete Product from cart</h4><br>
            <form id="deleteData">
              <input type="hidden" name="pro_id" value="${productData._id}">
              <button type="button" onclick="deleteCart()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
            </form>
          `;

        // Show the modal
        const Modal = new bootstrap.Modal(document.getElementById("productShow"));
        Modal.show();
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});


function deleteCart() {
  const form = document.getElementById("deleteData");
  const formData = new FormData(form);
  fetch("/cart/delete", {
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
      window.location.href = "/cart";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const addToWishButton = document.getElementById('addToWishButton');
  if(addToWishButton){
    addToWishButton.addEventListener('click', () => {
      const itemId = addToWishButton.getAttribute('data-item-id');
      const wishItem = {
          itemId: itemId,
        };
  
        fetch('/wish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(wishItem)
        })
        .then((response)=>{
          if(response.ok) {
            Toastify({
              text: "Item Added to wishlist successfully",
              duration: 1000,
              destination: "https://github.com/apvarun/toastify-js",
              newWindow: true,
              close: true,
              gravity: "top", 
              position: "center", 
              stopOnFocus: true, 
              style: {
                background: "black",
              },
              
            }).showToast();
            window.location.reload="/"
          }
        })
      });
  }

  });

document.addEventListener('DOMContentLoaded', function() {
  const length = (document.getElementById("len").textContent)
  const priceElements = document.querySelectorAll(".price1");
  const qtyElements = document.querySelectorAll(".qty");
  const sumElements = document.querySelectorAll(".sum");
  console.log(length);
  for (let i = 0; i < length; i++) {
    console.log(priceElements[i].textContent);
    const price =  parseFloat(priceElements[i].textContent);
    const quantity = parseInt(qtyElements[i].value);
    sumElements[i].textContent = price * quantity || 0 ;
  }
  let totalAmt = 0;
  for (let i=0 ; i<length ; i++) {
    const sum = parseFloat(sumElements[i].textContent)
    totalAmt += sum || 0; 
  
  }

    const total = document.getElementById("total");
    total.textContent = totalAmt;
    const grandTotal = document.getElementById("grandTotal");
    const discound = document.getElementById("discound");
    let grand = parseInt(total.textContent) - parseInt(discound.textContent)
    grandTotal.textContent = grand
    document.getElementById("grandToCheck").value = grand
})



function updateQuantity(id,change){
  const product = document.querySelector(`input.qty[data-user-id="${id}"]`);
  const sum = document.querySelector(`.sum[data-user-id="${id}"]`)
  const amount = document.querySelector(`.price1[data-user-id="${id}"]`)
  const total = document.getElementById("total");
  const grandTotal = document.getElementById("grandTotal");
  const discound = document.getElementById("discound");
  let newTotal = parseInt(total.textContent) + (parseInt(amount.textContent)*change)
  let newQuantity = parseInt(product.value) + change;
  newQuantity = Math.max(0, newQuantity);
  if(newQuantity === 0){
    return
  }else{
    fetch('/cart/updateQuantity', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId:id, newQuantity }),
    })
    let newSum  = parseInt(amount.textContent) * newQuantity;
    product.value = newQuantity;
    sum.textContent = newSum;
    total.textContent = newTotal
    let grand = parseInt(total.textContent) - parseInt(discound.textContent)
    grandTotal.textContent = grand
    document.getElementById("grandToCheck").value = grand
  } 
}
