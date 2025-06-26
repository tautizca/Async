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
    // Pridedame produktui nuotrauka ir pavadinima
    // img.src yra nuotraukos adresas, o span.innerText yra produkto pavadinimas
    // div yra pagrindinis HTML elementas, kuriame bus produktas
    img.src = produktas.thumbnail;
    img.alt = produktas.title;
    span.innerText = produktas.title;
    // Pridedame nuotrauka ir pavadinima i pagrindini HTML elementa
    div.appendChild(img);
    div.appendChild(span);
    // ir pridedame klase 'img-item', kad galetume stilizuoti su CSS
    div.classList.add('img-item');

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

// Naudojame fetch API, kad gauti produktus
// fetch grazina Promise, todel naudojame .then() metodus
fetch('https://dummyjson.com/products')
// Atsakymas yra JSON, todel naudojame .json() metoda, kad gauti JavaScript objekta
.then(atsakymas => atsakymas.json())
// Tada gauname produktus is atsakymo ir perduodame juos i spausdintiProduktus funkcija
.then(res => spausdintiProduktus(res.products));


