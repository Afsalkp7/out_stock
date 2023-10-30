document.querySelectorAll(".showBrand").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const brandId = await event.target.getAttribute("data-user-id");

    try {
      const response = await fetch(`/admin/brands/${brandId}`);
      if (response.ok) {
        const brandData = await response.json();

        const categoryElement = document.getElementById("brandDetails");
        categoryElement.innerHTML = `
          <img src="/img/uploads/${brandData.logo.data}" alt="logo"> 
            <p>Name: ${brandData.brandName}</p>
            <p>Description: ${brandData.description}</p>
            <p>Creates At: ${brandData.date}</p>
            
          `;

        // Show the modal
        const Modal = new bootstrap.Modal(document.getElementById("brandShow"));
        Modal.show();
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

document.querySelectorAll(".editBrand").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const brandId = await event.target.getAttribute("data-user-id");

    try {
      const response = await fetch(`/admin/brands/update/${brandId}`);
      if (response.ok) {
        const brandData = await response.json();

        console.log(brandData);
        const catElement = document.getElementById("brandDetails");
        catElement.innerHTML = `
          <form id="updateBrandForm">
          <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="name" value="${
            brandData.brandName
          }" name="brandName">
          </div>
        <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="floatingPassword" value="${
            brandData.description
          }" name="description">
        </div>
        <div class="form-floating mb-3 mt-3">
        <input type="text" class="form-control" id="floatingPassword" hidden value="${Date.now()}" name="updateAt">
      </div>
      <input type="hidden" name="brand_id" value="${brandData._id}">
      <button type="button" onclick="updateBrand()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Submit</button>
    </form>
          `;

        // Show the modal
        const catModal = new bootstrap.Modal(
          document.getElementById("brandShow")
        );
        catModal.show();
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

function updateBrand() {
  const form = document.getElementById("updateBrandForm");
  const formData = new FormData(form);
  fetch("/admin/brands/update", {
    method: "PUT",
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

// document.querySelectorAll('.deleteBrand').forEach(btn => {
//   btn.addEventListener('click', async (event) => {
//     const brandId = await event.target.getAttribute('data-user-id');

//     try {
//       const response = await fetch(`/admin/brands/${brandId}`,{
//         method:'DELETE'
//       });
//       if (response.ok) {
//         window.location.href = "/admin/brands"
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   });
// });

document.querySelectorAll(".deleteBrand").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const brandId = await event.target.getAttribute("data-user-id");

    try {
      const response = await fetch(`/admin/brands/delete/${brandId}`);
      if (response.ok) {
        const brandData = await response.json();

        const categoryElement = document.getElementById("brandDetails");
        categoryElement.innerHTML = `
            <h4>Confirm Delete Brand Data</h4><br>
            <form id="deleteData">
              <input type="hidden" name="brand_id" value="${brandData._id}">
              <button type="button" onclick="deleteBrand()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
            </form>
          `;

        // Show the modal
        const Modal = new bootstrap.Modal(document.getElementById("brandShow"));
        Modal.show();
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

function deleteBrand() {
  const form = document.getElementById("deleteData");
  const formData = new FormData(form);
  fetch("/admin/brands/delete", {
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

   
