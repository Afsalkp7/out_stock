// document.querySelectorAll('.showOrder').forEach(btn => {
//     btn.addEventListener('click', async (event) => {
//       const ordId = await event.target.getAttribute('data-user-id');
//       await fetch(`/admin/orders/${ordId}`);

// try {
//   const response =
//   if (response.ok) {
//     const orderData = await response.json();

// const categoryElement = document.getElementById('orderDetails');
// categoryElement.innerHTML = `
// <p>Order id : ${orderData._id}
// <p>User id : ${orderData.userId}
// <p>Address id : ${orderData.addressId}
//   <p>Amount: ${orderData.totalAmount}</p>
//   <p>Payment : ${orderData.paymentId}</p>
//   <p>Status : ${orderData.orderStatus}</p>
//   <p>Ordered At: ${orderData.orderedDate}</p>
//   <p>Delivery At: ${orderData.deliveryDate}</p>
// `;

// // Show the modal
// const Modal = new bootstrap.Modal(document.getElementById('ordershow'));
// Modal.show();
// } else {
//   console.error('Error fetching user data');
// }
// } catch (error) {
//   console.error('Error:', error);
// }
//   });
// });

document.querySelectorAll(".editOrder").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const orderId = await event.target.getAttribute("data-user-id");

    try {
      const response = await fetch(`/admin/orders/update/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        const catElement = document.getElementById("orderUpdateDetails");
        catElement.innerHTML = `
            <form id="updateorderForm">
                <label for="orderStatus" class="form-label">select order status</label>
                <select class="form-select" id="orderStatus" name="orderStatus">
                  <option>Order Placed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Canceled</option>
                </select>
                <input type="text" class="form-control" id="floatingPassword" hidden value="${Date.now()}" name="updatedAt">
                <input type="hidden" name="_id" value="${orderData._id}">
                <button type="button" onclick="updateOrder()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Submit</button>
            </form>
          `;

        // Show the modal
        const catModal = new bootstrap.Modal(
          document.getElementById("orderEdit")
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

function updateOrder() {
  const form = document.getElementById("updateorderForm");
  const formData = new FormData(form);
  fetch("/admin/orders/update", {
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
      window.location.href = "/admin/orders";
    })
    .catch((error) => {
      console.error("Error:", error);
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

document.querySelectorAll(".deleteOrder").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const orderId = await event.target.getAttribute("data-user-id");

    try {
      const response = await fetch(`/admin/orders/delete/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();

        const categoryElement = document.getElementById("orderDetails");
        categoryElement.innerHTML = `
          <h4>Confirm Delete order Data</h4><br>
          <form id="deleteData">
            <input type="hidden" name="_id" value="${orderData._id}">
            <button type="button" onclick="deleteOrder()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
          </form>
        `;
        const Modal = new bootstrap.Modal(document.getElementById("ordershow"));
        Modal.show();
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

function deleteOrder() {
  const form = document.getElementById("deleteData");
  const formData = new FormData(form);
  fetch("/admin/orders/delete", {
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
      window.location.href = "/admin/orders";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// use cancel order

const button = document.getElementById("cancelBtn");
button.addEventListener("click", async (event) => {
  const orderId = await event.target.getAttribute("data-order-id");
  console.log(orderId);
  try {
    const response = await fetch(`/myOrders/cancel/${orderId}`);
    if (response.ok) {
      const orderData = await response.json();
      const orderCancelation = document.getElementById("orderDetails");
      orderCancelation.innerHTML = `
          <h4>Confirm Cancel order Data</h4><br>
          <form id="cancelData">
          <p><label for="reason">Reason for cancelation:</label></p>
            <textarea id="reason" name="reason" rows="4" cols="50"></textarea><br>
            <p id="reasonAknowledgment" class="text-danger"></p>
            <input type="hidden" name="_id" value="${orderData._id}">
            <button type="button" onclick="return (cancelOrderValidation()&&cancelOrder()())" data-bs-toggle="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
          </form>
        `;
      const Modal = new bootstrap.Modal(document.getElementById("orderCancel"));
      Modal.show();
    }
  } catch (error) {
    console.error("Error:", error);
  }
});



function cancelOrder() {
  const form = document.getElementById("cancelData");
  const formData = new FormData(form);
  fetch("/myOrders/cancel", {
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
    window.location.reload("/")
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}