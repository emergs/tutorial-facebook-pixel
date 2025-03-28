const productsList = [];
const CACHE_KEY = "products_facebook_pixel";

window.addEventListener("load", async function () {
    const cache = this.localStorage.getItem(CACHE_KEY);
    if (cache) {
        const { products } = JSON.parse(cache);
        productsList.push(...products)
    }
    if (productsList.length == 0) {
        await this.fetch("https://dummyjson.com/products?limit=10")
            .then(data => data.json())
            .then(data => {
                productsList.push(...data.products);
                this.localStorage.setItem(CACHE_KEY, JSON.stringify({ products: data.products }));
            })
    }

    populatePageWithProducts();
});

function populatePageWithProducts() {
    const listProducts = document.querySelector('#products ul');

    productsList.forEach((product) => {
        const li = document.createElement('li');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const name = document.createElement('p');
        const price = document.createElement('p');
        const btnAddToCard = document.createElement('button');

        img.src = product.thumbnail;
        img.alt = product.title;
        name.textContent = product.title;
        price.textContent = `R$ ${product.price}`;
        btnAddToCard.textContent = "Comprar";
        btnAddToCard.onclick = function () {
            sendEventFacebookPixel(
                'AddToCart',
                {
                    content_ids: product.id,
                    content_type: 'product',
                    content_name: product.title,
                    contents: [{ 'sku': product.sku }],
                    currency: 'BRL'
                }
            )
        }

        figure.append(img);
        li.append(figure, name, price, btnAddToCard);
        listProducts.append(li);
    });
}

function sendEventFacebookPixel(eventType, data = "") {
    if (typeof eventType != "string") {
        console.error("eventType cannot be null")
    }
    if (data != "")
        fbq('track', eventType, data);
    else
        fbq('track', eventType);
}

