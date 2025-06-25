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

const spausdintiKonsolej = (err, data) => {
    console. log(err ? err : data);
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
    div.innerText = elementas.title
    document.getElementById('todos-itemai').appendChild(div);
}

getTodos(spausdintiHtmle);
