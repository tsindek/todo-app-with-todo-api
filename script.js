let todos = [];

const todoList = document.querySelector("#todo-list");
const removeDoneButton = document.querySelector("#remove-done-button");
const addTodoButton = document.querySelector("#new-todo-button");

function getTodosFromApi() {
  fetch("http://localhost:4730/todos")
    .then((res) => res.json())
    .then((todosFromApi) => {
      todos = todosFromApi;
      renderTodos();
    });
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todoItem) => {
    const newLi = document.createElement("li");
    const todoText = document.createTextNode(todoItem.description);

    newLi.setAttribute("data-id", todoItem.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todoItem.done;

    newLi.appendChild(checkbox);
    newLi.appendChild(todoText);
    todoList.appendChild(newLi);
  });
}

todoList.addEventListener("change", (e) => {
  const todoId = e.target.parentElement.getAttribute("data-id");
  const todoDescription = todos.find((todo) => (todo.id = todoId)).description;
  const todoCheckboxChecked = e.target.checked;

  const updatetTodo = {
    description: todoDescription,
    done: todoCheckboxChecked,
  };

  fetch("http://localhost:4730/todos/" + todoId, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(updatetTodo),
  }).then(() => getTodosFromApi());
});

removeDoneButton.addEventListener("click", () => {
  todos.forEach((todo) => {
    if (todo.done) {
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "DELETE",
      });
    }
  });
  getTodosFromApi();
});

addTodoButton.addEventListener("click", () => {
  const todoInputField = document.querySelector("#todo-input-field");
  const newTodo = { description: todoInputField.value, done: false };

  fetch("http://localhost:4730/todos/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      getTodosFromApi();
    });
});

getTodosFromApi();
