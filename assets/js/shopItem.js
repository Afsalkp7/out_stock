function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}
const selectedCategory = getUrlParameter('category');

function filterProductsByCategory(categoryName) {
    const allProducts = document.querySelectorAll('.hp');

    allProducts.forEach(product => {
        const productCategory = product.dataset.categoryName;

        if (categoryName === 'all' || productCategory === categoryName) {
            product.style.display = 'block'; 
        } else {
            product.style.display = 'none'; 
        }
    });
}

if (selectedCategory) {
    filterProductsByCategory(selectedCategory);
}


const selectedBrand = getUrlParameter('brand');
function filterProductsByBrand(brandName) {
    const allProducts = document.querySelectorAll('.hp');

    allProducts.forEach(product => {
        const productBrand = product.dataset.brandName;

        if (brandName === 'all' || productBrand === brandName) {
            product.style.display = 'block'; 
        } else {
            product.style.display = 'none'; 
        }
    });
}

if (selectedBrand) {
    filterProductsByBrand(selectedBrand);
}

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