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
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", onDataReceived);
  console.log(`Welcome to ${name}'s application!`);
  console.log("--------------------");
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
  const splitedText = cleanText.split(" ")
  const firstCmd = splitedText[0].toLowerCase();
  const secondCmd = splitedText[1]

  if (firstCmd === "help") {
    help();
  } else if (firstCmd === "quit" || firstCmd === "exit") {
    quit();
  } else if (firstCmd === "hello") {
      if (secondCmd) {
        hello(secondCmd)
      } else {
        hello()
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
    console.log(`hello ${name}!`)
  } else {
    console.log("hello!")
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
      "\\quit : for exiting the application\n" +
      "\\help : displaying all possible commands"
  );
}

// The following line starts the application
startApp("Fares Chrayteh");
