# >> Lab 3: Asynchronous Programming in Node.js

## Introduction

Node.js revolutionized server-side development by introducing a **non-blocking, event-driven architecture** that enables highly scalable and efficient applications. At the heart of this architecture lies **asynchronous programming** - a programming paradigm that allows code execution to continue without waiting for time-consuming operations to complete.

### Understanding Asynchronous Programming

Traditional synchronous programming executes code sequentially, blocking the execution thread until each operation completes. In contrast, asynchronous programming enables the system to initiate operations and continue executing other code while waiting for results. This approach is particularly crucial in I/O-intensive applications where operations like file reads, database queries, and network requests can significantly impact performance.

Node.js leverages JavaScript's inherent asynchronous nature through several key mechanisms:

- **Callbacks**: Functions passed as arguments to be executed upon operation completion
- **Promises**: Objects representing eventual completion or failure of asynchronous operations
- **Async/Await**: Syntactic sugar that makes asynchronous code appear synchronous while maintaining non-blocking behavior
- **Event Loop**: The core mechanism that orchestrates asynchronous operations and callbacks

### Node.js Asynchronous Architecture

The Node.js runtime operates on a single-threaded event loop model that efficiently handles concurrent operations without the overhead of traditional multi-threading. This architecture consists of several key components working in harmony:

**[Architecture Diagram Placeholder]**
*Insert Node.js Event Loop and Asynchronous Architecture Diagram Here*

The architecture demonstrates how Node.js processes asynchronous operations through different phases of the event loop, including the call stack, callback queue, microtask queue, and various timer mechanisms. Understanding this architecture is fundamental to writing efficient Node.js applications.

## Overview

This comprehensive lab introduces key concepts of **asynchronous programming** in Node.js, focusing on callbacks, promises, async/await, and error handling mechanisms. You'll also gain practical insights into how the Node.js **Event Loop** works and learn to implement real-world asynchronous patterns.

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

**Goal:** Convert callback-based file operations into **Promise-based** implementations.

**Implementation:**
```js
// Callback-based approach
function readFileCallback(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) return callback(err);
        callback(null, data);
    });
}

// Promise-based approach
function readFilePromise(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
```

**Actual Output:**
```
| Reading file using callback...
- Reading file using Promise...
+ Promise resolved successfully
- Promise result: Hello, async world!
| Callback result: Hello, async world!
```

**Screenshot Placeholder:**
![Task 1 - Callback to Promise Conversion Output](screenshots/task1-callback-promise.png)

### >> Task 2: Async/Await File Processing

**Goal:** Use `async/await` for cleaner asynchronous syntax.

**Implementation:**
```js
async function readFileAsync(filename) {
    try {
        const data = await fs.promises.readFile(filename, 'utf8');
        return data;
    } catch (error) {
        throw error;
    }
}
```

**Actual Output:**
```
* Reading file using async/await...
+ Async/await completed successfully
* Async/await result: Hello, async world!
```

**Screenshot Placeholder:**
![Task 2 - Async/Await File Processing Output](screenshots/task2-async-await.png)

### >> Task 3: Build an Async Task Queue

**Goal:** Create a class to execute async functions sequentially (FIFO).

**Implementation:**
```js
class AsyncTaskQueue {
    constructor() {
        this.tasks = [];
        this.running = false;
    }

    add(task) {
        this.tasks.push(task);
        this.process();
    }

    async process() {
        if (this.running) return;
        this.running = true;
        
        while (this.tasks.length > 0) {
            const task = this.tasks.shift();
            await task();
        }
        
        this.running = false;
    }
}
```

**Actual Output:**
```
>> Starting task queue processing...
| Processing task 1...
+ Task 1 complete
| Processing task 2...
+ Task 2 complete
| Processing task 1...
+ Task 3 complete
+ All tasks completed!
| All task results: [ 'Task 1 result', 'Task 2 result', 'Task 3 result' ]
```

**Screenshot Placeholder:**
![Task 3 - Async Task Queue Output](screenshots/task3-task-queue.png)

### >> Task 4: Error Handling with Try-Catch

**Goal:** Implement proper error handling in async functions.

**Implementation:**
```js
async function faultyOperation() {
    try {
        await new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Operation failed')), 1000);
        });
    } catch (error) {
        console.error('Caught error:', error.message);
        throw error; // Re-throw if needed
    }
}
```

**Actual Output:**
```
| Running faulty operation...
+ Faulty operation completed successfully
| Success result: Operation successful
| Running faulty operation...
! Caught error in faultyOperation: Something went wrong in the operation!
! Expected error caught: Something went wrong in the operation!
```

**Screenshot Placeholder:**
![Task 4 - Error Handling Output](screenshots/task4-error-handling.png)

### >> Task 5: Understand the Event Loop

**Goal:** Demonstrate execution order of synchronous vs asynchronous code.

**Implementation:**
```js
function demonstrateEventLoop() {
    console.log('1. Start (synchronous)');
    
    setTimeout(() => {
        console.log('4. Timeout callback (timer queue)');
    }, 0);
    
    setImmediate(() => {
        console.log('5. Immediate callback (check queue)');
    });
    
    Promise.resolve().then(() => {
        console.log('3. Promise callback (microtask queue)');
    });
    
    console.log('2. End (synchronous)');
}
```

