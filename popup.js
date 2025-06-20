const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const addSound = new Audio("add.mp3");
const deleteSound = new Audio("delete.mp3");

chrome.storage.sync.get(["tasks"], function(result) {
  const tasks = result.tasks || [];
  tasks.forEach(task => addTaskToDOM(task));
});

addBtn.addEventListener("click", function () {
  const task = taskInput.value.trim();
  if (task === "") return;

  chrome.storage.sync.get(["tasks"], function (result) {
    const tasks = result.tasks || [];
    tasks.push(task);

    chrome.storage.sync.set({ tasks: tasks }, function () {
      if (chrome.runtime.lastError) {
        console.error("Storage Error:", chrome.runtime.lastError);
        return;
      }
      addTaskToDOM(task);
      taskInput.value = "";

      addSound.play();
    });
  });
});

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.textContent = task;

  const del = document.createElement("span");
  del.textContent = "X";
  del.addEventListener("click", function () {
    deleteSound.play();
    li.remove();
    chrome.storage.sync.get(["tasks"], function(result) {
      const tasks = result.tasks || [];
      const newTasks = tasks.filter(t => t !== task);
      chrome.storage.sync.set({ tasks: newTasks });
    });
  });

  li.appendChild(del);
  taskList.appendChild(li);
}

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addBtn.click();
  }
});