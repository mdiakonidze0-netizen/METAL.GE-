document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.getElementById("productsContainer");
    const searchInput = document.getElementById("searchInput");
    const categoriesContainer = document.getElementById("categories");
    const emptyMessage = document.getElementById("emptyMessage");
    const menuButton = document.getElementById("menuButton");
    const navigation = document.querySelector(".navigation");

    let products = [];
    let selectedCategory = "all";


    // =========================
    // MOBILE MENU
    // =========================

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            navigation.classList.toggle("active");
        });
    }


    // =========================
    // LOAD PRODUCTS
    // =========================

    async function loadProducts() {
        try {
            const response = await fetch("products.json");

            if (!response.ok) {
                throw new Error("პროდუქტების ჩატვირთვა ვერ მოხერხდა.");
            }

            products = await response.json();

            createCategories();
            displayProducts();

        } catch (error) {
            console.error(error);

            productsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                    <p>პროდუქტების ჩატვირთვა ვერ მოხერხდა.</p>
                </div>
            `;
        }
    }


    // =========================
    // CREATE CATEGORIES
    // =========================

    function createCategories() {

        const categories = [
            ...new Set(
                products
                    .map(product => product.category)
                    .filter(category => category)
            )
        ];

        categoriesContainer.innerHTML = `
            <button
                class="category-button active"
                data-category="all">
                ყველა
            </button>
        `;

        categories.forEach(category => {

            const button = document.createElement("button");

            button.className = "category-button";
            button.dataset.category = category;
            button.textContent = category;

            categoriesContainer.appendChild(button);
        });


        const categoryButtons =
            categoriesContainer.querySelectorAll(".category-button");

        categoryButtons.forEach(button => {

            button.addEventListener("click", () => {

                categoryButtons.forEach(btn => {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                selectedCategory = button.dataset.category;

                displayProducts();
            });

        });
    }


    // =========================
    // DISPLAY PRODUCTS
    // =========================

    function displayProducts() {

        const searchText =
            searchInput.value.toLowerCase().trim();


        const filteredProducts = products.filter(product => {

            const matchesSearch =
                product.name.toLowerCase().includes(searchText) ||
                (product.description || "")
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch && matchesCategory;
        });


        productsContainer.innerHTML = "";


        if (filteredProducts.length === 0) {

            emptyMessage.style.display = "block";

            return;

        }


        emptyMessage.style.display = "none";


        filteredProducts.forEach(product => {

            const card = document.createElement("article");

            card.className = "product-card";


            card.innerHTML = `

                <div class="product-image-wrapper">

                    <img
                        class="product-image"
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>


                <div class="product-info">

                    <div class="product-category">
                        ${product.category || ""}
                    </div>


                    <h3 class="product-name">
                        ${product.name}
                    </h3>


                    <p class="product-description">
                        ${product.description || ""}
                    </p>


                    <div class="product-bottom">

                        <span class="product-price">
                            ${product.price} ₾
                        </span>


                        <button
                            class="product-button"
                            data-product="${product.id}">
                            დეტალურად
                        </button>

                    </div>

                </div>
            `;


            productsContainer.appendChild(card);

        });


        // Product buttons

        const productButtons =
            document.querySelectorAll(".product-button");


        productButtons.forEach(button => {

            button.addEventListener("click", () => {

                const productId = button.dataset.product;

                const product =
                    products.find(item => item.id == productId);


                if (product) {

                    alert(
                        `${product.name}\n\nფასი: ${product.price} ₾\n\n${product.description || ""}`
                    );

                }

            });

        });

    }


    // =========================
    // SEARCH
    // =========================

    if (searchInput) {

        searchInput.addEventListener("input", () => {
            displayProducts();
        });

    }


    // =========================
    // START
    // =========================

    loadProducts();

});
