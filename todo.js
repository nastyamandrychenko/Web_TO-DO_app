function Todo(name, state) {
  this.name = name;
  this.state = state;
}

var todos = [];
var states = ["active", "inactive", "done"];
var tabs = ["all"].concat(states);
var currentTab = "all";

var form = document.getElementById("new-todo-form");
var input = document.getElementById("new-todo-title");

form.onsubmit = function (event) {
  event.preventDefault();
  if (input.value && input.value.length) {
    todos.push(new Todo(input.value, "active"));
    input.value = "";
    renderTodos();
  }
};

var buttons = [
  { action: "done", icon: "ok" },
  { action: "active", icon: "plus" },
  { action: "inactive", icon: "minus" },
  { action: "remove", icon: "trash" },
  { action: "up", icon: "arrow-up" }, 
  { action: "down", icon: "arrow-down" } 
];

function renderTodos() {
  updateBadgeCounts();

  var todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  var filteredTodos = todos.filter(function (todo) {
    return todo.state === currentTab || currentTab === "all";
  });

  filteredTodos.forEach(function (todo, index) {
    var div1 = document.createElement("div");
    div1.className = "row";

    var div2 = document.createElement("div");
    div2.innerHTML =
      '<a class="list-group-item" href="#">' + todo.name + "</a>";
    div2.className = "col-xs-6 col-sm-9 col-md-10";

    var div3 = document.createElement("div");
    div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
    buttons.forEach(function (button) {
      var btn = document.createElement("button");
      btn.className = "btn btn-default btn-xs";
      btn.innerHTML =
        '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
      div3.appendChild(btn);

      if (button.action === todo.state) {
        btn.disabled = true;
      }

      if (button.action === "remove") {
        btn.title = "Remove";
        btn.onclick = function () {
          if (
            confirm(
              "Are you sure you want to delete the item titled " + todo.name
            )
          ) {
            todos.splice(todos.indexOf(todo), 1);
            renderTodos();
          }
        };
      }
      else if (button.action === "up") {
        btn.title = "Move Up";
        btn.disabled = index === 0; 
        btn.onclick = function () {
          swapTodos(filteredTodos, index, index - 1);
        };
      }
      else if (button.action === "down") {
        btn.title = "Move Down";
        btn.disabled = index === filteredTodos.length - 1; 
        btn.onclick = function () {
          swapTodos(filteredTodos, index, index + 1);
        };
      }
      else {
        btn.title = "Mark as " + button.action;
        btn.onclick = function () {
          todo.state = button.action;
          renderTodos();
        };
      }
    });

    div1.appendChild(div2);
    div1.appendChild(div3);

    todoList.appendChild(div1);
  });
}

function updateBadgeCounts() {
  var allCount = todos.length;
  var activeCount = todos.filter(todo => todo.state === "active").length;
  var inactiveCount = todos.filter(todo => todo.state === "inactive").length;
  var doneCount = todos.filter(todo => todo.state === "done").length;

  document.querySelector('[data-tab-name="all"] .badge').innerText = allCount;
  document.querySelector('[data-tab-name="active"] .badge').innerText = activeCount;
  document.querySelector('[data-tab-name="inactive"] .badge').innerText = inactiveCount;
  document.querySelector('[data-tab-name="done"] .badge').innerText = doneCount;
}

function swapTodos(list, index1, index2) {
  var temp = list[index1];
  list[index1] = list[index2];
  list[index2] = temp;

  var todoIndex1 = todos.indexOf(list[index1]);
  var todoIndex2 = todos.indexOf(list[index2]);
  var tempOriginal = todos[todoIndex1];
  todos[todoIndex1] = todos[todoIndex2];
  todos[todoIndex2] = tempOriginal;

  renderTodos();
}

renderTodos();

function selectTab(element) {
  var tabName = element.attributes["data-tab-name"].value;
  currentTab = tabName;
  var todoTabs = document.getElementsByClassName("todo-tab");
  for (var i = 0; i < todoTabs.length; i++) {
    todoTabs[i].classList.remove("active");
  }
  element.classList.add("active");
  renderTodos();
}