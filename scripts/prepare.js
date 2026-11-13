const fs = require('fs');
fs.mkdirSync('app', { recursive: true });
fs.copyFileSync('node_modules/jszip/dist/jszip.min.js', 'app/jszip.min.js');
console.log('jszip скопирован в app');
