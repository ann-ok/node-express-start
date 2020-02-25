const sort_value = ['id-asc', 'id-desc', 'text-asc', 'text-desc'];
const sort_text = ['По возрастанию номера', 'По убыванию номера', 'По алфавиту', 'По алфавиту в обратном порядке'];

createListSortButton();

function createListSortButton() {
    const sort_buttons = document.createElement('ul');
    let html = '';
    for (let i = 0; i < sort_value.length; i++) {
        html += `<li><label><input type=\"radio\" name=\"sortType\" 
                value='${sort_value[i]}'>${sort_text[i]}</label></li>`;
    }
    sort_buttons.innerHTML = html;
    document.getElementById('sort-form').appendChild(sort_buttons);
}

const sort_buttons = document.getElementsByName('sortType');
sort_buttons.forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('sort-form').submit();
    });
    button.checked = sort_type === button.value;
});

const items = document.querySelectorAll('#list-item > li');
items.forEach(item => {
    const btnEdit = item.querySelector('input[name="btnEdit"]');
    btnEdit.addEventListener('click', () => editItem(item.id));
    const btnDel = item.querySelector('input[name="btnDel"]');
    btnDel.addEventListener('click', () => deleteItem(item.id));
});

function editItem(id) {
    const item = document.getElementById(id);
    item.querySelector('span[name="all"]').style.display = 'none';

    const text = item.querySelector('span[name="text"]').textContent;

    const editArea = document.createElement('span');
    editArea.setAttribute('name', 'editArea');

    editArea.innerHTML = `<input name="text" value="${text}">`;

    const btnOk = document.createElement('input');
    btnOk.type = 'button';
    btnOk.name = 'btnOk';
    btnOk.value = 'Ок';
    btnOk.addEventListener('click', function () {
        editOk(id);
    });
    editArea.appendChild(btnOk);

    const btnCancel = document.createElement('input');
    btnCancel.type = 'button';
    btnCancel.name = 'btnCancel';
    btnCancel.value = 'Отмена';
    btnCancel.addEventListener('click', function () {
        removeEdit(id);
    });
    editArea.appendChild(btnCancel);

    item.appendChild(editArea);
}

function editOk(id) {
    const item = document.getElementById(id);
    if (item.querySelector('input[name="text"]').value !== '') {
        post('/notes/' + id,
            (content) => item.querySelector('span[name="text"]').textContent
                = content.text,
            {id: id, text: item.querySelector('input[name="text"]').value}
        );
    }
    removeEdit(id);
}

function removeEdit(id) {
    const item = document.getElementById(id);
    item.querySelector('span[name="editArea"]').remove();
    item.querySelector('span[name="all"]').style.display = null;
}

function deleteItem(id) {
    post('/notes/delete',
        () => document.getElementById(id).remove(),
        {id: id});
}

function post(url, callback, content) {
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.responseType = 'json';
    request.addEventListener('load', (data) => {
        console.log(data.target.response);
        if (data.target.response.error == null) {
            callback(content, data.target.response);
        } else {
            alert('Ошибка: ' + data.target.response.error);
        }
    });
    request.send(JSON.stringify(content));
}