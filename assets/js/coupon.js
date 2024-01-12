const { FunctionPage } = require("twilio/lib/rest/serverless/v1/service/function");

function editButton(){
    document.getElementById("editForm").style.display="block"
}

function submitUpdatedCoupon(){
    const form = document.getElementById("editForm")
    const formData = new FormData(form);
    fetch('/admin/coupons/update', {
      method: 'PUT',
      body:JSON.stringify(Object.fromEntries(formData)),    
      headers : {'Content-Type': 'application/json',},
    })
      .then(async(response) => {    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        window.location.href=`/admin/coupons`
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}
