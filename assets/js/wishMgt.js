document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addFromWishToCartButton');
    Array.from(addToCartButtons).forEach((button) => {
        button.addEventListener('click', async() => {
        const itemId = button.getAttribute('data-item-id');
    
        const cartItem = {
            itemId: itemId,
          };
    
        await  fetch('/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
          });
        });
    });
})

document.querySelectorAll(".deleteWishItem").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const proId = await event.target.getAttribute("data-user-id");
  
      try {
        const response = await fetch(`/wish/delete/${proId}`);
        if (response.ok) {
          const productData = await response.json();
          const categoryElement = document.getElementById("productDetails");
          categoryElement.innerHTML = `
              <h4>Confirm Delete Product from wishlist</h4><br>
              <form id="deleteData">
                <input type="hidden" name="pro_id" value="${productData._id}">
                <button type="button" onclick="deleteWish()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
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

  function deleteWish() {
    const form = document.getElementById("deleteData");
    const formData = new FormData(form);
    fetch("/wish/delete", {
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
        window.location.href = "/wish";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  