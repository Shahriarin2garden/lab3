# >> Lab 3: Asynchronous Programming in Node.js

## Introduction

Node.js revolutionized server-side development by introducing a **non-blocking, event-driven architecture** that enables highly scalable and efficient applications. At the heart of this architecture lies **asynchronous programming** - a programming paradigm that allows code execution to continue without waiting for time-consuming operations to complete.

### Understanding Asynchronous Programming

Traditional synchronous programming executes code sequentially, blocking the execution thread until each operation completes. In contrast, asynchronous programming enables the system to initiate operations and continue executing other code while waiting for results. This approach is particularly crucial in I/O-intensive applications where operations like file reads, database queries, and network requests can significantly impact performance.

#### Why Asynchronous Programming Matters

Consider this analogy: Imagine you're cooking dinner and need to:
1. Boil water for pasta (takes 10 minutes)
2. Chop vegetables (takes 5 minutes)
3. Prepare sauce (takes 8 minutes)

**Synchronous approach**: You wait for water to boil (10 min), then chop vegetables (5 min), then prepare sauce (8 min) = **23 minutes total**

**Asynchronous approach**: You start boiling water, then chop vegetables while water heats, then prepare sauce = **10 minutes total** (everything happens concurrently)

Node.js leverages JavaScript's inherent asynchronous nature through several key mechanisms:

#### 🔄 **Callbacks**: The Foundation of Async
Functions passed as arguments to be executed upon operation completion. While simple, they can lead to "callback hell" with nested operations.

```js
// Simple callback example
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
```

#### 🎯 **Promises**: Better Error Handling
Objects representing eventual completion or failure of asynchronous operations. They provide better error handling and avoid callback hell.

