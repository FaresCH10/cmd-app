const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "./database.json");

let tasks = []; // stores tasks here

function loadTasks() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, "utf-8");
      tasks = JSON.parse(data);
    } else {
      tasks = [
        { task: "pray", done: true },
        { task: "programming", done: false },
        { task: "eating", done: false },
        { task: "studying", done: true },
      ];
      saveTasks();
    }
  } catch (error) {
    console.log("Error loading database:", error.message);
    tasks = [];
  }
}

function saveTasks() {
  try {
    const data = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(dataFile, data, "utf8");
  } catch (error) {
    console.log("Error saving database:", error.message);
  }
}

/**
 * Starts the application
 * This is the function that is run when the app starts
 *
 * It prints a welcome line, and then a line with "----",
 * then nothing.
 *
 * @param  {string} name the name of the app
 * @returns {void}
 */
function startApp(name) {
  loadTasks();

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", onDataReceived);
  console.log(`Welcome to ${name}'s application!`);
  console.log("--------------------");

  process.on("exit", () => {
    saveTasks();
  });

  process.on("SIGINT", () => {
    saveTasks();
    process.exit();
  });
}

/**
 * Decides what to do depending on the data that was received
 * This function receives the input sent by the user.
 *
 * For example, if the user entered
 * ```
 * node tasks.js batata
 * ```
 *
 * The text received would be "batata"
 * This function  then directs to other functions
 *
 * @param  {string} text data typed by the user
 * @returns {void}
 */
function onDataReceived(text) {
  const cleanText = text.replace(/\n/g, "").trim();
  const splitedText = cleanText.split(" ");
  const firstCmd = splitedText[0].toLowerCase();
  const secondCmd = splitedText[1];

  if (firstCmd === "add") {
    if (secondCmd) {
      add(splitedText.slice(1, splitedText.length).join(" "));
      console.log("task added");
    } else {
      console.log("error, you must add a name for the task!");
    }
  } else if (firstCmd === "remove") {
    if (secondCmd) {
      remove(secondCmd);
    } else {
      remove();
    }
  } else if (firstCmd === "edit") {
    if (!secondCmd) {
      console.log("you must add a new task name!");
      return;
    }

    if (!isNaN(secondCmd)) {
      const restText = splitedText.splice(2, splitedText.length - 2);
      edit(secondCmd, restText);
    } else {
      const restText = splitedText.splice(1, splitedText.length - 1);
      edit(undefined, restText);
    }
  } else if (firstCmd === "check") {
    if (secondCmd) {
      check(secondCmd);
    } else {
      console.log("No task selected, enter task number!");
    }
  } else if (firstCmd === "uncheck") {
    if (secondCmd) {
      uncheck(secondCmd);
    } else {
      console.log("No task selected, enter task number!");
    }
  } else if (firstCmd === "list") {
    list();
  } else if (firstCmd === "help") {
    help();
  } else if (firstCmd === "quit" || firstCmd === "exit") {
    quit();
  } else if (firstCmd === "hello") {
    if (secondCmd) {
      hello(secondCmd);
    } else {
      hello();
    }
  } else {
    unknownCommand(text);
  }
}

/**
 * prints "unknown command"
 * This function is supposed to run when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */
function unknownCommand(c) {
  console.log('unknown command: "' + c.trim() + '"');
}

/**
 * Says hello
 *
 * @returns {void}
 */
function hello(name = "") {
  if (name) {
    console.log(`hello ${name}!`);
  } else {
    console.log("hello!");
  }
}

/**
 * Exits the application
 *
 * @returns {void}
 */
function quit() {
  console.log("Quitting now, goodbye!");
  process.exit();
}

/**
 * Display all possible commands
 *
 * @returns {void}
 */
function help() {
  console.log(
    "All possible Commands:\n" +
      "\\hello : it will return hello!\n" +
      "\\hello x : x refers to any word, it will return hello + x!\n" +
      "\\list : list all the tasks\n" +
      "\\add x : x refers to a task name, adding it to the list\n" +
      "\\check x : mark task x as done\n" +
      "\\uncheck x : mark task x as undone\n" +
      "\\remove : remove the last task from the list\n" +
      "\\remove x : x refers to the task number, remove it from the list\n" +
      "\\edit new text : edit last task with new text\n" +
      "\\edit x new text : edit task x with new text\n" +
      "\\quit or \\exit : for exiting the application\n" +
      "\\help : displaying all possible commands"
  );
}

/**
 * Display all tasks
 *
 * @returns {void}
 */
function list() {
  if (tasks.length > 0) {
    tasks.map(({ task, done }, index) => {
      const check = done ? `[✓]` : `[ ]`;
      console.log(`${check} ${++index}- ${task}`);
    });
  } else {
    console.log("no tasks yet");
  }
}

/**
 * add a task to the list
 *
 * @returns {void}
 */
function add(task) {
  tasks.push({ task: task, done: false });
  saveTasks()
}

/**
 * remove a task from the list
 *
 * @returns {void}
 */
function remove(number) {
  if (number > tasks.length) {
    console.log("there is no tasks with that number!");
    return;
  }
  if (number) {
    tasks.splice(number - 1, 1);
    console.log(`task number ${number} has been removed`);
  } else {
    tasks.pop();
    console.log("the last task has been removed");
  }
  saveTasks()
}

function edit(number = 0, task = []) {
  if (number) {
    tasks[number - 1] = { task: task.join(" "), done: tasks[number - 1].done };
    console.log(`task ${number} has been edited!`);
  } else {
    tasks[tasks.length - 1] = {
      task: task.join(" "),
      done: tasks[tasks.length - 1].done,
    };
    saveTasks()
    console.log("the last task has been edited!");
  }
}

function check(number) {
  if (number > tasks.length) {
    console.log("there is no tasks with that number!");
    return;
  }

  let task = tasks[number - 1];
  if (!task.done) {
    tasks[number - 1] = { task: task.task, done: true };
    console.log(`task ${number} checked!`);
  } else {
    console.log(`task ${number} is already checked!`);
  }
  saveTasks()
}

function uncheck(number) {
  if (number > tasks.length) {
    console.log("there is no tasks with that number!");
    return;
  }

  let task = tasks[number - 1];
  if (task.done) {
    tasks[number - 1] = { task: task.task, done: false };
    console.log(`task ${number} unchecked!`);
  } else {
    console.log(`task ${number} is already unchecked!`);
  }
  saveTasks()
}

// The following line starts the application
startApp("Fares Chrayteh");
