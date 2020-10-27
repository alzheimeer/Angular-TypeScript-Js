const os = require('os');

console.log('version', os.release());
console.log('version', os.freemem());
console.log('version', os.totalmem());
console.log('version', os.cpus());