```js
// Promise example
fs.promises.readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

#### ✨ **Async/Await**: Clean Syntax
Syntactic sugar that makes asynchronous code appear synchronous while maintaining non-blocking behavior. The modern way to handle async operations.

```js
// Async/await example
async function readFile() {
    try {
        const data = await fs.promises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

#### ⚡ **Event Loop**: The Engine
The core mechanism that orchestrates asynchronous operations and callbacks, enabling Node.js to handle thousands of concurrent operations on a single thread.

### Node.js Asynchronous Architecture

The Node.js runtime operates on a single-threaded event loop model that efficiently handles concurrent operations without the overhead of traditional multi-threading. This architecture consists of several key components working in harmony:

#### 🏗️ **Core Components of Node.js Architecture:**

```
┌─────────────────────────────────────────────────┐
│                 Call Stack                      │ ← JavaScript execution
├─────────────────────────────────────────────────┤
│              Web APIs / Node APIs                │ ← setTimeout, fs, http
├─────────────────────────────────────────────────┤
│             Microtask Queue                     │ ← Promises, queueMicrotask
│              (High Priority)                    │
├─────────────────────────────────────────────────┤
│              Callback Queue                     │ ← setTimeout, setInterval
│              (Task Queue)                       │
└─────────────────────────────────────────────────┘
                         │
                    Event Loop
```

1. **Call Stack**: Where JavaScript code executes synchronously
2. **Web APIs/Node APIs**: Handle async operations (file I/O, timers, network)
3. **Microtask Queue**: High-priority queue for Promises and process.nextTick()
4. **Callback Queue**: Regular queue for setTimeout, setInterval callbacks
5. **Event Loop**: Orchestrates the movement of callbacks from queues to call stack

#### 🔄 **Event Loop Phases (Detailed):**

The Node.js event loop has 6 distinct phases:

```
   ┌───────────────────────────┐
┌─>│           timers          │  ← setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  ← I/O callbacks deferred
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  ← Internal use only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  ← Fetch new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  ← setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  ← socket.on('close', ...)
   └───────────────────────────┘
```

**Between each phase**: Process microtasks (Promises, process.nextTick)

#### 🎯 **Why This Architecture Matters:**

- **Single Thread**: No thread switching overhead
- **Non-blocking**: I/O operations don't freeze the application
- **High Concurrency**: Handle thousands of connections efficiently
- **Memory Efficient**: Lower memory footprint than multi-threaded models

#### 🎨 **Node.js Architecture Diagram:**

![Node.js Event Loop and Asynchronous Architecture](https://file+.vscode-resource.vscode-cdn.net/e%3A/New%20Folder%281%29/Downloads/lab3/node.drawio%20%281%29.svg?version%3D1752943597363)

*Complete Node.js Event Loop and Asynchronous Architecture - Visual representation of how Node.js handles async operations*

The architecture demonstrates how Node.js processes asynchronous operations through different phases of the event loop, including the call stack, callback queue, microtask queue, and various timer mechanisms. Understanding this architecture is fundamental to writing efficient Node.js applications.

## Overview

This comprehensive lab introduces key concepts of **asynchronous programming** in Node.js, focusing on callbacks, promises, async/await, and error handling mechanisms. You'll also gain practical insights into how the Node.js **Event Loop** works and learn to implement real-world asynchronous patterns.

## Learning Objectives

By the end of this lab, you will be able to:

### 🎯 **Core Competencies:**

#### 🔄 **Understand and differentiate between callbacks, promises, and async/await**
- Explain when and why to use each async pattern
- Convert between different async patterns confidently
- Recognize the evolution from callbacks → Promises → async/await
- Choose the appropriate pattern for different scenarios

#### 🔄 **Refactor callback-based code using promises and async/await**
- Transform legacy callback code to modern async patterns
- Eliminate callback hell with cleaner, more maintainable code
- Apply Promise chaining and async/await patterns effectively
- Handle complex async workflows with multiple operations

#### 🛡️ **Implement error handling in asynchronous operations**
- Master try-catch blocks with async/await
- Use .catch() effectively with Promise chains
- Implement proper error propagation strategies
- Build resilient applications with graceful error recovery

#### 🏗️ **Build a simple asynchronous task queue**
- Design and implement FIFO (First In, First Out) processing
- Manage sequential execution of async operations
- Handle Promise resolution and rejection in queue systems
- Apply task queue patterns to real-world scenarios

#### ⚡ **Visualize the basics of the Node.js Event Loop**
- Understand the 6 phases of the Node.js event loop
- Predict execution order of mixed sync/async code
- Differentiate between microtasks and macrotasks
- Optimize code performance using event loop knowledge

### 🎓 **Advanced Skills:**

#### 🚀 **Performance Optimization**
- Use Promise.all() for concurrent operations
- Choose between sequential and parallel execution
- Avoid blocking the event loop
- Implement efficient async patterns

#### 🔬 **Debugging and Testing**
- Debug async code effectively
- Test both success and failure scenarios
- Use proper logging in async operations
- Handle edge cases and race conditions

#### 🏛️ **Architecture Patterns**
- Design scalable async systems
- Implement retry mechanisms and timeouts
- Build production-ready error handling
- Apply async patterns to real-world applications

## Topics Covered

### 📚 **Core Concepts You'll Master:**

#### 1. 🔄 **Callbacks and Callback Hell**
- **What**: Functions passed as arguments to handle async results
- **Problem**: Nested callbacks create hard-to-read "pyramid of doom"
- **Solution**: Learn to identify and refactor callback hell

```js
// Callback Hell (DON'T DO THIS!)
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            // This keeps going... 😵
        });
    });
});
```

#### 2. 🎯 **Promises and Promise Chaining**
- **What**: Objects representing future values or errors
- **Benefits**: Better error handling, chainable operations
- **Patterns**: .then(), .catch(), .finally(), Promise.all()

```js
// Clean Promise Chain
getData()
    .then(result => processData(result))
    .then(processed => saveData(processed))
    .catch(error => handleError(error));
```

#### 3. ✨ **Async/Await Syntax**
- **What**: Modern syntax making async code look synchronous
- **Benefits**: Easier to read, write, and debug
- **Best Practice**: Always use try-catch for error handling

```js
// Modern Async/Await
async function processData() {
    try {
        const data = await getData();
        const processed = await processData(data);
        return await saveData(processed);
    } catch (error) {
        handleError(error);
    }
}
```

#### 4. 🛡️ **Error Handling in Asynchronous Code**
- **Callback Errors**: Error-first callback pattern
- **Promise Errors**: .catch() and try-catch with async/await
- **Best Practices**: Always handle errors, use proper error propagation

#### 5. ⚡ **Event Loop Fundamentals**
- **Execution Order**: Call stack → Microtasks → Callback queue
- **Priority**: process.nextTick() > Promises > setTimeout
- **Non-blocking**: Understanding what blocks the event loop

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

## 🎯 Practical Tasks

### You'll Build Real-World Examples:

#### 🔄 **Task 1: Callback → Promise Migration**
Convert legacy callback-based file operations to modern Promise-based implementations
- Understand the evolution from callbacks to Promises
- Learn Promise constructor patterns
- Handle errors properly in both approaches

#### ✨ **Task 2: Async/Await Mastery**
Implement clean async/await file processing
- Experience the most modern async syntax
- Master try-catch error handling
- Write readable asynchronous code

#### 🏗️ **Task 3: Build an Async Task Queue**
Create a production-ready task queue system
- Understand FIFO (First In, First Out) processing
- Manage multiple async operations sequentially
- Handle task results and errors

#### 🛡️ **Task 4: Comprehensive Error Handling**
Master error handling scenarios with try-catch blocks
- Handle both success and failure cases
- Learn error propagation patterns
- Implement robust error recovery

#### ⚡ **Task 5: Event Loop Deep Dive**
Visualize and understand the Node.js Event Loop
- See execution order in action
- Understand microtask vs callback queue priority
- Learn timing and performance implications

## Task Descriptions

### >> Task 1: Callback to Promise Conversion

**🎯 Goal:** Convert callback-based file operations into **Promise-based** implementations.

**📚 What You'll Learn:**
- The evolution from callbacks to Promises
- How to wrap callback APIs with Promises
- Error handling differences between patterns
- Why Promises are more composable

**🔧 Key Concepts:**
- **Error-first callbacks**: `callback(error, result)` pattern
- **Promise constructor**: `new Promise((resolve, reject) => {})`
- **Promise states**: pending, fulfilled, rejected

**architecture**

![alt text](image-1.png)


**Implementation:**
```js
// ❌ OLD: Callback-based approach (callback hell risk)
function readFileCallback(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) return callback(err);
        callback(null, data);
    });
}

// ✅ NEW: Promise-based approach (chainable, composable)
function readFilePromise(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// 🚀 MODERN: Using built-in Promise API
function readFileModern(filename) {
    return fs.promises.readFile(filename, 'utf8');
}
```

**📊 Actual Output:**
```
| Reading file using callback...
- Reading file using Promise...
+ Promise resolved successfully
- Promise result: Hello, async world!
| Callback result: Hello, async world!
```

**🔍 Analysis:**
- Callbacks execute immediately when file operation completes
- Promises provide better error handling and composition
- Modern Node.js provides built-in Promise APIs

**Screenshot Placeholder:**
![Task 1 - Callback to Promise Conversion Output](screenshots/task1-callback-promise.png)

### >> Task 2: Async/Await File Processing

**🎯 Goal:** Use `async/await` for cleaner asynchronous syntax.

**📚 What You'll Learn:**
- How async/await simplifies Promise-based code
- Proper error handling with try-catch blocks
- The relationship between async functions and Promises
- Writing synchronous-looking asynchronous code

**🔧 Key Concepts:**
- **async functions**: Always return a Promise
- **await expression**: Pauses execution until Promise resolves
- **Error handling**: try-catch replaces .catch()
- **Non-blocking**: Despite synchronous appearance, it's still async

**💡 Why Async/Await is Better:**
```js
// ❌ Promise Chain (harder to read with complex logic)
function complexOperation() {
    return readFile('config.json')
        .then(config => {
            return processConfig(config);
        })
        .then(processedConfig => {
            return readFile(processedConfig.dataFile);
        })
        .then(data => {
            return transformData(data);
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// ✅ Async/Await (clean, readable, debuggable)
async function complexOperation() {
    try {
        const config = await readFile('config.json');
        const processedConfig = await processConfig(config);
        const data = await readFile(processedConfig.dataFile);
        return await transformData(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

**Implementation:**
```js
async function readFileAsync(filename) {
    try {
        const data = await fs.promises.readFile(filename, 'utf8');
        return data;
    } catch (error) {
        throw error; // Re-throw for caller to handle
    }
}

// Advanced: Parallel execution with async/await
async function readMultipleFiles() {
    try {
        // ❌ Sequential (slow)
        const file1 = await readFileAsync('file1.txt');
        const file2 = await readFileAsync('file2.txt');
        
        // ✅ Parallel (fast)
        const [file1, file2] = await Promise.all([
            readFileAsync('file1.txt'),
            readFileAsync('file2.txt')
        ]);
        
        return { file1, file2 };
    } catch (error) {
        console.error('Error reading files:', error);
    }
}
```

**📊 Actual Output:**
```
* Reading file using async/await...
+ Async/await completed successfully
* Async/await result: Hello, async world!
```

**🔍 Performance Note:**
- Sequential await: Operations wait for each other
- Promise.all() with await: Operations run concurrently
- Choose based on whether operations depend on each other

**Screenshot Placeholder:**
![Task 2 - Async/Await File Processing Output](screenshots/task2-async-await.png)

### >> Task 3: Build an Async Task Queue

**🎯 Goal:** Create a class to execute async functions sequentially (FIFO).

**📚 What You'll Learn:**
- Building production-ready async patterns
- Queue data structures in async contexts
- Managing concurrent operations with sequential execution
- Promise-based class design patterns

**🔧 Key Concepts:**
- **FIFO Queue**: First In, First Out processing
- **Sequential Execution**: Tasks run one after another
- **Promise Management**: Properly resolve/reject queued tasks
- **State Management**: Track running vs idle states

**💡 Real-World Use Cases:**
- **Database Operations**: Ensure writes happen in order
- **File Processing**: Process uploads sequentially
- **API Rate Limiting**: Control request frequency
- **Resource Management**: Limit concurrent resource usage

**🏗️ Architecture Pattern:**
```
Task Queue Architecture:

Add Task 1 ──┐
Add Task 2 ──┼──► [Queue: Task1, Task2, Task3] ──► Processor ──► Execute One by One
Add Task 3 ──┘                                        │
                                                       ▼
                                              [Running: false/true]
```

**Implementation:**
```js
class AsyncTaskQueue {
    constructor() {
        this.tasks = [];        // Queue of pending tasks
        this.running = false;   // Prevent concurrent processing
    }

    // Add task to queue and return Promise for result
    add(asyncTask) {
        return new Promise((resolve, reject) => {
            this.tasks.push({
                task: asyncTask,    // The async function to execute
                resolve,           // Resolve the caller's Promise
                reject             // Reject the caller's Promise
            });
            
            // Start processing if not already running
            if (!this.running) {
                this.process();
            }
        });
    }

    // Process all tasks in queue sequentially
    async process() {
        if (this.running) return;  // Prevent concurrent processing
        
        this.running = true;
        
        while (this.tasks.length > 0) {
            const { task, resolve, reject } = this.tasks.shift();
            
            try {
                const result = await task();  // Execute the task
                resolve(result);              // Resolve caller's Promise
            } catch (error) {
                reject(error);               // Reject caller's Promise
            }
        }
        
        this.running = false;
    }
}

// Usage Examples:
const queue = new AsyncTaskQueue();

// Add multiple tasks
const task1Promise = queue.add(async () => {
    await new Promise(r => setTimeout(r, 1000));
    return 'Task 1 Result';
});

const task2Promise = queue.add(async () => {
    await new Promise(r => setTimeout(r, 500));
    return 'Task 2 Result';
});

// Tasks execute in order (Task 1 then Task 2), not by duration
Promise.all([task1Promise, task2Promise])
    .then(results => console.log('All done:', results));
```

**📊 Actual Output:**
```
>> Starting task queue processing...
| Processing task 1...
+ Task 1 complete
| Processing task 2...
+ Task 2 complete
| Processing task 3...
+ Task 3 complete
+ All tasks completed!
| All task results: [ 'Task 1 result', 'Task 2 result', 'Task 3 result' ]
```

**🔍 Key Insights:**
- Tasks execute in **FIFO order**, not by completion time
- Each task waits for the previous one to complete
- Perfect for scenarios requiring ordered execution
- Scales to handle any number of queued tasks

**Screenshot Placeholder:**
![Task 3 - Async Task Queue Output](screenshots/task3-task-queue.png)

### >> Task 4: Error Handling with Try-Catch

**🎯 Goal:** Implement proper error handling in async functions.

**📚 What You'll Learn:**
- Comprehensive async error handling strategies
- Try-catch vs .catch() patterns
- Error propagation in async call chains
- Recovery patterns and graceful degradation

**🔧 Key Concepts:**
- **Error Boundaries**: Where and how to catch errors
- **Error Propagation**: Re-throwing vs handling locally
- **Error Types**: Network, filesystem, validation errors
- **Recovery Strategies**: Retry, fallback, graceful failure

**🛡️ Error Handling Hierarchy:**
```
Error Handling Strategies:

Level 1: Function Level    ──► try-catch around specific operations
Level 2: Module Level      ──► Catch and transform errors
Level 3: Application Level ──► Global error handlers
Level 4: Process Level     ──► unhandledRejection events
```

**💡 Error Handling Best Practices:**
```js
// ❌ Silent Failures (DON'T DO THIS!)
async function badExample() {
    try {
        await riskyOperation();
    } catch (error) {
        // Silent failure - very bad!
    }
}

// ✅ Proper Error Handling
async function goodExample() {
    try {
        const result = await riskyOperation();
        return result;
    } catch (error) {
        // Log for debugging
        console.error('Operation failed:', error.message);
        
        // Transform error for caller
        throw new Error(`Failed to complete operation: ${error.message}`);
    }
}

// 🚀 Advanced: Error Recovery
async function advancedExample() {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            return await riskyOperation();
        } catch (error) {
            attempt++;
            
            if (attempt === maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
            }
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
        }
    }
}
```

**Implementation:**
```js
async function faultyOperation(shouldFail = false) {
    console.log('| Running faulty operation...');
    
    try {
        // Simulate some async work
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (shouldFail) {
            throw new Error('Something went wrong in the operation!');
        }
        
        console.log('+ Faulty operation completed successfully');
        return 'Operation successful';
    } catch (error) {
        console.error('! Caught error in faultyOperation:', error.message);
        throw error; // Re-throw to let caller handle it
    }
}

// Different Error Scenarios
async function demonstrateErrorHandling() {
    // Scenario 1: Success case
    try {
        const result = await faultyOperation(false);
        console.log('✅ Success:', result);
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
    
    // Scenario 2: Expected failure
    try {
        await faultyOperation(true);
    } catch (error) {
        console.log('🛡️ Error handled gracefully:', error.message);
    }
    
    // Scenario 3: Multiple operations with early exit
    try {
        await faultyOperation(false);
        await faultyOperation(true);  // This will fail
        await faultyOperation(false); // This won't execute
    } catch (error) {
        console.log('⚠️ Chain stopped at first error:', error.message);
    }
}
```

**📊 Actual Output:**
```
| Running faulty operation...
+ Faulty operation completed successfully
| Success result: Operation successful
| Running faulty operation...
! Caught error in faultyOperation: Something went wrong in the operation!
! Expected error caught: Something went wrong in the operation!
```

**🔍 Error Handling Insights:**
- **Always handle errors**: Unhandled Promise rejections can crash your app
- **Log for debugging**: Include context and error details
- **Transform appropriately**: Convert technical errors to user-friendly messages
- **Fail fast**: Don't continue processing after critical errors

**⚠️ Common Pitfalls:**
```js
// ❌ Forgot await - error won't be caught!
try {
    riskyOperation(); // Missing await!
} catch (error) {
    // This won't catch the error
}

// ❌ Mixed patterns - confusing and error-prone
riskyOperation()
    .then(result => {
        // Promise chain
    })
    .catch(error => {
        // But also try-catch somewhere else?
    });

// ✅ Consistent pattern
try {
    const result = await riskyOperation();
    // Handle result
} catch (error) {
    // Handle error
}
```

**Screenshot Placeholder:**
![Task 4 - Error Handling Output](screenshots/task4-error-handling.png)

### >> Task 5: Understand the Event Loop

**🎯 Goal:** Demonstrate execution order of synchronous vs asynchronous code.

**📚 What You'll Learn:**
- How the Node.js event loop prioritizes different types of operations
- The difference between microtasks and macrotasks
- Why understanding execution order is crucial for performance
- How to write non-blocking code that doesn't freeze your application

**🔧 Key Concepts:**
- **Call Stack**: Where synchronous code executes
- **Microtask Queue**: High priority (Promises, process.nextTick)
- **Callback Queue**: Regular priority (setTimeout, setInterval)
- **Event Loop Phases**: 6 distinct phases of operation

**⚡ Event Loop Priority (Highest to Lowest):**
```
1. 🔥 Call Stack (Synchronous code)
2. 🚀 process.nextTick() callbacks
3. 🎯 Microtasks (Promises, queueMicrotask)
4. ⏰ Timer callbacks (setTimeout, setInterval)
5. 📥 I/O callbacks (file reads, network)
6. ✅ Check callbacks (setImmediate)
7. 🔒 Close callbacks (socket closures)
```

**🧪 Execution Order Experiment:**
```js
function demonstrateEventLoop() {
    console.log('1. 🏁 Start (synchronous)');
    
    // Macrotask - goes to Timer Queue
    setTimeout(() => {
        console.log('4. ⏰ Timeout callback (timer queue)');
    }, 0);
    
    // Check phase - goes to Check Queue  
    setImmediate(() => {
        console.log('5. ✅ Immediate callback (check queue)');
    });
    
    // Microtask - goes to Microtask Queue
    Promise.resolve().then(() => {
        console.log('3. 🎯 Promise callback (microtask queue)');
    });
    
    // Highest priority microtask
    process.nextTick(() => {
        console.log('2. 🚀 NextTick (highest priority)');
    });
    
    console.log('1. 🏁 End (synchronous)');
}
```

**🔍 What Happens Step by Step:**
1. **Synchronous code runs first** - Call stack empties
2. **process.nextTick()** - Highest priority, runs immediately after call stack
3. **Promise callbacks** - Microtasks run after nextTick
4. **setTimeout** - Timer phase, even with 0ms delay
5. **setImmediate** - Check phase, runs after I/O events

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

// Advanced: Nested Event Loop Behavior
function nestedEventLoop() {
    console.log('🔄 Nested example:');
    
    setTimeout(() => {
        console.log('⏰ Outer timeout');
        
        // These will execute in the NEXT event loop iteration
        setTimeout(() => console.log('⏰ Nested timeout'), 0);
        setImmediate(() => console.log('✅ Nested immediate'));
        Promise.resolve().then(() => console.log('🎯 Nested promise'));
        process.nextTick(() => console.log('🚀 Nested nextTick'));
        
        console.log('📋 After nested calls');
    }, 0);
}
```

**📊 Actual Output:**
```
1. Start (synchronous)
2. End (synchronous)
3. Promise callback (microtask queue)
5. Immediate callback (check queue)
4. Timeout callback (timer queue)
```

**🤔 Why This Order?**
- **Synchronous first**: JavaScript is single-threaded
- **Microtasks before macrotasks**: Promises have higher priority
- **setImmediate before setTimeout**: In Node.js, immediate often wins the race

**⚠️ Common Event Loop Mistakes:**
```js
// ❌ Blocking the Event Loop (DON'T DO THIS!)
function blockingOperation() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
        // Blocking for 5 seconds - VERY BAD!
    }
}

// ✅ Non-blocking alternative
async function nonBlockingOperation() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
        await new Promise(resolve => setImmediate(resolve));
        // Yields control back to event loop
    }
}
```

**🎯 Performance Implications:**
- **Heavy computation**: Use Worker Threads or break into chunks
- **I/O operations**: Always use async versions
- **Long-running tasks**: Yield control with setImmediate
- **CPU-intensive**: Consider clustering or worker processes

**Screenshot Placeholder:**
![Task 5 - Event Loop Demonstration Output](screenshots/task5-event-loop.png)

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

### 🛡️ **Error Handling**
* **Always use try-catch** around async/await logic
* **Handle Promise rejections** with .catch() or try-catch
* **Never ignore errors** - log them at minimum
* **Use proper error propagation** - re-throw when appropriate

### 🚫 **Avoid Common Pitfalls**
* **Avoid nested callbacks** (callback hell!) - use Promises or async/await
* **Don't block the event loop** with synchronous operations
* **Don't mix Promise patterns** - stick to async/await or .then()
* **Always await async functions** - forgetting await is a common bug

### ⚡ **Performance Optimization**
* **Use Promise.all()** for concurrent independent operations
* **Avoid sequential awaits** when operations can run in parallel
* **Learn and test how the event loop affects execution**
* **Use appropriate async patterns** for different scenarios

### 📋 **Code Organization**
* **Structure async code clearly** with proper function separation
* **Use meaningful function names** that indicate async behavior
* **Document async behavior** in comments and function signatures
* **Test both success and error cases** for all async operations

### 🔧 **Development Tips**
```js
// ✅ Good: Clear async function naming
async function fetchUserData(userId) { /* ... */ }
async function saveUserPreferences(userId, preferences) { /* ... */ }

// ✅ Good: Parallel execution when possible
const [userData, preferences, settings] = await Promise.all([
    fetchUserData(userId),
    fetchUserPreferences(userId),
    fetchUserSettings(userId)
]);

// ✅ Good: Proper error boundaries
async function handleUserAction(userId, action) {
    try {
        const result = await processAction(userId, action);
        return { success: true, data: result };
    } catch (error) {
        console.error('Action failed:', error);
        return { success: false, error: error.message };
    }
}

// ❌ Bad: Sequential when could be parallel
const userData = await fetchUserData(userId);        // Wait
const preferences = await fetchUserPreferences(userId); // Wait
const settings = await fetchUserSettings(userId);      // Wait

// ❌ Bad: Missing error handling
async function riskyFunction() {
    const data = await mayFailOperation(); // Could throw!
    return processData(data);              // Never handle errors
}
```

## 🎓 Learning Progression

### 📈 **Recommended Learning Path:**

#### **Phase 1: Foundations (Start Here)**
1. **Run `lab3.js`** - Get familiar with all basic concepts
2. **Study Task 1** - Understand callback to Promise conversion
3. **Practice Task 2** - Master async/await syntax
4. **Experiment with Task 5** - Visualize the event loop

#### **Phase 2: Practical Application**
1. **Build Task 3** - Create your own async task queue
2. **Master Task 4** - Implement robust error handling
3. **Run `test.js`** - See advanced patterns in action
4. **Study output** - Understand execution timing

#### **Phase 3: Advanced Patterns**
1. **Run `examples.js`** - Learn real-world patterns
2. **Study callback hell** - See why we moved to Promises
3. **Practice concurrent processing** - Master Promise.all()
4. **Learn retry patterns** - Build resilient applications

#### **Phase 4: Deep Understanding**
1. **Run `event-loop-deep-dive.js`** - Master the event loop
2. **Understand all 6 phases** - Know how Node.js works internally
3. **Practice non-blocking patterns** - Write performant code
4. **Experiment with priorities** - Control execution order

### 🎯 **Mastery Checkpoints:**

**✅ Beginner Level:**
- [ ] Can convert a callback to a Promise
- [ ] Can use async/await for basic file operations
- [ ] Understands basic error handling with try-catch
- [ ] Can explain the difference between sync and async

**✅ Intermediate Level:**
- [ ] Can build a simple async task queue
- [ ] Understands Promise.all() for concurrent operations
- [ ] Can debug async code effectively
- [ ] Knows when to use sequential vs parallel execution

**✅ Advanced Level:**
- [ ] Understands all event loop phases
- [ ] Can optimize async code for performance
- [ ] Can implement complex error recovery patterns
- [ ] Can build production-ready async systems

### 🔬 **Hands-On Experiments:**

Try these modifications to deepen your understanding:

```js
// Experiment 1: Change execution order
function experimentWithTiming() {
    console.log('Start experiment');
    
    setTimeout(() => console.log('Timeout 1'), 0);
    setTimeout(() => console.log('Timeout 2'), 0);
    
    Promise.resolve().then(() => console.log('Promise 1'));
    Promise.resolve().then(() => console.log('Promise 2'));
    
    setImmediate(() => console.log('Immediate 1'));
    setImmediate(() => console.log('Immediate 2'));
    
    console.log('End experiment');
}

// Experiment 2: Error propagation
async function experimentWithErrors() {
    try {
        await Promise.reject(new Error('Test error'));
    } catch (error) {
        console.log('Caught:', error.message);
        // What happens if you re-throw here?
        // throw error;
    }
}

// Experiment 3: Performance comparison
async function experimentWithPerformance() {
    const start = Date.now();
    
    // Try both approaches and measure time
    // Sequential vs Parallel execution
}
```

## References

## References

### 📚 **Essential Documentation:**
* 🔗 [Node.js fs module](https://nodejs.org/api/fs.html) - File system operations
* 🔗 [MDN: Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Promise fundamentals
* 🔗 [Node.js Event Loop](https://nodejs.dev/en/learn/understanding-the-nodejs-event-loop/) - Event loop deep dive
* 🔗 [MDN: Async/Await](https://developer.mozilla.org/en/docs/Learn/JavaScript/Asynchronous/Promises) - Modern async syntax

### 🎥 **Recommended Videos:**
* 🎬 "What the heck is the event loop anyway?" - Philip Roberts (JSConf)
* 🎬 "Node.js Event Loop" - Node.js Foundation
* 🎬 "Async/Await in JavaScript" - Modern async patterns

### 📖 **Advanced Reading:**
* 📄 [libuv Design Overview](http://docs.libuv.org/en/v1.x/design.html) - The engine behind Node.js
* 📄 [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Production guidelines
* 📄 [JavaScript Promises: An Introduction](https://web.dev/promises/) - Comprehensive Promise guide

### 🛠️ **Tools for Learning:**
* 🔧 [Node.js REPL](https://nodejs.org/api/repl.html) - Interactive experimentation
* 🔧 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - Debugging async code
* 🔧 [VS Code Debugger](https://code.visualstudio.com/docs/nodejs/nodejs-debugging) - Step through async operations

### 🌟 **Community Resources:**
* 💬 [Node.js Discord](https://discord.gg/nodejs) - Get help from the community
* 💬 [Stack Overflow](https://stackoverflow.com/questions/tagged/node.js) - Q&A for specific problems
* 💬 [Reddit r/node](https://www.reddit.com/r/node/) - Discussions and news

---

### 🏆 **Congratulations!**

You've completed a comprehensive journey through Node.js asynchronous programming! You now understand:

- ✅ **Callbacks, Promises, and Async/Await** - The evolution of async JavaScript
- ✅ **Event Loop Mechanics** - How Node.js handles concurrency
- ✅ **Error Handling Patterns** - Building robust applications  
- ✅ **Performance Optimization** - Writing efficient async code
- ✅ **Real-world Patterns** - Task queues, retries, and more

**🚀 Next Steps:**
- Build a real application using these patterns
- Explore Node.js streams for handling large datasets
- Learn about Worker Threads for CPU-intensive tasks
- Study microservices and async communication patterns

**Keep coding asynchronously! 🌟**

