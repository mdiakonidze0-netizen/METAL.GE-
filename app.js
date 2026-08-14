document.addEventListener("DOMContentLoaded", () => {

    const productsContainer =
        document.getElementById("productsContainer");

    const searchInput =
        document.getElementById("searchInput");

    const categoriesContainer =
        document.getElementById("categories");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const menuButton =
        document.getElementById("menuButton");

    const navigation =
        document.querySelector(".navigation");

    const languageSelect =
        document.getElementById("languageSelect");


    let products = [];
    let selectedCategory = "all";

    let currentLanguage =
        localStorage.getItem("metalLanguage") || "ka";


    // =========================
    // LANGUAGES
    // =========================

    const translations = {

        ka: {

            navProducts: "პროდუქტები",
            navAbout: "ჩვენ შესახებ",
            navContact: "კონტაქტი",

            heroLabel: "კეთილი იყოს თქვენი მობრძანება",
            heroTitle: "იპოვე ის, რასაც ეძებ",
            heroText:
                "დაათვალიერე ჩვენი პროდუქტები და აირჩიე შენთვის სასურველი ნივთი.",
            viewProducts: "პროდუქტების ნახვა",

            ourSelection: "ჩვენი არჩევანი",
            products: "პროდუქტები",
            productsText:
                "აირჩიე სასურველი პროდუქტი ჩვენი კატალოგიდან.",

            searchPlaceholder:
                "მოძებნე პროდუქტი...",

            all: "ყველა",

            emptyProducts:
                "პროდუქტი ვერ მოიძებნა.",

            aboutLabel: "ჩვენ შესახებ",
            aboutTitle: "მარტივი და მოსახერხებელი",
            aboutText:
                "ჩვენი მიზანია მომხმარებელს შევთავაზოთ ხარისხიანი პროდუქტები მარტივი და მოსახერხებელი გზით.",

            contactLabel: "დაგვიკავშირდი",
            contactTitle: "კონტაქტი",
            contactText:
                "თუ რაიმე კითხვა გაქვს, დაგვიკავშირდი.",

            details: "დეტალურად",

            price: "ფასი",
            loading: "პროდუქტები იტვირთება...",
            loadingError:
                "პროდუქტების ჩატვირთვა ვერ მოხერხდა.",

            footer:
                "© 2026 METAL.GE"
        },


        en: {

            navProducts: "Products",
            navAbout: "About Us",
            navContact: "Contact",

            heroLabel: "Welcome",
            heroTitle: "Find what you're looking for",
            heroText:
                "Browse our products and choose the item you like.",
            viewProducts: "View Products",

            ourSelection: "Our Selection",
            products: "Products",
            productsText:
                "Choose your favorite product from our catalog.",

            searchPlaceholder:
                "Search products...",

            all: "All",

            emptyProducts:
                "No products found.",

            aboutLabel: "About Us",
            aboutTitle: "Simple and Convenient",
            aboutText:
                "Our goal is to offer customers quality products in a simple and convenient way.",

            contactLabel: "Get in Touch",
            contactTitle: "Contact",
            contactText:
                "If you have any questions, feel free to contact us.",

            details: "Details",

            price: "Price",
            loading: "Loading products...",
            loadingError:
                "Failed to load products.",

            footer:
                "© 2026 METAL.GE"
        },


        ru: {

            navProducts: "Товары",
            navAbout: "О нас",
            navContact: "Контакты",

            heroLabel: "Добро пожаловать",
            heroTitle: "Найди то, что ищешь",
            heroText:
                "Посмотрите наши товары и выберите подходящий для вас.",
            viewProducts: "Посмотреть товары",

            ourSelection: "Наш выбор",
            products: "Товары",
            productsText:
                "Выберите понравившийся товар из нашего каталога.",

            searchPlaceholder:
                "Поиск товара...",

            all: "Все",

            emptyProducts:
                "Товары не найдены.",

            aboutLabel: "О нас",
            aboutTitle: "Просто и удобно",
            aboutText:
                "Наша цель — предложить клиентам качественные товары простым и удобным способом.",

            contactLabel: "Свяжитесь с нами",
            contactTitle: "Контакты",
            contactText:
                "Если у вас есть вопросы, свяжитесь с нами.",

            details: "Подробнее",

            price: "Цена",
            loading: "Загрузка товаров...",
            loadingError:
                "Не удалось загрузить товары.",

            footer:
                "© 2026 METAL.GE"
        }

    };


    // =========================
    // TRANSLATE PAGE
    // =========================

    function translatePage() {

        const language =
            translations[currentLanguage];

        document.documentElement.lang =
            currentLanguage;


        // Normal text

        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {

                const key =
                    element.dataset.i18n;

                if (language[key]) {
                    element.textContent =
                        language[key];
                }

            });


        // Placeholders

        document
            .querySelectorAll("[data-i18n-placeholder]")
            .forEach(element => {

                const key =
                    element.dataset.i18nPlaceholder;

                if (language[key]) {
                    element.placeholder =
                        language[key];
                }

            });


        // Page title

        document.title =
            "METAL.GE";


        // Update product cards

        if (products.length > 0) {
            displayProducts();
        }

    }


    // =========================
    // LANGUAGE SELECTOR
    // =========================

    if (languageSelect) {

        languageSelect.value =
            currentLanguage;

        languageSelect.addEventListener(
            "change",
            () => {

                currentLanguage =
                    languageSelect.value;

                localStorage.setItem(
                    "metalLanguage",
                    currentLanguage
                );

                translatePage();

                createCategories();

            }
        );

    }


    // =========================
    // MOBILE MENU
    // =========================

    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            () => {

                navigation.classList.toggle(
                    "active"
                );

            }
        );

    }


    // =========================
    // LOAD PRODUCTS
    // =========================

    async function loadProducts() {

        try {

            const response =
                await fetch("products.json");

            if (!response.ok) {
                throw new Error(
                    "Products loading failed"
                );
            }

            products =
                await response.json();

            createCategories();
            displayProducts();

        } catch (error) {

            console.error(error);

            productsContainer.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px;
                ">
                    <p>
                        ${translations[currentLanguage].loadingError}
                    </p>
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

                ${translations[currentLanguage].all}

            </button>

        `;


        categories.forEach(category => {

            const button =
                document.createElement("button");

            button.className =
                "category-button";

            button.dataset.category =
                category;

            button.textContent =
                translateCategory(category);

            categoriesContainer.appendChild(
                button
            );

        });


        const categoryButtons =
            categoriesContainer
                .querySelectorAll(
                    ".category-button"
                );


        categoryButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    categoryButtons.forEach(
                        btn => {
                            btn.classList.remove(
                                "active"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    selectedCategory =
                        button.dataset.category;

                    displayProducts();

                }
            );

        });

    }


    // =========================
    // CATEGORY TRANSLATION
    // =========================

    function translateCategory(category) {

        const categories = {

            "მაისური": {
                ka: "მაისური",
                en: "T-Shirt",
                ru: "Футболка"
            },

            "შარვალი": {
                ka: "შარვალი",
                en: "Pants",
                ru: "Брюки"
            },

            "ფეხსაცმელი": {
                ka: "ფეხსაცმელი",
                en: "Shoes",
                ru: "Обувь"
            },

            "ტანსაცმელი": {
                ka: "ტანსაცმელი",
                en: "Clothing",
                ru: "Одежда"
            }

        };


        if (
            categories[category] &&
            categories[category][currentLanguage]
        ) {

            return categories[category][currentLanguage];

        }


        return category;

    }


    // =========================
    // DISPLAY PRODUCTS
    // =========================

    function displayProducts() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredProducts =
            products.filter(product => {

                const name =
                    (product.name || "")
                        .toLowerCase();

                const description =
                    (product.description || "")
                        .toLowerCase();


                const matchesSearch =
                    name.includes(searchText) ||
                    description.includes(searchText);


                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        productsContainer.innerHTML = "";


        if (
            filteredProducts.length === 0
        ) {

            emptyMessage.style.display =
                "block";

            return;

        }


        emptyMessage.style.display =
            "none";


        filteredProducts.forEach(
            product => {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "product-card";


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
                            ${translateCategory(
                                product.category || ""
                            )}
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

                                ${translations[currentLanguage].details}

                            </button>

                        </div>

                    </div>

                `;


                productsContainer.appendChild(
                    card
                );

            }
        );


        // Product buttons

        const productButtons =
            document.querySelectorAll(
                ".product-button"
            );


        productButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const productId =
                            button.dataset.product;


                        const product =
                            products.find(
                                item =>
                                    item.id ==
                                    productId
                            );


                        if (product) {

                            alert(

                                `${product.name}\n\n` +
                                `${translations[currentLanguage].price}: ` +
                                `${product.price} ₾\n\n` +
                                `${product.description || ""}`

                            );

                        }

                    }
                );

            }
        );

    }


    // =========================
    // SEARCH
    // =========================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                displayProducts();

            }
        );

    }


    // =========================
    // START
    // =========================

    translatePage();

    loadProducts();

});
