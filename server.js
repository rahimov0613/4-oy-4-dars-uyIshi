const http = require(`node:http`);
const url = require(`node:url`)

let items = [
    { id: 1, name: `iPhone 14`, brand: `Apple`, price: 1200, stock: 10 },
    { id: 2, name: `Redmi 12`, brand: `Redmi`, price: 600, stock: 25 }
]


const server = http.createServer((request, response) => {
    if (request.method !== `GET`) {
        response.writeHead(405, { "content-type": "application/json" });
        return response.end(JSON.stringify({ message: `Bunday buyruqga ruxsatingiz yo'q` }))
    }

    const { pathname, query } = url.parse(request.url, true);
    if (pathname === `/items`) {
        let getPhones = items;

        if (query.brand) {
            getPhones = getPhones.filter(phone => { phone.brand.toLowerCase() === query.brand.toLowerCase() })
        }

        if (query.maxPrice) {
            const getPrice = parseFloat(query.maxPrice)
            if (!isNaN(getPrice)) {
                getPhones = getPhones.filter(phone => phone.price <= getPrice)
            }
        }

        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify(getPhones));


    } else if (pathname.startsWith(`/phones/`)) {
        const id = pathname.split(`/`)[2]
        const phone = items.find(item => item.id.toString() === id);

        if (phone) {
            response.writeHead(200, { "content-type": `application/json` })
            return response.end(JSON.stringify(phone))

        } else {
            response.writeHead(404, { "content-type": `application/json` })
            return response.end(JSON.stringify({ message: `Telefon topilmadi!` }));
        }

    } else {
        response.writeHead(404, { "content-type": `application/json` })
        return response.end(JSON.stringify({ message: `topilmadi!` }));
    }
});
server.listen(3000, () => {
    console.log(`Server 3000 po'rtda ishga tushdi`);
});


