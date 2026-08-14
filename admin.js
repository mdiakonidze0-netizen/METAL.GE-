document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL =
        "https://ullbgrogaiptphgehwky.supabase.co";

    const SUPABASE_KEY =
        "YOUR_SUPABASE_KEY";

    const form =
        document.getElementById("productForm");

    const productsContainer =
        document.getElementById("adminProductsContainer");

    const productCount =
        document.getElementById("productCount");

    let products = [];


    // =========================
    // LOAD PRODUCTS FROM SUPABASE
    // =========================

    async function loadProducts() {

        try {

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/products?select=*`,
                {
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Supabase products loading failed"
                );
            }

            products = await response.json();

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


    // =========================
    // RENDER
    // =========================

    function renderProducts() {

        productsContainer.innerHTML = "";

        productCount.textContent =
            `${products.length} პროდუქტი`;

        products.forEach(product => {

            const revenue =
                Number(product.price || 0) *
                Number(product.sold || 0);

            const card =
                document.createElement("div");

            card.className =
                "admin-product-card";

            card.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="admin-product-image"
                >

                <div class="admin-product-info">

                    <h3>${product.name}</h3>

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
                                ${product.stock || 0}
                            </strong>
                        </span>

                        <span>
                            📈 გაყიდული:
                            <strong>
                                ${product.sold || 0}
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


    // =========================
    // EDIT / DELETE
    // =========================

    function addActionListeners() {

        document
            .querySelectorAll(".admin-edit-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);

                        const product =
                            products.find(
                                item =>
                                    Number(item.id) === id
                            );

                        if (product) {
                            editProduct(product);
                        }

                    }
                );
            });


        document
            .querySelectorAll(".admin-delete-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            Number(button.dataset.id);

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
                                    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
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
                                throw new Error(
                                    "Delete failed"
                                );
                            }

                            await loadProducts();

                        } catch (error) {

                            console.error(error);

                            alert(
                                "პროდუქტის წაშლა ვერ მოხერხდა."
                            );
                        }

                    }
                );
            });
    }


    // =========================
    // EDIT PRODUCT
    // =========================

    async function editProduct(product) {

        const price =
            prompt(
                "ფასი:",
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

            alert("შეიყვანე სწორი ფასი.");

            return;
        }


        try {

            const response =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`,
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

                console.error(errorText);

                throw new Error(
                    "Price update failed"
                );
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
    // START
    // =========================

    loadProducts();

});
