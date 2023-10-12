function submitStatus() {
    const status = document.querySelector('input[name="status"]:checked').value;
    const userId = document.querySelector('input[name="user_id"]').value;
  
    const request = new XMLHttpRequest();
    request.open('PUT', `/admin/users/update/${userId}`);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ status }));
  
    request.onload = function() {
      if (request.status === 200) {
        window.location.href = "/admin/users";
      } else {
        console.error(err);
      }
    };
  }


  // document.querySelectorAll('.deleteConfirm').forEach(btn => {
  //   btn.addEventListener('click', async (event) => {
  //   const userId = await event.target.getAttribute('data-user-id');
  //   console.log(userId);
  //   const request = new XMLHttpRequest();
  //   request.open('PUT', `/admin/users/delete/${userId}`);
  //   request.setRequestHeader('Content-Type', 'application/json');

  //   request.onload = function() {
  //     if (request.status === 200) {
  //       window.location.href = "/admin/users";
  //     } else {
  //       console.error(err);
  //     }
  //   };
  //   })})  


