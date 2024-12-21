const http = require(`node:http`);
const url = require(`node:url`)

let items = [
    { id: 1, name: `iPhone 14`, brand: `Apple`, price: 1200, stock: 10 },
    { id: 2, name: `Redmi 12`, brand: `Redmi`, price: 600, stock: 25 }
]


const server = http.createServer((request, response) => {
    if (request.method !== `GET` && request.method !== `POST`) {
        response.writeHead(405, { "content-type": "application/json" });
        return response.end(JSON.stringify({ message: `Bunday buyruqga ruxsatingiz yo'q` }))

    }
    const { pathname, query } = url.parse(request.url, true);
    if (request.method === `GET`) {

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
        } else if (request.method === `POST` && pathname === `/phones`) {
            let body = ``
            request.on(`data`, chunk => {
                body += chunk;
            });
            request.on(`end`, () => {
                try {
                    const newPhone = JSON.parse(body);
                    if (!newPhone.name || !newPhone.brand || !newPhone.price || !newPhone.stock) {
                        response.writeHead(400, { "content-type": `application/json` });
                        return response.end(JSON.stringify({ message: `Banrcha malumotlarni bering` }))
                    }

                    const newId = items.length ? items[items.length - 1].id + 1 : 1
                    const createPhone = { id: newId, ...newPhone }
                    items.push(createPhone);

                    response.writeHead(201, { "content-type": `application/json` })
                    return response.end(JSON.stringify(createPhone))
                } catch (error) {
                    response.writeHead(400, { "content-type": `application/json` });
                    return response.end(JSON.stringify({ message: `JSON da hatolik bor!!!!` }))
                }
            })

        } else if (request.method === `PUT` && pathname.startsWith(`/phones/`)) {
            const id = pathname.split(`/`)[2]
            let body = ``;

            request.setEncoding(`utf-8`);
            request.on(`data`, chunk => {
                body += chunk;
            });
            request.on(`end`, () => {

                try {
                    const newData = JSON.parse(body);
                    const phone = items.find(item => item.id.toString() === id);
                    if (!phone) {
                        response.writeHead(404, { "content-type": `application/json` });
                        return response.end(JSON.stringify({ message: `Telefon topilmadi` }))
                    }
                    const upgradePhone = { ...phone, ...newData }

                    if (!newData.name && !newData.brand && !newData.price && !newData.stock) {
                        response.writeHead(400, { "content-type": `application/json` });
                        return response.end(JSON.stringify({ message: `eng kami bitta narsani ozgarishi kerak.` }))
                    }

                    const index = items.indexOf(phone)
                    items[index] = upgradePhone;

                    response.writeHead(200, { "content-type": `application/json` });
                    return response.end(JSON.stringify(upgradePhone))
                } catch (error) {
                    response.writeHead(400, { "content-type": `application/json` })
                    return response.end(JSON.stringify({ message: `JSON da hatolik bor` }))
                }
            });
        } else if (request.method === `DELETE` && pathname.startsWith(`/phones/`)) {
            const id = pathname.split(`/`)[2];
            const phoneIndex = items.findIndex(item => item.id.toString() === id);

            if (phoneIndex !== -1) {
                const deletedPhone = items.splice(phoneIndex, 1)[0];
                response.writeHead(200, { "content-type": "application/json" });
                return response.end(JSON.stringify(deletedPhone));
            } else {
                response.writeHead(404, { "content-type": "application/json" });
                return response.end(JSON.stringify({ message: "Telefon topilmadi" }));
            }
        } else {
            response.writeHead(404, { "content-type": `application/json` })
            return response.end(JSON.stringify({ message: `topilmadi!` }));
        }
    }
});
server.listen(3000, () => {
    console.log(`Server 3000 po'rtda ishga tushdi`);
});


