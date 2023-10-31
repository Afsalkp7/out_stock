$(document).ready(function () {
  const logoInput = document.getElementById("logoInput");
  const croppedImage = document.getElementById("croppedImage");
  const cropButton = document.getElementById("cropButton");

  let cropper;

  // Initialize the Cropper.js instance when an image is selected
  logoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        croppedImage.src = e.target.result;
        cropper = new Cropper(croppedImage, {
          aspectRatio: 1, // Set the aspect ratio
          viewMode: 2, // Set the view mode
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle the "Crop Image" button click event
  cropButton.addEventListener("click", function () {
    const croppedData = cropper.getCroppedCanvas().toDataURL("image/jpeg");
    croppedImage.src = croppedData;
    const brandName = document.getElementById("brandName").value;
    const description = document.getElementById("description").value;

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("brandLogo", file);
    formData.append("description", description);
    formData.append("croppedImage", croppedData);
    fetch("/admin/brands", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href="/admin/brands"
        
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });
  });
});
