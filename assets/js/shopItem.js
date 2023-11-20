// // function getUrlParameter(name) {
// //     const params = new URLSearchParams(window.location.search);
// //     return params.get(name);
// // }
// // const selectedCategory = getUrlParameter('category');

// // function filterProductsByCategory(categoryName) {
// //     const allProducts = document.querySelectorAll('.hp');

// //     allProducts.forEach(product => {
// //         const productCategory = product.dataset.categoryName;

// //         if (categoryName === 'all' || productCategory === categoryName) {
// //             product.style.display = 'block'; 
// //         } else {
// //             product.style.display = 'none'; 
// //         }
// //     });
// // }

// // if (selectedCategory) {
// //     filterProductsByCategory(selectedCategory);
// // }


// // const selectedBrand = getUrlParameter('brand');
// // function filterProductsByBrand(brandName) {
// //     const allProducts = document.querySelectorAll('.hp');

// //     allProducts.forEach(product => {
// //         const productBrand = product.dataset.brandName;

// //         if (brandName === 'all' || productBrand === brandName) {
// //             product.style.display = 'block'; 
// //         } else {
// //             product.style.display = 'none'; 
// //         }
// //     });
// // }

// // if (selectedBrand) {
// //     filterProductsByBrand(selectedBrand);
// // }

function filterProductsByPrice(min, max) {
    const allProducts = document.querySelectorAll('.hp');
    allProducts.forEach(product => {
      const productPrice = parseFloat(product.dataset.price);

      if (productPrice >= min && productPrice <= max) {
        product.style.display = 'block'; 
      } else {
        product.style.display = 'none'; 
      }
    });
  }


  document.getElementById('applyFilter').addEventListener('click', function () {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    filterProductsByPrice(minPrice, maxPrice);
  });



// function getUrlParameters(name) {
//     const params = new URLSearchParams(window.location.search);
//     return params.getAll(name);
// }
// function getUrlParametersForBrands(name) {
//     const params = new URLSearchParams(window.location.search);
//     return params.getAll(name);
// }

// function filterProductsByCategories(categories) {
//     const allProducts = document.querySelectorAll('.hp');

//     allProducts.forEach(product => {
//         const productCategories = product.dataset.categoryName.split(',');

//         if (categories.includes('all') || categories.some(cat => productCategories.includes(cat))) {
//             product.style.display = 'block';
//         } else {
//             product.style.display = 'none';
//         }
//     });
// }

// function updateURLParameters(categories) {
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search);

//     params.delete('category');

//     categories.forEach(category => {
//         params.append('category', category);
//     });

//     url.search = params.toString();
//     window.history.replaceState({}, '', url);
// }
// function initializeFiltering() {
//     const checkboxes = document.querySelectorAll('input[type="checkbox"][name="category"]');

//     checkboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', function () {
//             const selectedCategories = Array.from(checkboxes)
//                 .filter(c => c.checked)
//                 .map(c => c.value);

//             updateURLParameters(selectedCategories);
//             filterProductsByCategories(selectedCategories);
//         });
//     });

//     const selectedCategories = getUrlParameters('category');

//     if (selectedCategories.length > 0) {
//         const selectedCategoriesArray = selectedCategories.flatMap(cat => cat.split(','));
//         filterProductsByCategories(selectedCategoriesArray);
//     }
// }







// function filterProductsByBrands(brands) {
//     const allProducts = document.querySelectorAll('.hp');

//     allProducts.forEach(product => {
//         const productBrands = product.dataset.brandName.split(',');

//         if (brands.includes('all') || brands.some(bran => productBrands.includes(bran))) {
//             product.style.display = 'block';
//         } else {
//             product.style.display = 'none';
//         }
//     });
// }

// function updateURLParameters(brands) {
//     const url = new URL(window.location.href);
//     const params = new URLSearchParams(url.search);

//     params.delete('brand');

//     brands.forEach(category => {
//         params.append('brand', brand);
//     });

//     url.search = params.toString();
//     window.history.replaceState({}, '', url);
// }
// function initializeFiltering() {
//     const checkboxes = document.querySelectorAll('input[type="checkbox"][name="brand"]');

//     checkboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', function () {
//             const selectedBrands = Array.from(checkboxes)
//                 .filter(c => c.checked)
//                 .map(c => c.value);

//             updateURLParameters(selectedBrands);
//             filterProductsByCategories(selectedBrands);
//         });
//     });

//     const selectedBrands = getUrlParametersForBrands('brand');

//     if (selectedBrands.length > 0) {
//         const selectedBrandsArray = selectedBrands.flatMap(cat => cat.split(','));
//         filterProductsByBrands(selectedBrandsArray);
//     }
// }
// document.addEventListener('DOMContentLoaded', initializeFiltering);


function getUrlParameters(name) {
    const params = new URLSearchParams(window.location.search);
    return params.getAll(name);
}

function filterProductsByAttributes(products, attributeType, selectedAttributes) {
    products.forEach(product => {
        const productAttributes = product.getAttribute(`data-${attributeType}`).split(',');

        if (selectedAttributes.includes('all') || selectedAttributes.some(attr => productAttributes.includes(attr))) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function updateURLParameters(attributeType, attributes) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    params.delete(attributeType);

    attributes.forEach(attr => {
        params.append(attributeType, attr);
    });

    url.search = params.toString();
    window.history.replaceState({}, '', url);
}

function initializeFiltering(attributeType) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${attributeType}"]`);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const selectedAttributes = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.value);

            updateURLParameters(attributeType, selectedAttributes);
            filterProductsByAttributes(document.querySelectorAll('.hp'), attributeType, selectedAttributes);
        });
    });

    const selectedAttributes = getUrlParameters(attributeType);

    if (selectedAttributes.length > 0) {
        const selectedAttributesArray = selectedAttributes.flatMap(attr => attr.split(','));
        filterProductsByAttributes(document.querySelectorAll('.hp'), attributeType, selectedAttributesArray);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeFiltering('category');
    initializeFiltering('brand');
});