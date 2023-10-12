function submitForm() {
  const form = document.getElementById("updateForm")
  const formData = new FormData(form);
  fetch('/admin/update', {
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
      if (document.cookie.includes("editse")) {
        console.log(document.cookie);
        window.location.href = "/admin";
      }
      
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


document.querySelectorAll('.showUser').forEach(btn => {
  btn.addEventListener('click', async (event) => {
    const userId = await event.target.getAttribute('data-user-id');

    try {
      const response = await fetch(`/admin/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();

        
        const userDetailsElement = document.getElementById('userDetails');
        userDetailsElement.innerHTML = `
          <p>User Name: ${userData.userName}</p>
          <p>Email: ${userData.email}</p>
          <p>Phone Number: ${userData.phone}</p>
          <p>Status: ${userData.status}</p>
        `;

        // Show the modal
        const userModal = new bootstrap.Modal(document.getElementById('usershow'));
        userModal.show();
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});


document.querySelectorAll('.editUser').forEach(btn => {
  btn.addEventListener('click', async (event) => {
    const userId = await event.target.getAttribute('data-user-id');

    try {
      const response = await fetch(`/admin/users/update/${userId}`); // Send a request to the server
      if (response.ok) {
        const userData = await response.json();

        
        const userDetailsElement = document.getElementById('userDetails');
        userDetailsElement.innerHTML = `
        <div class="form-floating mb-3 mt-3">
        <input type="email" class="form-control" id="Input" value="${userData.email}" placeholder="name@example.com" readonly>
        </div>
      <div class="form-floating mb-3 mt-3">
        <input type="text" class="form-control" id="floatingPassword" value="${userData.userName}" placeholder="User Name" readonly>
      </div>
      <div class="form-floating mb-3 mt-3">
      <input type="text" class="form-control" id="floatingPassword" value="${userData.phone}" placeholder="Phone Number" readonly>
    </div>
    <form id="updateUserForm">
    <div class="form-check">
      <input type="radio" class="form-check-input" id="radio1" name="status" value="active" checked>
      <label class="form-check-label" for="radio1">Active</label>
    </div>
    <div class="form-check">
      <input type="radio" class="form-check-input" id="radio2" name="status" value="block">
      <label class="form-check-label" for="radio2">Block</label>
    </div>
    <input type="hidden" name="user_id" value="${userData._id}">
    <button type="button" onclick="submitStatus()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Submit Status</button>
  </form>
        `;

        // Show the modal
        const userModal = new bootstrap.Modal(document.getElementById('usershow'));
        userModal.show();
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

function submitForm() {
  const form = document.getElementById("updateForm")
  const formData = new FormData(form);
  fetch('/admin/update', {
    method: 'PUT',
    body:JSON.stringify(Object.fromEntries(formData)),    
    headers : {'Content-Type': 'application/json',},
  })

}

document.querySelectorAll('.deleteUser').forEach(btn => {
  btn.addEventListener('click', async (event) => {
    const userId = await event.target.getAttribute('data-user-id');

    try {
      const response = await fetch(`/admin/users/delete/${userId}`);
      if (response.ok) {
      //   const userData = await response.json();
        window.location.href = "/admin/users"
      //   // const userDetailsElement = document.getElementById('userDetails');
      //   // userDetailsElement.innerHTML =`<p>are you confirm delete the user with user name${userData.userName}</p><br>
      //   // <button type="button" data-bs-toggle="modal" data-bs-dismiss="modal" data-user-id="${userData._id}" class="deleteConfirm btn btn-dark text-light mt-3">Delete Now</button>`
      //   // const userModal = new bootstrap.Modal(document.getElementById('usershow'));
      //   // userModal.show();
      // } else {
      //   console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});




