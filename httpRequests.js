const getTodos = (callback) => {
    const request = new XMLHttpRequest ()

    request.addEventListener('readystatechange', () => {
        if(request. readyState == 4 && request. status === 200) {
            const apdorotiDuomenys = JSON.parse(request.responseText)
            callback(undefined, apdorotiDuomenys)
        } else if (request. readyState === 4) {
            callback('Nepavyko gauti duomenų.', undefined)
        }
    });

    request.open('GET', 'https://jsonplaceholder.typicode.com/todos/');
    request.send();
}

const spausdintiHtmle = (klaida, duomenys) => {
    if (klaida) {
        document.getElementById('klaidos').innerText = klaida;

        return;
    }

    duomenys.forEach(sukurtiTodoElementa);
}

const sukurtiTodoElementa = (elementas) => {
    const div = document.createElement('div');
    div.innerText = `${elementas.id} ) ${elementas.title}`;
    document.getElementById('todos-itemai').appendChild(div);
}

//getTodos(spausdintiHtmle);



// --------------------------------------------------------------------------------------
// ------------------------ Antra diena JS ASYNC ----------------------------------------
// --------------------------------------------------------------------------------------

// Funkcija, kuri sukuria HTML elementa produktui
// Priima produktą kuri gavome is API JSON, kaip argumentą ir grąžina HTML elementą
const sukurtiProdukta = (produktas) => {
    const div = document.createElement('div')
    const img = document.createElement('img');
    const span = document.createElement('span')
    const button = document.createElement('button');
    // Pridedame produktui nuotrauka ir pavadinima
    // img.src yra nuotraukos adresas, o span.innerText yra produkto pavadinimas
    // div yra pagrindinis HTML elementas, kuriame bus produktas
    img.src = produktas.thumbnail;
    img.alt = produktas.title;
    span.innerHTML = produktas.title + '<br/> [ Price: $' + produktas.price + ' ]';
    button.innerText = '🛒 Add to Cart';

    // Pridedame mygtuka, kuris bus naudojamas pirkti produktą
    button.addEventListener('click', () => {
        // Kai paspaudziamas mygtukas, pridedame produkto id prie localStorage cart krepselio
        addToCart(produktas);  

        // Kuriam dialoga kuriame bus informuojama kad produktas idetas i
        showProductAddedDialog(produktas);
    });

    // Pridedame nuotrauka ir pavadinima i pagrindini HTML elementa
    div.appendChild(img);
    div.appendChild(span);
    div.appendChild(button);
    // ir pridedame klase 'product-item', kad galetume stilizuoti su CSS
    div.classList.add('product-item');

    return div;
}

// Sukamas ciklas per produktus ir sukuriamas HTML elementas kiekvienam produktui
const spausdintiProduktus = (sarasas) => {

    // Is viso saraso paimame tik pirmus 20 produktu
    for( let i = 0; i < 20; i++) {
        // is saraso pasiimame i-taji elementa
        const sarasoElementas = sarasas[i];

        // sukuriame HTML elementa pagal saraso elementa
        const elementas = sukurtiProdukta(sarasoElementas);

        // ir ji pridedame prie HTML elemento su id 'produktai'
        document.getElementById('produktai').appendChild(elementas);
    };
}

// Funkcija, kuri sukuria modalą, kuris informuoja, kad produktas buvo pridėtas į krepšelį
// Priima produktą, kuris buvo pridėtas į krepšelį, kaip argumentą
function showProductAddedDialog(produktas) {
    const dialog = document.createElement("dialog");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const closeButton = document.createElement("button");

    h2.innerText = produktas.title;
    p.innerText = 'Product has been added to your cart!';
    closeButton.innerText = 'X';
    closeButton.classList.add('modal-close-btn');

    dialog.appendChild(h2);
    dialog.appendChild(p);
    dialog.appendChild(closeButton);
    dialog.classList.add('modal-dialog');
    document.body.appendChild(dialog);

    // Uždaryti modalą paspaudus mygtuką
    // Pridedame mygtukui event listener, kuris uždarys modalą
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    // Uždaryti modalą paspaudus už jo ribų
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
            dialog.remove();
        }
    });

    // Atidarome modalą
    dialog.showModal();
}

// Funkcija, kuri prideda produkto id prie localStorage krepselio
// Naudojame localStorage, kad išsaugotume krepselio prekes
function addToCart(produktas) {
    localStorage.setItem('cart', JSON.stringify([...JSON.parse(localStorage.getItem('cart') || '[]'), produktas.id]));
}

// Funkcija, kuri atidaro modalą su krepšelio turiniu
function showCartContents() {
    const dialog = document.createElement("dialog");
    const h2 = document.createElement("h2");
    const ul = document.createElement("ul");
    const closeButton = document.createElement("button");

    h2.innerText = 'Your Cart';
    closeButton.innerText = 'X';
    closeButton.classList.add('modal-close-btn');

    // Gauti krepselio prekes is localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    // Jei krepselis tuscias, informuojame apie tai
    if (cartItems.length === 0) {
        ul.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        // Pridedame kiekviena preke i lista
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.innerText = `Product ID: ${item}`;
            ul.appendChild(li);
        });
    }

    dialog.appendChild(h2);
    dialog.appendChild(ul);
    dialog.appendChild(closeButton);
    dialog.classList.add('modal-dialog');
    document.body.appendChild(dialog);

    // Uždaryti modalą paspaudus mygtuką
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    // Uždaryti modalą paspaudus už jo ribų
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
            dialog.remove();
        }
    });

    // Atidarome modalą
    dialog.showModal();
}

// Naudojame fetch API, kad gauti produktus
// fetch grazina Promise, todel naudojame .then() metodus
fetch('https://dummyjson.com/products')
// Atsakymas yra JSON, todel naudojame .json() metoda, kad gauti JavaScript objekta
.then(atsakymas => atsakymas.json())
// Tada gauname produktus is atsakymo ir perduodame juos i spausdintiProduktus funkcija
.then(res => spausdintiProduktus(res.products));

// Event listeneris Local Storage krepselio ikonai
document.getElementById('krepselis').addEventListener('click', () => {
    // Atidarome modalą su krepšelio turiniu
    showCartContents();
});
