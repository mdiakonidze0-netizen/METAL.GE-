document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL =
        "https://ullbgrogaiptphgehwky.supabase.co";

    const SUPABASE_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbGJncm9nYWlwdHBoZ2Vod2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzU4MzcsImV4cCI6MjEwMjMxMTgzN30.N-r40FFmV1nmUZYEuvJ8ToTEmFB0RgCK1AxsDoNvIXs";


    const form =
        document.getElementById("productForm");

    const productsContainer =
        document.getElementById("adminProductsContainer");

    const productCount =
        document.getElementById("productCount");


    let products = [];


    // =========================
    // LOAD PRODUCTS
    // =========================

    async function loadProducts() {

        try {

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/Produqt?select=*`,
                {
                    method: "GET",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`
                    }
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "LOAD ERROR:",
                    errorText
                );

                throw new Error(
                    "Products loading failed"
                );
            }


            products =
                await response.json();


            renderProducts();


        } catch (error) {

            console.error(error);

            if (productsContainer) {

                productsContainer.innerHTML = `
                    <p>
                        პროდუქტების ჩატვირთვა ვერ მოხერხდა.
                    </p>
                `;

            }

        }

    }


    // =========================
    // RENDER PRODUCTS
    // =========================

    function renderProducts() {

        if (!productsContainer) {
            return;
        }


        productsContainer.innerHTML = "";


        if (productCount) {

            productCount.textContent =
                `${products.length} პროდუქტი`;

        }


        if (products.length === 0) {

            productsContainer.innerHTML = `
                <p>
                    პროდუქტი ჯერ არ არის.
                </p>
            `;

            return;

        }


        products.forEach(product => {

            const card =
                document.createElement("div");


            card.className =
                "admin-product-card";


            card.innerHTML = `

                <img
                    src="${product.Image || ""}"
                    alt="${product.name || ""}"
                    class="admin-product-image"
                >


                <div class="admin-product-info">

                    <h3>
                        ${product.name || ""}
                    </h3>


                    <p>
                        ${product.description || ""}
                    </p>


                    <div class="admin-product-data">

                        <span>
                            💰 ფასი:
                            <strong>
                                ${product.price ?? 0} ₾
                            </strong>
                        </span>


                        <span>
                            📦 მარაგი:
                            <strong>
                                ${product.Stock ?? 0}
                            </strong>
                        </span>

                    </div>


                    <div class="admin-product-actions">

                        <button
                            class="admin-edit-button"
                            data-id="${product.id}">
                            ✏️ ფასის შეცვლა
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


    // =========================
    // ADD PRODUCT
    // =========================

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const name =
                    document
                        .getElementById("productName")
                        .value
                        .trim();


                const price =
                    Number(
                        document
                            .getElementById("productPrice")
                            .value
                    );


                const category =
                    document
                        .getElementById("productCategory")
                        .value
                        .trim();


                const description =
                    document
                        .getElementById("productDescription")
                        .value
                        .trim();


                const stock =
                    Number(
                        document
                            .getElementById("productStock")
                            .value
                    );


                if (!name) {

                    alert(
                        "შეიყვანე პროდუქტის სახელი."
                    );

                    return;

                }


                if (
                    Number.isNaN(price) ||
                    price < 0
                ) {

                    alert(
                        "შეიყვანე სწორი ფასი."
                    );

                    return;

                }


                if (
                    Number.isNaN(stock) ||
                    stock < 0
                ) {

                    alert(
                        "შეიყვანე სწორი მარაგი."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(
                            `${SUPABASE_URL}/rest/v1/Produqt`,
                            {
                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "apikey":
                                        SUPABASE_KEY,

                                    "Authorization":
                                        `Bearer ${SUPABASE_KEY}`,

                                    "Prefer":
                                        "return=representation"
                                },

                                body: JSON.stringify({

                                    name: name,

                                    price: price,

                                    Category: category,

                                    description:
                                        description,

                                    Image: "",

                                    Stock: stock

                                })

                            }
                        );


                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        console.error(
                            "INSERT ERROR:",
                            errorText
                        );


                        alert(
                            "პროდუქტი ვერ დაემატა.\n\n" +
                            errorText
                        );

                        return;

                    }


                    form.reset();


                    document
                        .getElementById(
                            "productStock"
                        )
                        .value = 10;


                    alert(
                        "პროდუქტი წარმატებით დაემატა."
                    );


                    await loadProducts();


                } catch (error) {

                    console.error(error);


                    alert(
                        "პროდუქტის დამატება ვერ მოხერხდა."
                    );

                }

            }
        );

    }


    // =========================
    // BUTTONS
    // =========================

    function addActionListeners() {


        document
            .querySelectorAll(".admin-edit-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        const product =
                            products.find(
                                item =>
                                    Number(item.id) === id
                            );


                        if (product) {

                            editPrice(product);

                        }

                    }
                );

            });


        document
            .querySelectorAll(".admin-delete-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        deleteProduct(id);

                    }
                );

            });

    }


    // =========================
    // EDIT PRICE
    // =========================

    async function editPrice(product) {

        const price =
            prompt(
                "ახალი ფასი:",
                product.price
            );


        if (price === null) {
            return;
        }


        const newPrice =
            Number(price);


        if (
            Number.isNaN(newPrice) ||
            newPrice < 0
        ) {

            alert(
                "შეიყვანე სწორი ფასი."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/Produqt?id=eq.${product.id}`,
                    {
                        method: "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`,

                            "Prefer":
                                "return=minimal"

                        },

                        body: JSON.stringify({

                            price: newPrice

                        })

                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "UPDATE ERROR:",
                    errorText
                );


                alert(
                    "ფასი ვერ შეიცვალა.\n\n" +
                    errorText
                );

                return;

            }


            await loadProducts();


            alert(
                "ფასი წარმატებით შეიცვალა."
            );


        } catch (error) {

            console.error(error);

            alert(
                "ფასის შეცვლა ვერ მოხერხდა."
            );

        }

    }


    // =========================
    // DELETE PRODUCT
    // =========================

    async function deleteProduct(id) {

        const confirmed =
            confirm(
                "ნამდვილად გინდა ამ პროდუქტის წაშლა?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/Produqt?id=eq.${id}`,
                    {
                        method: "DELETE",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`

                        }

                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "DELETE ERROR:",
                    errorText
                );


                alert(
                    "პროდუქტი ვერ წაიშალა.\n\n" +
                    errorText
                );

                return;

            }


            await loadProducts();


        } catch (error) {

            console.error(error);


            alert(
                "პროდუქტის წაშლა ვერ მოხერხდა."
            );

        }

    }


    // =========================
    // START
    // =========================

    loadProducts();

});
