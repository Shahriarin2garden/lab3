// 📚 Lab 3 Examples - Practical Usage Patterns
// This file demonstrates practical usage of the async patterns

const fs = require('fs');
const fsPromises = require('fs/promises');

// ============================================================================
// 🌟 Example 1: Converting Callback Hell to Clean Async/Await
// ============================================================================

// BAD: Callback Hell Example
function callbackHellExample() {
    console.log('💀 Callback Hell Example:');
    
    fs.readFile('input.txt', 'utf8', (err1, data1) => {
        if (err1) {
            console.error('Error reading file 1:', err1);
            return;
        }
        
        fs.writeFile('temp1.txt', data1.toUpperCase(), (err2) => {
            if (err2) {
                console.error('Error writing file 1:', err2);
                return;
            }
            
            fs.readFile('temp1.txt', 'utf8', (err3, data2) => {
                if (err3) {
                    console.error('Error reading file 2:', err3);
                    return;
                }
                
                fs.writeFile('temp2.txt', data2 + ' - PROCESSED', (err4) => {
                    if (err4) {
                        console.error('Error writing file 2:', err4);
                        return;
                    }
                    
                    console.log('✅ Callback hell completed (but messy!)');
                });
            });
        });
    });
}

// GOOD: Clean Async/Await Example
async function cleanAsyncExample() {
    console.log('✨ Clean Async/Await Example:');
    
    try {
        // Read original file
        const data1 = await fsPromises.readFile('input.txt', 'utf8');
        
        // Write uppercase version
        await fsPromises.writeFile('temp1.txt', data1.toUpperCase());
        
        // Read the uppercase version
        const data2 = await fsPromises.readFile('temp1.txt', 'utf8');
        
        // Write final processed version
        await fsPromises.writeFile('temp2.txt', data2 + ' - PROCESSED');
        
        console.log('✅ Clean async/await completed!');
    } catch (error) {
        console.error('❌ Error in clean async example:', error.message);
    }
}

// ============================================================================
// 🌟 Example 2: Concurrent File Processing
// ============================================================================

async function concurrentFileProcessing() {
    console.log('\n⚡ Concurrent File Processing Example:');
    
    const filesToProcess = ['input.txt', 'input.txt', 'input.txt']; // Simulate multiple files
    const startTime = Date.now();
    
    try {
        // Process all files concurrently
        const results = await Promise.all(
            filesToProcess.map(async (filename, index) => {
                const data = await fsPromises.readFile(filename, 'utf8');
                const processedData = `File ${index + 1}: ${data.trim().toUpperCase()}`;
                await fsPromises.writeFile(`output${index + 1}.txt`, processedData);
                return processedData;
            })
        );
        
        const endTime = Date.now();
        console.log(`✅ Processed ${results.length} files in ${endTime - startTime}ms`);
        console.log('📋 Results:', results);
        
    } catch (error) {
        console.error('❌ Error in concurrent processing:', error.message);
    }
}

// ============================================================================
// 🌟 Example 3: Advanced Error Handling Patterns
// ============================================================================

async function advancedErrorHandling() {
    console.log('\n🛡️ Advanced Error Handling Example:');
    
    // Retry mechanism
    async function retryOperation(operation, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
                
                if (attempt === maxRetries) {
                    throw new Error(`Operation failed after ${maxRetries} attempts: ${error.message}`);
                }
                
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
            }
        }
    }
    
    // Simulate unreliable operation
    let attemptCount = 0;
    const unreliableOperation = async () => {
        attemptCount++;
        if (attemptCount < 3) {
            throw new Error(`Simulated failure ${attemptCount}`);
        }
        return 'Success after retries!';
    };
    
    try {
        const result = await retryOperation(unreliableOperation);
        console.log('✅ Retry result:', result);
    } catch (error) {
        console.error('❌ Final error:', error.message);
    }
}

// ============================================================================
// 🌟 Example 4: Timeout and Cancellation
// ============================================================================

async function timeoutExample() {
    console.log('\n⏰ Timeout Example:');
    
    // Create a promise that times out
    function withTimeout(promise, timeoutMs) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
            )
        ]);
    }
    
    // Slow operation
    const slowOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return 'Slow operation completed';
    };
    
    try {
        // This will timeout
        const result1 = await withTimeout(slowOperation(), 1000);
        console.log('✅ Result 1:', result1);
    } catch (error) {
        console.log('⏰ Expected timeout:', error.message);
    }
    
    try {
        // This will succeed
        const result2 = await withTimeout(slowOperation(), 3000);
        console.log('✅ Result 2:', result2);
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

// ============================================================================
// 🌟 Example 5: Stream Processing (Advanced)
// ============================================================================

async function streamProcessingExample() {
    console.log('\n🌊 Stream Processing Example:');
    
    const { pipeline } = require('stream/promises');
    const { Transform } = require('stream');
    
    // Create a transform stream
    const upperCaseTransform = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString().toUpperCase());
        }
    });
    
    try {
        // Process file using streams
        await pipeline(
            fs.createReadStream('input.txt'),
            upperCaseTransform,
            fs.createWriteStream('stream_output.txt')
        );
        
        console.log('✅ Stream processing completed');
        
        // Read the result
        const result = await fsPromises.readFile('stream_output.txt', 'utf8');
        console.log('📋 Stream result:', result.trim());
        
    } catch (error) {
        console.error('❌ Stream processing error:', error.message);
    }
}

// ============================================================================
// 🚀 Main Example Runner
// ============================================================================

async function runExamples() {
    console.log('📚 Lab 3 Practical Examples');
    console.log('===========================');
    
    // Run callback hell example (non-blocking)
    callbackHellExample();
    
    // Wait a bit for callback hell to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Run async examples
    await cleanAsyncExample();
    await concurrentFileProcessing();
    await advancedErrorHandling();
    await timeoutExample();
    await streamProcessingExample();
    
    console.log('\n🎉 All examples completed!');
    
    // Cleanup temporary files
    const tempFiles = ['temp1.txt', 'temp2.txt', 'output1.txt', 'output2.txt', 'output3.txt', 'stream_output.txt'];
    for (const file of tempFiles) {
        try {
            await fsPromises.unlink(file);
        } catch (error) {
            // Ignore cleanup errors
        }
    }
}

// Run examples
runExamples().catch(error => {
    console.error('❌ Examples runner error:', error);
    process.exit(1);
});
