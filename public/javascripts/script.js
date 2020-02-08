const sort_buttons = document.getElementsByName('sortType');
sort_buttons.forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('sort-form').submit();
    });
    button.checked = sort_type === button.value;
});

const items = document.querySelectorAll('li');
items.forEach(item => {
    const btnEdit = item.querySelector('input[name="btnEdit"]');
    btnEdit.addEventListener('click',() => editItem(item.id));
    const btnDel = item.querySelector('input[name="btnDel"]');
    btnDel.addEventListener('click',() => deleteItem(item.id));
});

function editItem(id) {
    // TODO edit
    const item = document.getElementById(id);
    item.appendChild(document.createElement('input'));
}

function deleteItem(id) {
    const request = new XMLHttpRequest();
    request.open('POST', '/delete', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.addEventListener('load', () => {
        const item = document.getElementById(id);
        item.remove();
    });
    request.send(JSON.stringify({id: id}));
}