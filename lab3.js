// 🚀 Lab 3: Asynchronous Programming in Node.js
// Author: GitHub Copilot
// Date: July 16, 2025

const fs = require('fs');
const fsPromises = require('fs/promises');

// ============================================================================
// 🔧 Task 1: Callback to Promise Conversion
// ============================================================================

/**
 * Traditional callback-based file reading
 * @param {string} filename - The file to read
 * @param {Function} callback - Callback function (err, data)
 */
function readFileCallback(filename, callback) {
    console.log('📖 Reading file using callback...');
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}

/**
 * Promise-based file reading using .then().catch()
 * @param {string} filename - The file to read
 * @returns {Promise} - Promise that resolves with file data
 */
function readFilePromise(filename) {
    console.log('🔗 Reading file using Promise...');
    return fsPromises.readFile(filename, 'utf8')
        .then(data => {
            console.log('✅ Promise resolved successfully');
            return data;
        })
        .catch(err => {
            console.error('❌ Promise rejected:', err.message);
            throw err;
        });
}

// ============================================================================
// ⏱ Task 2: Async/Await File Processing
// ============================================================================

/**
 * Async/await file reading for cleaner syntax
 * @param {string} filename - The file to read
 * @returns {Promise} - Promise that resolves with file data
 */
async function readFileAsync(filename) {
    try {
        console.log('⏳ Reading file using async/await...');
        const data = await fsPromises.readFile(filename, 'utf8');
        console.log('✅ Async/await completed successfully');
        return data;
    } catch (error) {
        console.error('❌ Async/await error:', error.message);
        throw error;
    }
}

// ============================================================================
// 📦 Task 3: Build an Async Task Queue
// ============================================================================

/**
 * AsyncTaskQueue class to execute async functions one at a time (FIFO)
 */
class AsyncTaskQueue {
    constructor() {
        this.tasks = [];
        this.isRunning = false;
    }

    /**
     * Add a task to the queue
     * @param {Function} asyncTask - Async function to execute
     * @returns {Promise} - Promise that resolves when task completes
     */
    add(asyncTask) {
        return new Promise((resolve, reject) => {
            this.tasks.push({
                task: asyncTask,
                resolve,
                reject
            });
            
            if (!this.isRunning) {
                this.process();
            }
        });
    }

