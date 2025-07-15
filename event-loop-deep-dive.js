// 🔁 Event Loop Deep Dive - Understanding Node.js Execution Order
// This file provides a detailed look at how the Node.js event loop works

console.log('🔁 Event Loop Deep Dive');
console.log('======================\n');

// ============================================================================
// 🎯 Phase 1: Basic Event Loop Phases
// ============================================================================

console.log('📍 Phase 1: Basic Event Loop Understanding');
console.log('==========================================');

console.log('1️⃣ Call Stack (Synchronous)');

// Timers phase
setTimeout(() => {
    console.log('3️⃣ Timer Phase - setTimeout');
}, 0);

// I/O Callbacks phase
setImmediate(() => {
    console.log('4️⃣ Check Phase - setImmediate');
});

// Microtasks (executed after each phase)
Promise.resolve().then(() => {
    console.log('2️⃣ Microtask Queue - Promise');
});

process.nextTick(() => {
    console.log('🔄 Process NextTick (highest priority)');
});

console.log('1️⃣ Call Stack (Synchronous) - End');

// ============================================================================
// 🎯 Phase 2: Nested Event Loop Behavior
// ============================================================================

setTimeout(() => {
    console.log('\n📍 Phase 2: Nested Event Loop Behavior');
    console.log('=====================================');
    
    setTimeout(() => {
        console.log('🕐 Nested setTimeout');
    }, 0);
    
    setImmediate(() => {
        console.log('⚡ Nested setImmediate');
    });
    
    Promise.resolve().then(() => {
        console.log('🔗 Nested Promise');
    });
    
    process.nextTick(() => {
        console.log('🔄 Nested NextTick');
    });
    
    console.log('📝 Nested Synchronous');
}, 10);

// ============================================================================
// 🎯 Phase 3: I/O Operations and Event Loop
// ============================================================================

const fs = require('fs');

setTimeout(() => {
    console.log('\n📍 Phase 3: I/O Operations and Event Loop');
    console.log('=========================================');
    
    // File I/O - goes to I/O phase
    fs.readFile('input.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('❌ File read error:', err.message);
            return;
        }
        
        console.log('📄 File I/O Callback:', data.trim());
        
        // This will execute immediately after the I/O callback
        process.nextTick(() => {
            console.log('🔄 NextTick after I/O');
        });
        
        // This will execute after nextTick
        Promise.resolve().then(() => {
            console.log('🔗 Promise after I/O');
        });
        
        // This will execute in the next timer phase
        setTimeout(() => {
            console.log('⏰ Timer after I/O');
        }, 0);
        
        // This will execute in the next check phase
        setImmediate(() => {
            console.log('⚡ Immediate after I/O');
        });
    });
}, 20);

// ============================================================================
// 🎯 Phase 4: Microtask Queue Priority
// ============================================================================

setTimeout(() => {
    console.log('\n📍 Phase 4: Microtask Queue Priority');
    console.log('===================================');
    
    // Add multiple microtasks
    Promise.resolve().then(() => {
        console.log('🔗 Promise 1');
        return Promise.resolve();
    }).then(() => {
        console.log('🔗 Promise 2 (chained)');
    });
    
    Promise.resolve().then(() => {
        console.log('🔗 Promise 3');
    });
    
    // NextTick has higher priority than Promise
    process.nextTick(() => {
        console.log('🔄 NextTick 1');
        process.nextTick(() => {
            console.log('🔄 NextTick 2 (nested)');
        });
    });
    
    process.nextTick(() => {
        console.log('🔄 NextTick 3');
    });
    
    console.log('📝 Synchronous in Phase 4');
}, 30);

// ============================================================================
// 🎯 Phase 5: Event Loop Blocking
// ============================================================================

setTimeout(() => {
    console.log('\n📍 Phase 5: Event Loop Blocking (DON\'T DO THIS!)');
    console.log('================================================');
    
    console.log('🚫 Starting blocking operation...');
    
    // This blocks the event loop - BAD!
    const start = Date.now();
    while (Date.now() - start < 100) {
        // Busy wait - blocks event loop
    }
    
    console.log('🚫 Blocking operation completed');
    
    // These will be delayed because of the blocking operation above
    setTimeout(() => {
        console.log('⏰ Timer after blocking');
    }, 0);
    
    setImmediate(() => {
        console.log('⚡ Immediate after blocking');
    });
    
}, 40);

// ============================================================================
// 🎯 Phase 6: Proper Non-Blocking Patterns
// ============================================================================

setTimeout(() => {
    console.log('\n📍 Phase 6: Proper Non-Blocking Patterns');
    console.log('========================================');
    
    // Good: Use setImmediate for breaking up CPU-intensive tasks
    function processLargeDataset(data, callback) {
        if (data.length === 0) {
            callback();
            return;
        }
        
        // Process one item
        const item = data.shift();
        console.log('✅ Processed item:', item);
        
        // Yield control back to event loop
        setImmediate(() => {
            processLargeDataset(data, callback);
        });
    }
    
    const largeDataset = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    processLargeDataset(largeDataset, () => {
        console.log('🎉 All items processed without blocking!');
    });
    
}, 50);

// ============================================================================
// 🎯 Phase 7: Event Loop Phases Summary
// ============================================================================

setTimeout(() => {
    console.log('\n📍 Phase 7: Event Loop Phases Summary');
    console.log('====================================');
    console.log('🔁 Node.js Event Loop Phases:');
    console.log('1. Timer Phase - setTimeout, setInterval');
    console.log('2. Pending Callbacks - I/O callbacks deferred from previous iteration');
    console.log('3. Idle, Prepare - Internal use only');
    console.log('4. Poll Phase - Fetch new I/O events');
    console.log('5. Check Phase - setImmediate callbacks');
    console.log('6. Close Callbacks - close event callbacks');
    console.log('');
    console.log('🔄 Between each phase:');
    console.log('- Process NextTick callbacks (highest priority)');
    console.log('- Process Promise callbacks (microtasks)');
    console.log('');
    console.log('📚 Key Takeaways:');
    console.log('- process.nextTick() has highest priority');
    console.log('- Promises are microtasks, executed after each phase');
    console.log('- setImmediate() executes in check phase');
    console.log('- setTimeout() executes in timer phase');
    console.log('- Never block the event loop with synchronous operations!');
}, 60);

// Final cleanup message
setTimeout(() => {
    console.log('\n🎉 Event Loop Deep Dive Complete!');
    console.log('=================================');
    console.log('💡 Understanding the event loop is crucial for writing efficient Node.js applications!');
}, 70);
