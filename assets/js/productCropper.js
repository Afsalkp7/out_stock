// // // for 1 st image

// // const imageInput1 = document.getElementById("image1");
// //   const cropperContainer1 = document.getElementById("cropperContainer1");
// //   const cropperImage1 = document.getElementById("cropperImage1");

// //   let cropper1;
// //   imageInput1.addEventListener("change", function (e) {
// //     const file = e.target.files[0];

// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = function (e) {
// //         cropperImage1.src = e.target.result;
// //         cropper1 = new Cropper(cropperImage1, {
// //           aspectRatio: 1, // Set the aspect ratio (adjust to your needs)
// //           viewMode: 2, // Set the view mode (adjust to your needs)
// //         });
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   });

// //   //for 2nd image

// //   const imageInput2 = document.getElementById("image2");
// //   const cropperContainer2 = document.getElementById("cropperContainer2");
// //   const cropperImage2 = document.getElementById("cropperImage2");

// //   let cropper2;
// //   imageInput2.addEventListener("change", function (e) {
// //     const file = e.target.files[1];

// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = function (e) {
// //         cropperImage2.src = e.target.result;
// //         cropper2 = new Cropper(cropperImage2, {
// //           aspectRatio: 1, // Set the aspect ratio (adjust to your needs)
// //           viewMode: 2, // Set the view mode (adjust to your needs)
// //         });
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   });


// //   //for 3rd image 

// //   const imageInput3 = document.getElementById("image3");
// //   const cropperContainer3 = document.getElementById("cropperContainer3");
// //   const cropperImage3 = document.getElementById("cropperImage3");

// //   let cropper3;
// //   imageInput3.addEventListener("change", function (e) {
// //     const file = e.target.files[2];

// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = function (e) {
// //         cropperImage3.src = e.target.result;
// //         cropper3 = new Cropper(cropperImage3, {
// //           aspectRatio: 1, // Set the aspect ratio (adjust to your needs)
// //           viewMode: 2, // Set the view mode (adjust to your needs)
// //         });
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   });


// //   // for 4 th image 

// //   const imageInput4 = document.getElementById("image4");
// //   const cropperContainer4 = document.getElementById("cropperContainer4");
// //   const cropperImage4 = document.getElementById("cropperImage4");

// //   let cropper4;
// //   imageInput4.addEventListener("change", function (e) {
// //     const file = e.target.files[3];

// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = function (e) {
// //         cropperImage4.src = e.target.result;
// //         cropper4 = new Cropper(cropperImage4, {
// //           aspectRatio: 1, // Set the aspect ratio (adjust to your needs)
// //           viewMode: 2, // Set the view mode (adjust to your needs)
// //         });
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   });


// //   //for 5th image 

// //   const imageInput5 = document.getElementById("image5");
// //   const cropperContainer5 = document.getElementById("cropperContainer5");
// //   const cropperImage5 = document.getElementById("cropperImage5");

// //   let cropper5;
// //   imageInput5.addEventListener("change", function (e) {
// //     const file = e.target.files[4];

// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = function (e) {
// //         cropperImage5.src = e.target.result;
// //         cropper5 = new Cropper(cropperImage5, {
// //           aspectRatio: 1,
// //           viewMode: 2,
// //         });
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   });


// //   const form = document.querySelector("form");
// //   form.addEventListener("submit", function (e) {
// //     // Prevent the default form submission
// //     e.preventDefault();

// //     // Get the cropped data for the first image
// //     const croppedData1 = cropper1.getCroppedCanvas().toDataURL("image/jpeg");
// //     const croppedData2 = cropper2.getCroppedCanvas().toDataURL("image/jpeg");
// //     const croppedData3 = cropper3.getCroppedCanvas().toDataURL("image/jpeg");
// //     const croppedData4 = cropper4.getCroppedCanvas().toDataURL("image/jpeg");
// //     const croppedData5 = cropper5.getCroppedCanvas().toDataURL("image/jpeg");

// //     // Update the hidden input field for the first cropped image
// //     const croppedInput1 = document.createElement("input");
// //     croppedInput1.type = "hidden";
// //     croppedInput1.name = "croppedImage1"; // Adjust the name based on your backend
// //     croppedInput1.value = croppedData1;
// //     form.appendChild(croppedInput1);

// //     const croppedInput2 = document.createElement("input");
// //     croppedInput2.type = "hidden";
// //     croppedInput2.name = "croppedImage2"; // Adjust the name based on your backend
// //     croppedInput2.value = croppedData2;
// //     form.appendChild(croppedInput2);

// //     const croppedInput3 = document.createElement("input");
// //     croppedInput3.type = "hidden";
// //     croppedInput3.name = "croppedImage3"; // Adjust the name based on your backend
// //     croppedInput3.value = croppedData3;
// //     form.appendChild(croppedInput3);

// //     const croppedInput4 = document.createElement("input");
// //     croppedInput4.type = "hidden";
// //     croppedInput4.name = "croppedImage4"; // Adjust the name based on your backend
// //     croppedInput4.value = croppedData4;
// //     form.appendChild(croppedInput4);

// //     const croppedInput5 = document.createElement("input");
// //     croppedInput5.type = "hidden";
// //     croppedInput5.name = "croppedImage5"; // Adjust the name based on your backend
// //     croppedInput5.value = croppedData5;
// //     form.appendChild(croppedInput5);

// //     // Repeat this block for other image inputs (image2, image3, etc.)

// //     // Now submit the form with the updated hidden inputs
// //     form.submit();
// //   });

// document.addEventListener("DOMContentLoaded",() => {
//     const imageInput = document.getElementById("image");
//     const ImageContainer = document.getElementById("ImageContainer");
//     let croppers = [];
//     imageInput.addEventListener("change", (e) => {
//       const input = e.target;
//       const files = input.files;
//       croppers.forEach(cropper => cropper.destroy());
//       croppers = [];
//       for (let i = 0; i < files.length; i++) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           const img = document.createElement('img');
//           img.src = event.target.result;
//           ImageContainer.appendChild(img);
//           const cropper = new Cropper(img, {
//             aspectRatio: 1,
//             viewMode: 2,
//           });
//           croppers.push(cropper);
//         };
//         reader.readAsDataURL(files[i]);
//       }
//     });
//     const productAddForm = document.getElementById("ProductForm");
//     productAddForm.addEventListener("submit",async(event) => {
//         event.preventDefault();
//       const croppedDataArray = [];
//       croppers.forEach(cropper => {
//         const croppedCanvas = cropper.getCroppedCanvas();
//         if (croppedCanvas) {
//           croppedDataArray.push(croppedCanvas.toDataURL('image/jpeg'));
//         }
//       });

//       const formData = new FormData(ProductForm);
//       formData.append('croppedDataArray', JSON.stringify(croppedDataArray));

//       try {
//         const response = await fetch("/admin/products", {
//           method: "POST",
//           body: formData,
//         });
    
//         if (response.ok) {
//           // Handle success, e.g., redirect to another page
//           console.log("Data sent successfully");
//         } else {
//           // Handle errors
//           console.error("Failed to send data");
//         }
//       } catch (error) {
//         console.error("Error sending data:", error);
//       }
//     });
//     });