    /**
     * Process tasks in the queue one by one
     */
    async process() {
        if (this.isRunning || this.tasks.length === 0) {
            return;
        }

        this.isRunning = true;
        console.log('🚀 Starting task queue processing...');

        while (this.tasks.length > 0) {
            const { task, resolve, reject } = this.tasks.shift();
            
            try {
                console.log(`📋 Processing task ${this.getCompletedTaskCount() + 1}...`);
                const result = await task();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }

        this.isRunning = false;
        console.log('✅ All tasks completed!');
    }

    /**
     * Get the number of completed tasks
     * @returns {number} - Number of completed tasks
     */
    getCompletedTaskCount() {
        return this.tasks.length;
    }
}

// ============================================================================
// 🧯 Task 4: Error Handling with Try-Catch
// ============================================================================

/**
 * Demonstrates error handling in async functions
 * @param {boolean} shouldFail - Whether the operation should fail
 * @returns {Promise} - Promise that may reject
 */
async function faultyOperation(shouldFail = false) {
    console.log('🧯 Running faulty operation...');
    
    try {
        // Simulate some async work
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (shouldFail) {
            throw new Error('Something went wrong in the operation!');
        }
        
        console.log('✅ Faulty operation completed successfully');
        return 'Operation successful';
    } catch (error) {
        console.error('❌ Caught error in faultyOperation:', error.message);
        throw error; // Re-throw to let caller handle it
    }
}

// ============================================================================
// 🔁 Task 5: Understand the Event Loop
// ============================================================================

/**
 * Demonstrates the execution order of sync vs async code
 */
function demonstrateEventLoop() {
    console.log('\n🔁 Event Loop Demonstration:');
    console.log('===========================');
    
    console.log('1. Start (synchronous)');
    
    // Timeout callback (goes to timer queue)
    setTimeout(() => {
        console.log('4. Timeout callback (timer queue)');
    }, 0);
    
    // Promise callback (goes to microtask queue)
    Promise.resolve().then(() => {
        console.log('3. Promise callback (microtask queue)');
    });
    
    // Immediate callback (goes to check queue)
    setImmediate(() => {
        console.log('5. Immediate callback (check queue)');
    });
    
    console.log('2. End (synchronous)');
}

// ============================================================================
// 🎯 Main Execution Function
// ============================================================================

/**
 * Main function to run all lab tasks
 */
async function runLab() {
    console.log('🚀 Starting Lab 3: Asynchronous Programming in Node.js');
    console.log('=====================================================\n');

    // Create sample input file if it doesn't exist
    const inputFile = 'input.txt';
    const sampleContent = 'Hello, async world!';
    
    try {
        await fsPromises.writeFile(inputFile, sampleContent);
        console.log('📄 Created sample input file\n');
    } catch (err) {
        console.error('❌ Failed to create input file:', err.message);
    }

    // Task 1: Callback to Promise Conversion
    console.log('🔧 TASK 1: Callback to Promise Conversion');
    console.log('=========================================');
    
    // Callback version
    readFileCallback(inputFile, (err, data) => {
        if (err) {
            console.error('❌ Callback error:', err.message);
        } else {
            console.log('📖 Callback result:', data.trim());
        }
    });

    // Promise version
    try {
        const promiseData = await readFilePromise(inputFile);
        console.log('🔗 Promise result:', promiseData.trim());
    } catch (err) {
        console.error('❌ Promise error:', err.message);
    }

    console.log('\n');

    // Task 2: Async/Await File Processing
    console.log('⏱ TASK 2: Async/Await File Processing');
    console.log('=====================================');
    
    try {
        const asyncData = await readFileAsync(inputFile);
        console.log('⏳ Async/await result:', asyncData.trim());
    } catch (err) {
        console.error('❌ Async/await error:', err.message);
    }

    console.log('\n');

    // Task 3: Build an Async Task Queue
    console.log('📦 TASK 3: Async Task Queue');
    console.log('===========================');
    
    const queue = new AsyncTaskQueue();

    // Add multiple tasks to the queue
    const task1Promise = queue.add(async () => {
        await new Promise(r => setTimeout(r, 1000));
        console.log('✅ Task 1 complete');
        return 'Task 1 result';
    });

    const task2Promise = queue.add(async () => {
        await new Promise(r => setTimeout(r, 500));
        console.log('✅ Task 2 complete');
        return 'Task 2 result';
    });

    const task3Promise = queue.add(async () => {
        await new Promise(r => setTimeout(r, 800));
        console.log('✅ Task 3 complete');
        return 'Task 3 result';
    });

    // Wait for all tasks to complete
    try {
        const results = await Promise.all([task1Promise, task2Promise, task3Promise]);
        console.log('📋 All task results:', results);
    } catch (err) {
        console.error('❌ Task queue error:', err.message);
    }

    console.log('\n');

    // Task 4: Error Handling with Try-Catch
    console.log('🧯 TASK 4: Error Handling with Try-Catch');
    console.log('========================================');
    
    // Successful operation
    try {
        const result1 = await faultyOperation(false);
        console.log('📋 Success result:', result1);
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }

    // Failed operation
    try {
        const result2 = await faultyOperation(true);
        console.log('📋 This should not print');
    } catch (err) {
        console.error('🧯 Expected error caught:', err.message);
    }

    console.log('\n');

    // Task 5: Event Loop Demonstration
    console.log('🔁 TASK 5: Event Loop Demonstration');
    console.log('===================================');
    demonstrateEventLoop();

    // Wait a bit to see all async callbacks
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('\n🎉 Lab 3 completed successfully!');
}

// ============================================================================
// 🎬 Program Entry Point
// ============================================================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Run the lab
runLab().catch(error => {
    console.error('❌ Lab execution error:', error);
    process.exit(1);
});
