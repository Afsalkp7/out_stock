//PRODUCT UPDATE MAIN CROPPER

$(document).ready(function () {
    const updateProductForm = document.forms.updateProductForm;
    const updMainImage = document.getElementById("updMainImage");
    const updCroppedMainImage = document.getElementById("updCroppedMainImage");
  
    let updCropperMain;
  
    updMainImage.addEventListener("change", function (e) {
      const file = e.target.files[0];
  
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
  
            updCroppedMainImage.src = e.target.result;
            updCropperMain = new Cropper(updCroppedMainImage, {
            aspectRatio: 1, 
            viewMode: 2,
          });
        };
        reader.readAsDataURL(file);
      }
    });
  
    updateProductForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const croppedCanvas = updCropperMain.getCroppedCanvas();
  
      if (!croppedCanvas) {
  
        alert("Please crop the image before submitting.");
        return;
      }
  
      const croppedDataUrl = croppedCanvas.toDataURL("image/jpeg");
  
      const croppedImageInput = document.createElement("input");
      croppedImageInput.type = "hidden";
      croppedImageInput.name = "updCroppedMainImage";
      croppedImageInput.value = croppedDataUrl;
      updateProductForm.appendChild(croppedImageInput);
  
      updateProductForm.submit();
  });
});  
