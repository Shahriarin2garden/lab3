# >> Lab 3: Asynchronous Programming in Node.js

## Overview

This lab introduces key concepts of **asynchronous programming** in Node.js, focusing on callbacks, promises, async/await, and error handling mechanisms. You'll also gain insights into how the Node.js **Event Loop** works.

## Learning Objectives

By the end of this lab, you will be able to:

* + Understand and differentiate between **callbacks**, **promises**, and **async/await**
* > Refactor callback-based code using **promises** and **async/await**
* | Implement error handling in asynchronous operations
* - Build a simple asynchronous **task queue**
* * Visualize the basics of the **Node.js Event Loop**

## Topics Covered

* - Callbacks and Callback Hell
* - Promises and Promise Chaining
* * Async/Await Syntax
* ! Error Handling in Asynchronous Code
* > Event Loop Basics

## Setup Instructions

### 1. Check Node.js Version

```bash
node -v
```

(Recommended: Node.js v14+)

### 2. Run the Lab

```bash
node lab3.js
```

Or using npm:

```bash
npm start
```

## Task Descriptions

### >> Task 1: Callback to Promise Conversion

* **Goal:** Convert callback-based file operations into **Promise-based** implementations.
* **Modules:** `fs`, `fs/promises`
* **Functions:**
  * `readFileCallback()` – uses traditional callback
  * `readFilePromise()` – uses `.then().catch()` chaining

### >> Task 2: Async/Await File Processing

* **Goal:** Use `async/await` for a cleaner async syntax
* **Function:** `readFileAsync()`
* **Benefit:** Easier to read, maintain, and debug

### >> Task 3: Build an Async Task Queue

* **Goal:** Create a class to execute async functions one at a time (FIFO)
* **Class:** `AsyncTaskQueue`
* **Usage Example:**

```js
queue.add(async () => {
  await new Promise(r => setTimeout(r, 1000));
  console.log('Task 1 complete');
});
```

### >> Task 4: Error Handling with Try-Catch

* **Goal:** Implement error catching in `async` functions
* **Function:** `faultyOperation()`
* **Example:**

```js
try {
  throw new Error('Something went wrong');
} catch (error) {
  console.error('Caught error:', error.message);
}
```

### >> Task 5: Understand the Event Loop

* **Goal:** Demonstrate the execution order of sync vs async code
* **Expected Output:**

```
1. Start (synchronous)
2. End (synchronous)
3. Promise callback (microtask queue)
4. Timeout callback (timer queue)
5. Immediate callback (check queue)
```

## Additional Learning Materials

### >> test.js - Component Tests
- Tests individual components in isolation
- Demonstrates promise chaining
- Shows parallel vs sequential execution
- Tests error propagation patterns

### >> examples.js - Advanced Patterns
- Callback hell vs clean async/await comparison
- Concurrent file processing
- Retry mechanisms and error handling
- Timeout patterns
- Stream processing with async/await

### >> event-loop-deep-dive.js - Event Loop Mastery
- Detailed explanation of all event loop phases
- Microtask queue vs callback queue
- process.nextTick() priority
- Non-blocking patterns
- Common pitfalls and solutions

## File Structure

```
lab3-async-node/
├── lab3.js                    # Main lab file with all 5 tasks
├── test.js                    # Component tests for individual functions
├── examples.js                # Advanced practical examples
├── event-loop-deep-dive.js    # Detailed event loop demonstration
├── input.txt                  # Sample file for testing async file read
├── package.json               # Project configuration
└── README.md                  # This file
```

## Running the Lab

### Individual Files:
```bash
# Run the main lab
node lab3.js

# Run component tests
node test.js

# Run advanced examples
node examples.js

# Run event loop demonstration
node event-loop-deep-dive.js
```

### Using npm scripts:
```bash
# Run the main lab
npm start

# Run component tests
npm test

# Run advanced examples
npm run examples

# Run event loop demonstration
npm run event-loop

# Run all files sequentially
npm run all
```

## Best Practices

* Use `try-catch` around all async/await logic
* Avoid nested callbacks (callback hell!)
* Use `Promise.all()` for concurrent tasks where applicable
* Learn and test how the **event loop** affects execution

## References

* > [Node.js fs module](https://nodejs.org/api/fs.html)
* - [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* > [Node.js Event Loop](https://nodejs.dev/en/learn/understanding-the-nodejs-event-loop/)
* * [MDN: Async/Await](https://developer.mozilla.org/en/docs/Learn/JavaScript/Asynchronous/Promises)

## Final Note

This lab gives you **real-world tools** to handle asynchronous operations in Node.js. Try tweaking the task queue or introducing delays to better understand the runtime.

Happy Hacking!
