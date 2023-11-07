
document.querySelectorAll('.showBanner').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const bannerId = await event.target.getAttribute('data-user-id');
  
      try {
        const response = await fetch(`/admin/banners/${bannerId}`);
        if (response.ok) {
          const bannerData = await response.json();
  
          
          const categoryElement = document.getElementById('bannerDetails');
          categoryElement.innerHTML = `
          <img src="${bannerData.bannerImage}" alt="banner model" width="100%">
            <p>Name: ${bannerData.bannerName}</p>
            <p>Description: ${bannerData.description}</p>
            <p>Status: ${bannerData.status}</p>
            <p>Destination: ${bannerData.place}</p>
            <p>Created At : ${bannerData.Date}</p>
            <p>Expire date : ${bannerData.expirationDate}</p>
          `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(document.getElementById('bannerShow'));
          Modal.show();
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });



document.querySelectorAll('.editBanner').forEach(btn => {
    btn.addEventListener('click', async (event) => {
      const bannerId = await event.target.getAttribute('data-user-id');
  
      try {
        const response = await fetch(`/admin/banners/update/${bannerId}`);
        if (response.ok) {
          const bannerData = await response.json();
  
          console.log(bannerData);
          const catElement = document.getElementById('bannerUpdateDetails');
          catElement.innerHTML = `
          <form id="updateBannerForm">
          <div class="form-floating mb-3 mt-3">
          <input type="email" class="form-control" id="name" value="${bannerData.bannerName}" name="bannerName">
          </div>
        <div class="form-floating mb-3 mt-3">
          <input type="text" class="form-control" id="floatingPassword" value="${bannerData.description}" name="description">
        </div>
        <div class="mb-3 mt-3">
                            <label for="status">Status</label>
                            <select class="form-control" style="background-color: rgb(226, 226, 226);" id="status" placeholder="${bannerData.status}"
                                name="status">
                                <option class="bg-dark text-light" value="Enable">Enable</option>
                                <option class="bg-dark text-light" value="Disable">Disable</option>
                            </select>
                        </div>
                         <div class="mb-3 mt-3">
                            <label for="place">Destination</label>
                            <select class="form-control" style="background-color: rgb(226, 226, 226);" id="place" placeholder="${bannerData.place}"
                                name="place">
                                <option class="bg-dark text-light" value="top">Home Top Slide</option>
                                <option class="bg-dark text-light" value="center">Home Center</option>
                                <option class="bg-dark text-light" value="bottom">Home Bottom</option>
                            </select>
                        </div>
      <input type="hidden" name="banner_id" value="${bannerData._id}">
      <button type="button" onclick="updateBanner()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Submit</button>
    </form>
          `;
  
          // Show the modal
          const catModal = new bootstrap.Modal(document.getElementById('bannerEdit'));
          catModal.show();
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });


  function updateBanner() {
    const form = document.getElementById("updateBannerForm")
    const formData = new FormData(form);
    fetch('/admin/banners/update', {
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
        window.location.href="/admin/banners"
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  document.querySelectorAll(".deleteBanner").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const bannerId = await event.target.getAttribute("data-user-id");
  
      try {
        const response = await fetch(`/admin/banners/delete/${bannerId}`);
        if (response.ok) {
          const bannerData = await response.json();
  
          const categoryElement = document.getElementById("bannerDetails");
          categoryElement.innerHTML = `
              <h4>Confirm Delete Banner Data</h4><br>
              <form id="deleteData">
                <input type="hidden" name="banner_id" value="${bannerData._id}">
                <button type="button" onclick="deleteBanner()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
              </form>
            `;
  
          // Show the modal
          const Modal = new bootstrap.Modal(document.getElementById("bannerShow"));
          Modal.show();
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
  
  function deleteBanner() {
    const form = document.getElementById("deleteData");
    const formData = new FormData(form);
    fetch("/admin/banners/delete", {
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
        window.location.href = "/admin/banners";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
     