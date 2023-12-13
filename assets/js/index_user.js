function submitUserForm() {
  const form = document.getElementById("updateUserForm");
  const formData = new FormData(form);
  fetch("/update", {
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
      window.location.href = "/user_data";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function submitPassForm() {
  const form = document.getElementById("passChangeForm");
  const formData = new FormData(form);
  fetch("/change_password", {
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
    window.location.href = "/user_data";
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

async function deleteUser() {
  try {
    const response = await fetch(`/delete`);
    if (response.ok) {
      const userId = await response.json();
      const userDelete = document.getElementById("userDetails");
      userDelete.innerHTML = `
          <h4>Confirm delete your Account???</h4><br>
          <p> Deleting user profile will delete all about you like</p><br>
          <span>YOUR WISHLIST</span><br>
          <span>YOUR CART</span><br>
          <span>YOUR ORDERS</span><br>
          <span>YOUR ADDRESSES</span><br>
          <span>Etc.....</span><br>

          
            <h5>If you confirm delete order</h5>
            <p>Please fill the reason</p><br>
            <form id="userDelete">
            
            <textarea id="reason" name="reason" rows="4" cols="50"></textarea><br>
            <p id="reasonAknowledgment" class="text-danger"></p>
            <button type="button" onclick="return (cancelOrderValidation()&&deleteUserData())" data-bs-toggle="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
          </form>
        `;
      const Modal = new bootstrap.Modal(document.getElementById("userDelete"));
      Modal.show();
    }
  } catch (error){
    console.log(error)
}
}
async function deleteUserData() {
  await fetch("/delete", {
    method: "DELETE",
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