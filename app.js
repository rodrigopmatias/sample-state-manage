let codeEl = null;
let listContainer = null;
let inputTodo = null;
let data = {};

initState({
    selected: {},
    items: [
        // {
        //     id: 0
        //     title: 'string',
        //     isDone: false
        // }
    ]
});

function initState(initialState) {
    data = {...initialState}    
    setTimeout(() =>__dispatch(), 1);
}

function state() {
    return {
        ...data
    }
}

function __dispatch() {
    codeEl.innerText = JSON.stringify(state(), null, 4);

    const ul = document.createElement('ul');
    data.items.forEach(
        (row) => {
            const li = document.createElement('li');
            li.innerHTML = [
                row.title,
                `<a href="#" onclick="destroyTodo(${row.id})">D</a>`,
                `<a href="#" onclick="selectTodo(${row.id})">S</a>`,
                `<a href="#" onclick="toogleDone(${row.id})">T</a>`,
            ].join(' - ');

            if (row.isDone) {
                li.style.textDecoration = "line-through";
            }

            ul.appendChild(li);
        }
    )

    listContainer.innerHTML = "";
    listContainer.appendChild(ul);

    inputTodo.value = data.selected.title || "";
    
    document.dispatchEvent(
        new Event(
            'stateChange', 
            {
                state: {...data}
            }
        )
    );
    saveDB(data);
}

function addTodo(title) {
    data.items.push({
        id: new Date().getTime(),
        title: title,
        isDone: false
    });

    __dispatch();
}

function selectTodo(id) {
    data.selected = {};
    data.items.forEach(
        (row) => {
            if (row.id === id) {
                data.selected = row;
            }
        }
    );

    __dispatch();
}

function changeTodo(id, title) {
    data.items = data.items.map(
        (row) => {
            if (row.id === id) {
                row.title = title;
            }

            return { ...row }
        }
    );
    __dispatch();
}

function destroyTodo(id) {
    data.items = data.items.filter(
        (row) => row.id !== id
    );

    __dispatch();
}

function toogleDone(id) {
    data.items = data.items.map(
        (row) => {
            if (row.id === id) {
                row.isDone = !row.isDone;
            }

            return {...row}
        }
    );
    __dispatch();
}

// acima controlador do estado
// abaixo minha app

(() => {
    console.log('---')
    codeEl = document.querySelector('#output');
    listContainer = document.querySelector('#listContainer');
    inputTodo = document.querySelector('#inputTodo');

    document.addEventListener('stateChange', () => {
        saveDB(state())
    });
    resetoreDB();
})();


function save() {
    if (state().selected.id) {
        changeTodo(
            state().selected.id, 
            inputTodo.value,
        );
    } else {
        addTodo(inputTodo.value);
    }
}

function saveDB(state) {
    localStorage.stateful = JSON.stringify(state);
}

function resetoreDB() {
    if (localStorage.stateful !== undefined) {
        initState(
            JSON.parse(localStorage.stateful)
        );
    }
}
