document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL =
        "https://ullbgrogaiptphgehwky.supabase.co";

    const SUPABASE_KEY =
        "აქ ჩასვი შენი anon/public key";

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
                    await response.text()
                );
            }

            products = await response.json();

            renderProducts();

        } catch (error) {

            console.error(error);

            productsContainer.innerHTML =
                `<p>პროდუქტების ჩატვირთვა ვერ მოხერხდა.</p>`;
        }
    }


    // =========================
    // SHOW PRODUCTS
    // =========================

    function renderProducts() {

        productsContainer.innerHTML = "";

        productCount.textContent =
            `${products.length} პროდუქტი`;

        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className =
                "admin-product-card";

            card.innerHTML = `

                <img
                    src="${product.image || ""}"
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
                                ${product.stock ?? 0}
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
                            Number(button.dataset.id);

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
                    () => deleteProduct(
                        Number(button.dataset.id)
                    )
                );
            });
    }


    // =========================
    // CHANGE PRICE
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

                throw new Error(
                    await response.text()
                );
            }


            alert(
                "ფასი წარმატებით შეიცვალა."
            );

            await loadProducts();

        } catch (error) {

            console.error(error);

            alert(
                "ფასის შეცვლა ვერ მოხერხდა."
            );
        }
    }


    // =========================
    // DELETE
    // =========================

    async function deleteProduct(id) {

        if (
            !confirm(
                "ნამდვილად გინდა პროდუქტის წაშლა?"
            )
        ) {
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
                    await response.text()
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


    // =========================
    // START
    // =========================

    loadProducts();

});
