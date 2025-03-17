const http = require ('node:http');
const fs = require ('node:fs');

const createFile = () => {
    fs.writeFile('user.txt', `hi`, (err) => {
        if (err) {
            console.error('File has not been created', err);
        } else {
            console.log('user.txt file has been created');
        }
    });
};

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(8080, () => {
    console.log('Server running on 8080 port');
    createFile();
});