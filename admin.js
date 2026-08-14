document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("productForm");
    const productsContainer = document.getElementById("adminProductsContainer");
    const productCount = document.getElementById("productCount");

    let products = [];

    // -------------------------
    // PRODUCTS
    // -------------------------

    async function loadProducts() {

        try {

            const response = await fetch("products.json");

            if (!response.ok) {
                throw new Error("პროდუქტების ჩატვირთვა ვერ მოხერხდა.");
            }

            products = await response.json();

            // დროებითი მონაცემები Admin-ისთვის
            products = products.map(product => ({
                ...product,
                stock: product.stock ?? 10,
                sold: product.sold ?? 0
            }));

            renderProducts();

        } catch (error) {

            console.error(error);

            productsContainer.innerHTML = `
                <p>
                    პროდუქტების ჩატვირთვა ვერ მოხერხდა.
                </p>
            `;
        }
    }


    // -------------------------
    // RENDER PRODUCTS
    // -------------------------

    function renderProducts() {

        productsContainer.innerHTML = "";

        productCount.textContent =
            `${products.length} პროდუქტი`;


        if (products.length === 0) {

            productsContainer.innerHTML = `
                <p>
                    ჯერ პროდუქტი არ გაქვს დამატებული.
                </p>
            `;

            return;
        }


        products.forEach(product => {

            const revenue =
                Number(product.price) *
                Number(product.sold);


            const card = document.createElement("div");

            card.className = "admin-product-card";


            card.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="admin-product-image"
                >


                <div class="admin-product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.description || ""}
                    </p>

                    <div class="admin-product-data">

                        <span>
                            💰 ფასი:
                            <strong>
                                ${product.price} ₾
                            </strong>
                        </span>

                        <span>
                            📦 მარაგი:
                            <strong>
                                ${product.stock}
                            </strong>
                        </span>

                        <span>
                            📈 გაყიდული:
                            <strong>
                                ${product.sold}
                            </strong>
                        </span>

                        <span>
                            💵 შემოსავალი:
                            <strong>
                                ${revenue.toFixed(2)} ₾
                            </strong>
                        </span>

                    </div>


                    <div class="admin-product-actions">

                        <button
                            class="admin-edit-button"
                            data-id="${product.id}">
                            ✏️ რედაქტირება
                        </button>


                        <button
                            class="admin-delete-button"
                            data-id="${product.id}">
                            🗑️ წაშლა
                        </button>

                    </div>

                </div>

            `;


            productsContainer.appendChild(card);

        });


        addActionListeners();
    }


    // -------------------------
    // ADD PRODUCT
    // -------------------------

    form.addEventListener("submit", event => {

        event.preventDefault();


        const name =
            document.getElementById("productName").value.trim();

        const price =
            Number(
                document.getElementById("productPrice").value
            );

        const category =
            document.getElementById("productCategory").value.trim();

        const description =
            document.getElementById("productDescription").value.trim();

        const image =
            document.getElementById("productImage").value.trim();


        if (!name || !price || !category || !description || !image) {

            alert("გთხოვ შეავსო ყველა ველი.");

            return;
        }


        const newProduct = {

            id: Date.now(),

            name: name,

            price: price,

            category: category,

            description: description,

            image: image,

            stock: 10,

            sold: 0

        };


        products.push(newProduct);


        saveProductsLocally();

        renderProducts();

        form.reset();


        alert("პროდუქტი წარმატებით დაემატა.");
    });


    // -------------------------
    // EDIT / DELETE
    // -------------------------

    function addActionListeners() {


        document
            .querySelectorAll(".admin-delete-button")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id =
                        Number(button.dataset.id);


                    const confirmed =
                        confirm(
                            "ნამდვილად გინდა ამ პროდუქტის წაშლა?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    products =
                        products.filter(
                            product => product.id !== id
                        );


                    saveProductsLocally();

                    renderProducts();

                });

            });


        document
            .querySelectorAll(".admin-edit-button")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id =
                        Number(button.dataset.id);


                    const product =
                        products.find(
                            item => item.id === id
                        );


                    if (!product) {
                        return;
                    }


                    editProduct(product);

                });

            });

    }


    // -------------------------
    // EDIT PRODUCT
    // -------------------------

    function editProduct(product) {

        const name =
            prompt(
                "პროდუქტის სახელი:",
                product.name
            );


        if (name === null) {
            return;
        }


        const price =
            prompt(
                "ფასი:",
                product.price
            );


        if (price === null) {
            return;
        }


        const category =
            prompt(
                "კატეგორია:",
                product.category
            );


        if (category === null) {
            return;
        }


        const description =
            prompt(
                "აღწერა:",
                product.description
            );


        if (description === null) {
            return;
        }


        const stock =
            prompt(
                "მარაგის რაოდენობა:",
                product.stock
            );


        if (stock === null) {
            return;
        }


        product.name = name.trim();

        product.price = Number(price);

        product.category = category.trim();

        product.description =
            description.trim();

        product.stock =
            Number(stock);


        saveProductsLocally();

        renderProducts();


        alert(
            "პროდუქტი წარმატებით განახლდა."
        );

    }


    // -------------------------
    // LOCAL STORAGE
    // -------------------------

    function saveProductsLocally() {

        localStorage.setItem(
            "myShopProducts",
            JSON.stringify(products)
        );

    }


    // -------------------------
    // LOAD LOCAL DATA
    // -------------------------

    const savedProducts =
        localStorage.getItem(
            "myShopProducts"
        );


    if (savedProducts) {

        try {

            products =
                JSON.parse(savedProducts);

            renderProducts();

        } catch (error) {

            console.error(error);

            loadProducts();

        }

    } else {

        loadProducts();

    }

});
