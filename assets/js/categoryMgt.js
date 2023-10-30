
document.querySelectorAll('.showCat').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const catId = await event.target.getAttribute('data-user-id');
  
      try {
        const response = await fetch(`/admin/categories/${catId}`);
        if (response.ok) {
          const catData = await response.json();
  
          
          const categoryElement = document.getElementById('catDetails');
          categoryElement.innerHTML = `
            <p>Name: ${catData.name}</p>
            <p>Description: ${catData.description}</p>
            <p>Creates At: ${catData.createdAt}</p>
            <p>Updated At: ${catData.updatesAt}</p>
          `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(document.getElementById('catshow'));
          Modal.show();
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });



document.querySelectorAll('.editCat').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const catId = await event.target.getAttribute('data-user-id');
  
      try {
        const response = await fetch(`/admin/categories/update/${catId}`);
        if (response.ok) {
          const catData = await response.json();
  
          console.log(catData);
          const catElement = document.getElementById('catUpdateDetails');
          catElement.innerHTML = `
          <form id="updateCatForm">
          <div class="form-floating mb-3 mt-3">
          <input type="email" class="form-control" id="name" value="${catData.name}" name="name">
          </div>
        <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="floatingPassword" value="${catData.description}" name="description">
        </div>
        <div class="form-floating mb-3 mt-3">
        <input type="text" class="form-control" id="floatingPassword" hidden value="${Date.now()}" name="updatedAt">
      </div>
      <input type="hidden" name="user_id" value="${catData._id}">
      <button type="button" onclick="updateCat()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Submit</button>
    </form>
          `;
  
          // Show the modal
          const catModal = new bootstrap.Modal(document.getElementById('catEdit'));
          catModal.show();
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });


  function updateCat() {
    const form = document.getElementById("updateCatForm")
    const formData = new FormData(form);
    fetch('/admin/categories/update', {
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
        window.location.href="/admin/categories"
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // document.querySelectorAll('.deleteCategory').forEach(btn => {
  //   btn.addEventListener('click', async (event) => {
  //     const userId = await event.target.getAttribute('data-user-id');
  
  //     try {
  //       const response = await fetch(`/admin/categories/${userId}`,{
  //         method:'DELETE'
  //       });
  //       if (response.ok) {
  //         window.location.href = "/admin/categories"
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   });
  // });

  document.querySelectorAll(".deleteCategory").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const catId = await event.target.getAttribute("data-user-id");
  
      try {
        const response = await fetch(`/admin/categories/delete/${catId}`);
        if (response.ok) {
          const catData = await response.json();
  
          const categoryElement = document.getElementById("catDetails");
          categoryElement.innerHTML = `
              <h4>Confirm Delete Category Data</h4><br>
              <form id="deleteData">
                <input type="hidden" name="cat_id" value="${catData._id}">
                <button type="button" onclick="deleteCategory()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
              </form>
            `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(document.getElementById("catshow"));
          Modal.show();
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
  
  function deleteCategory() {
    const form = document.getElementById("deleteData");
    const formData = new FormData(form);
    fetch("/admin/categories/delete", {
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
        window.location.href = "/admin/brands";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
     