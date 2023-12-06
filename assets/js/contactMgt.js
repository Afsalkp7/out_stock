
async function messageSend() {
  const form = document.getElementById("contactForm");
  const formData = new FormData(form);
  console.log(formData);
  let body = Object.fromEntries(formData);

  await fetch("/contact", {
    method: "post",
    body: JSON.stringify(body),
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
    Toastify({
        text: "Message sended successfully",
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
    window.location.href="/contact"
    
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

document.querySelectorAll('.showMsg').forEach(btn => {
    btn.addEventListener('click', async (event) => {
        const msgId = await event.target.getAttribute('data-user-id');
        window.location.href=`/admin/messages/${msgId}`
    })
})


document.querySelectorAll('.deleteMsg').forEach(btn => {
    btn.addEventListener('click', async (event) => {
        const msgId = await event.target.getAttribute('data-user-id');
        const response = await fetch(`/admin/messages/delete/${msgId}`)
        if (response.ok) {
            const msgData = await response.json();
    
            const categoryElement = document.getElementById("msgDetails");
            categoryElement.innerHTML = `
              <h4>Confirm Delete Message Data</h4><br>
              <form id="deleteData">
                <input type="hidden" name="_id" value="${msgData._id}">
                <button type="button" onclick="deleteMessage()" data-bs-toggle="modal" data-bs-dismiss="modal" class="btn btn-dark text-light mt-3">Confirm Delete</button>
              </form>
            `;
            const Modal = new bootstrap.Modal(document.getElementById("msgDelete"));
            Modal.show();
          } else {
            console.error("Error fetching user data");
          }
        })
      });

function deleteMessage(){
    const form = document.getElementById("deleteData");
  const formData = new FormData(form);
  fetch("/admin/messages/delete", {
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
      window.location.href = "/admin/messages";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}