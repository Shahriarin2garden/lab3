// >> Lab 3 Test File - Individual Component Tests
// This file tests individual components of the lab

const fs = require('fs');
const fsPromises = require('fs/promises');

// Import the AsyncTaskQueue class (we'll need to extract it)
class AsyncTaskQueue {
    constructor() {
        this.tasks = [];
        this.isRunning = false;
    }

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

    async process() {
        if (this.isRunning || this.tasks.length === 0) {
            return;
        }

        this.isRunning = true;
        let taskCount = 0;

        while (this.tasks.length > 0) {
            const { task, resolve, reject } = this.tasks.shift();
            
            try {
                taskCount++;
                console.log(`> Testing task ${taskCount}...`);
                const result = await task();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }

        this.isRunning = false;
        console.log(`+ All ${taskCount} tasks completed!`);
    }
}

// Test functions
async function testPromiseChaining() {
    console.log('> Testing Promise Chaining');
    console.log('===========================');
    
    const promise1 = Promise.resolve('First');
    const promise2 = promise1.then(result => result + ' Second');
    const promise3 = promise2.then(result => result + ' Third');
    
    try {
        const result = await promise3;
        console.log('+ Promise chain result:', result);
    } catch (error) {
        console.error('! Promise chain error:', error.message);
    }
}

async function testParallelExecution() {
    console.log('\n> Testing Parallel Execution');
    console.log('=============================');
    
    const start = Date.now();
    
    // Sequential execution
    console.log('| Sequential execution...');
    const sequentialStart = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    await new Promise(resolve => setTimeout(resolve, 100));
    await new Promise(resolve => setTimeout(resolve, 100));
    const sequentialTime = Date.now() - sequentialStart;
    
    // Parallel execution
    console.log('+ Parallel execution...');
    const parallelStart = Date.now();
    await Promise.all([
        new Promise(resolve => setTimeout(resolve, 100)),
        new Promise(resolve => setTimeout(resolve, 100)),
        new Promise(resolve => setTimeout(resolve, 100))
    ]);
    const parallelTime = Date.now() - parallelStart;
    
    console.log(`| Sequential time: ${sequentialTime}ms`);
    console.log(`| Parallel time: ${parallelTime}ms`);
    console.log(`+ Speedup: ${(sequentialTime / parallelTime).toFixed(2)}x`);
}

async function testErrorPropagation() {
    console.log('\n> Testing Error Propagation');
    console.log('============================');
    
    async function level1() {
        throw new Error('Error from level 1');
    }
    
    async function level2() {
        try {
            await level1();
        } catch (error) {
            console.log('| Caught in level 2, re-throwing...');
            throw new Error(`Level 2 wrapper: ${error.message}`);
        }
    }
    
    async function level3() {
        try {
            await level2();
        } catch (error) {
            console.log('+ Final catch in level 3:', error.message);
        }
    }
    
    await level3();
}

async function testTaskQueue() {
    console.log('\n> Testing Task Queue');
    console.log('====================');
    
    const queue = new AsyncTaskQueue();
    
    // Add tasks with different execution times
    const tasks = [
        queue.add(async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return 'Quick task';
        }),
        queue.add(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return 'Very quick task';
        }),
        queue.add(async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            return 'Medium task';
        })
    ];
    
    const results = await Promise.all(tasks);
    console.log('| Task results:', results);
}

// Main test runner
async function runTests() {
    console.log('>> Running Lab 3 Component Tests');
    console.log('================================\n');
    
    await testPromiseChaining();
    await testParallelExecution();
    await testErrorPropagation();
    await testTaskQueue();
    
    console.log('\n* All tests completed!');
}

// Run tests
runTests().catch(error => {
    console.error('! Test runner error:', error);
    process.exit(1);
});
