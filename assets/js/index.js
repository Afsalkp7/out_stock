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
        console.log(document.cookie); // Logging all cookies
        window.location.href = "/admin";
      }
      
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


