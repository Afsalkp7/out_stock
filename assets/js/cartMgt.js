document.addEventListener('DOMContentLoaded', () => {
const quantityInput = document.getElementById('quantity');
const addToCartButton = document.getElementById('addToCartButton');

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
      });
    });
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
        });
      });
  });
  

  document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.getElementById('addFromWishToCartButton');
    
    addToCartButton.addEventListener('click', () => {
        const quantityValue = 1;
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
          });
        });
    });