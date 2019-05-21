let todo = document.getElementById("todo");
todo.focus();
todo.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        addTodo();
    } else if (event.keyCode === 27) {
        todo.value = '';
    }
});
let todos = document.getElementById("todos");
todos.addEventListener("click", (event) => {
    let todo = event.target;
    todo.classList.remove('show');
    setTimeout(() => {
        todos.removeChild(todo);
    }, 500);
    let success = document.getElementById('success');
    success.innerHTML = '<p>Finished <strong>' + todo.innerText + '</strong> TODO!</p>'
    success.classList.add('show');
    setTimeout(() => {
        success.classList.remove('show');
    }, 2000);
})

function addTodo() {
    let elements = todos.getElementsByTagName("li");
    for(let li of elements) {
        if (li.innerText === todo.value) {
            li.classList.add('selected');
            let error = document.getElementById('error');
            error.innerHTML = '<p>Already have that TODO in the list</p>';
            error.classList.add('show');
            setTimeout(() => {
                li.classList.remove('selected');
                error.classList.remove('show');
            }, 2000);
            return;
        }
    }

    let node = document.createElement('li');
    let textNode = document.createTextNode(todo.value);
    node.appendChild(textNode);
    todos.appendChild(node);
    setTimeout(() => {
        node.classList.add('show')
    }, 10);

    todo.value = '';
    todo.focus();
}