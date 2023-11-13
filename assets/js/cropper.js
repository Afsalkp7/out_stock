$(document).ready(function () {
  const myForm = document.forms.myForm;
  const logoInput = document.getElementById("logoInput");
  const croppedImage = document.getElementById("croppedImage");

  let cropper;

  logoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {

        croppedImage.src = e.target.result;
        cropper = new Cropper(croppedImage, {
          aspectRatio: 1, 
          viewMode: 2,
        });
      };
      reader.readAsDataURL(file);
    }
  });

  myForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const croppedCanvas = cropper.getCroppedCanvas();

    if (!croppedCanvas) {

      alert("Please crop the image before submitting.");
      return;
    }

    const croppedDataUrl = croppedCanvas.toDataURL("image/jpeg");

    const croppedImageInput = document.createElement("input");
    croppedImageInput.type = "hidden";
    croppedImageInput.name = "croppedImage";
    croppedImageInput.value = croppedDataUrl;
    myForm.appendChild(croppedImageInput);

    myForm.submit();
  });
});

$(document).ready(function () {
  const bannerForm = document.forms.bannerForm;
  const bannerImage = document.getElementById("bannerImage");
  const croppedImage = document.getElementById("croppedImage");

  let cropper;

  bannerImage.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {

        croppedImage.src = e.target.result;
        cropper = new Cropper(croppedImage, {
          aspectRatio: 2, 
          viewMode: 1,
        });
      };
      reader.readAsDataURL(file);
    }
  });

  bannerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const croppedCanvas = cropper.getCroppedCanvas();

    if (!croppedCanvas) {

      alert("Please crop the image before submitting.");
      return;
    }

    const croppedDataUrl = croppedCanvas.toDataURL("image/jpeg");

    const croppedImageInput = document.createElement("input");
    croppedImageInput.type = "hidden";
    croppedImageInput.name = "croppedImage";
    croppedImageInput.value = croppedDataUrl;
    bannerForm.appendChild(croppedImageInput);

    bannerForm.submit();
  });
});