**Actual Output:**
```
1. Start (synchronous)
2. End (synchronous)
3. Promise callback (microtask queue)
5. Immediate callback (check queue)
4. Timeout callback (timer queue)
```

**Screenshot Placeholder:**
![Task 5 - Event Loop Demonstration Output](screenshots/task5-event-loop.png)

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
Tests individual components in isolation and demonstrates advanced async patterns.

**Key Features:**
- Tests individual components in isolation
- Demonstrates promise chaining
- Shows parallel vs sequential execution
- Tests error propagation patterns
- Advanced task queue testing

**Complete Output:**
```
>> Running Lab 3 Component Tests
================================

> Testing Promise Chaining
===========================
+ Promise chain result: First Second Third

> Testing Parallel Execution
=============================
| Sequential execution...
+ Parallel execution...
| Sequential time: 316ms
| Parallel time: 110ms
+ Speedup: 2.87x

> Testing Error Propagation
============================
| Caught in level 2, re-throwing...
+ Final catch in level 3: Level 2 wrapper: Error from level 1

> Testing Task Queue
====================
> Testing task 1...
> Testing task 2...
> Testing task 3...
+ All 3 tasks completed!
| Task results: [ 'Quick task', 'Very quick task', 'Medium task' ]

* All tests completed!
```

**Screenshot Placeholder:**
![Component Tests Output](screenshots/component-tests.png)

### >> examples.js - Advanced Patterns
Demonstrates advanced asynchronous programming patterns and best practices.

**Key Features:**
- Callback hell vs clean async/await comparison
- Concurrent file processing
- Retry mechanisms and error handling
- Timeout patterns
- Stream processing with async/await

**Complete Output:**
```
>> Lab 3 Practical Examples
===========================

! Callback Hell Example:
+ Callback hell completed (but messy!)

+ Clean Async/Await Example:
+ Clean async/await completed!

+ Concurrent File Processing Example:
+ Processed 3 files in 4ms
| Results: [
  'File 1: HELLO, ASYNC WORLD!',
  'File 2: HELLO, ASYNC WORLD!',
  'File 3: HELLO, ASYNC WORLD!'
]

> Advanced Error Handling Example:
! Attempt 1 failed: Simulated failure 1
! Attempt 2 failed: Simulated failure 2
+ Retry result: Success after retries!

> Timeout Example:
> Expected timeout: Operation timed out after 1000ms
+ Result 2: Slow operation completed

> Stream Processing Example:
+ Stream processing completed
| Stream result: HELLO, ASYNC WORLD!

* All examples completed!
```

**Screenshot Placeholder:**
![Advanced Examples Output](screenshots/advanced-examples.png)

### >> event-loop-deep-dive.js - Event Loop Mastery
Provides comprehensive understanding of Node.js event loop mechanics.

**Key Features:**
- Detailed explanation of all event loop phases
- Microtask queue vs callback queue
- process.nextTick() priority
- Non-blocking patterns
- Common pitfalls and solutions

**Complete Output:**
```
>> Event Loop Deep Dive
======================

> Phase 1: Basic Event Loop Understanding
==========================================
1. Call Stack (Synchronous)
1. Call Stack (Synchronous) - End
> Process NextTick (highest priority)
2. Microtask Queue - Promise
4. Check Phase - setImmediate
3. Timer Phase - setTimeout

> Phase 2: Nested Event Loop Behavior
=====================================
| Nested Synchronous
> Nested NextTick
- Nested Promise
+ Nested setImmediate
* Nested setTimeout

> Phase 3: I/O Operations and Event Loop
=========================================
> Phase 4: Microtask Queue Priority
===================================
| Synchronous in Phase 4
> NextTick 1
> NextTick 3
> NextTick 2 (nested)
- Promise 1
- Promise 3
- Promise 2 (chained)

| File I/O Callback: Hello, async world!
> NextTick after I/O
- Promise after I/O
+ Immediate after I/O
* Timer after I/O

> Phase 5: Event Loop Blocking (DON'T DO THIS!)
================================================
! Starting blocking operation...
! Blocking operation completed
+ Immediate after blocking

> Phase 6: Proper Non-Blocking Patterns
========================================
+ Processed item: Item 1
+ Processed item: Item 2
+ Processed item: Item 3
+ Processed item: Item 4
+ Processed item: Item 5
* All items processed without blocking!

> Phase 7: Event Loop Phases Summary
====================================
>> Node.js Event Loop Phases:
1. Timer Phase - setTimeout, setInterval
2. Pending Callbacks - I/O callbacks deferred from previous iteration
3. Idle, Prepare - Internal use only
4. Poll Phase - Fetch new I/O events
5. Check Phase - setImmediate callbacks
6. Close Callbacks - close event callbacks

> Between each phase:
- Process NextTick callbacks (highest priority)
- Process Promise callbacks (microtasks)

| Key Takeaways:
- process.nextTick() has highest priority
- Promises are microtasks, executed after each phase
- setImmediate() executes in check phase
- setTimeout() executes in timer phase
- Never block the event loop with synchronous operations!

* Event Loop Deep Dive Complete!
=================================
>> Understanding the event loop is crucial for writing efficient Node.js applications!
```

**Screenshot Placeholder:**
![Event Loop Deep Dive Output](screenshots/event-loop-deep-dive.png)

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

