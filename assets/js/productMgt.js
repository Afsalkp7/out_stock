document.querySelectorAll('.showProduct').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const productId = await event.target.getAttribute('data-user-id');
  
      try {
        const response = await fetch(`/admin/products/${productId}`);
        if (response.ok) {
          const productData = await response.json(); 
          const categoryElement = document.getElementById('productDetails');
          categoryElement.innerHTML = `
          <img src="${productData.images[0]}" width="30%" alt="images">
          <img src="${productData.images[1]}" width="30%" alt="images">
          <img src="${productData.images[2]}" width="30%" alt="images">
          <p>Name : ${productData.productName}</p><br>
          <p>Description : ${productData.description}</p><br>
          <p>additional : ${productData.additional}</p><br>
          <p>brand : ${productData.brand}</p><br>
          <p>price : ${productData.price}</p><br>
          <p>net_price : ${productData.net_price}</p><br>
          <p>category : ${productData.category}</p><br>
          <p>quantity : ${productData.quantity}</p><br>
          <p>rating : ${productData.rating}</p><br>
          <p>reviews : ${productData.reviews}</p><br>
          <p>dateCreated : ${productData.dateCreated}</p><br>
          `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(document.getElementById('productShow'));
          Modal.show();
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });


  document.querySelectorAll('.editProduct').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const productId = await event.target.getAttribute('data-user-id');
  
      try {
        const response = await fetch(`/admin/products/update/${productId}`);
        if (response.ok) {
          const productData = await response.json();
  
          console.log(productData);
          const catElement = document.getElementById('productDetails');
          catElement.innerHTML = `
          <form id="updateProductForm">
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="name" value="${productData.productName}" name="productName">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="desc" value="${productData.description}" name="productName">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="additional" value="${productData.additional}" name="additional">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="brand" value="${productData.brand}" name="brand">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="price" value="${productData.price}" name="price">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="net_price" value="${productData.net_price}" name="net_price">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="category" value="${productData.category}" name="category">
          </div>
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="quantity" value="${productData.quantity}" name="quantity">
          </div>
      <input type="hidden" name="product_id" value="${productData._id}">
      <button type="button" onclick="updateProduct()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Submit</button>
    </form>
          `;
  
          // Show the modal
          const catModal = new bootstrap.Modal(document.getElementById('productShow'));
          catModal.show();
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });


  function updateProduct() {
    const form = document.getElementById("updateProductForm")
    const formData = new FormData(form);
    fetch('/admin/products/update', {
      method: 'PUT',
      body:JSON.stringify(Object.fromEntries(formData)),    
      headers : {'Content-Type': 'application/json',},
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        window.location.href="/admin/products"
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  document.querySelectorAll(".deleteProduct").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const proId = await event.target.getAttribute("data-user-id");
  
      try {
        const response = await fetch(`/admin/products/delete/${proId}`);
        if (response.ok) {
          const productData = await response.json();
          const categoryElement = document.getElementById("productDetails");
          categoryElement.innerHTML = `
              <h4>Confirm Delete Product Data</h4><br>
              <form id="deleteData">
                <input type="hidden" name="pro_id" value="${productData._id}">
                <button type="button" onclick="deleteProduct()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
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
  
  function deleteProduct() {
    const form = document.getElementById("deleteData");
    const formData = new FormData(form);
    fetch("/admin/products/delete", {
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
        window.location.href = "/admin/products";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }