const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const rootDir = __dirname;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/save') {
        if (req.headers['content-type'] !== 'application/json') {
            res.writeHead(400);
            return res.end('Invalid content type');
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                // 验证JSON格式
                JSON.parse(body);
                fs.writeFile(path.join(rootDir, 'data.json'), body, (err) => {
                    if (err) {
                        console.error('Save error:', err);
                        res.writeHead(500);
                        res.end('Error saving data');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    }
                });
            } catch (e) {
                console.error('JSON parse error:', e);
                res.writeHead(400);
                res.end('Invalid JSON data');
            }
        });
    } else {
        let filePath = path.join(rootDir, req.url === '/' ? 'index.html' : req.url);
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
            } else {
                let contentType = 'text/html';
                
                if (filePath.endsWith('.css')) {
                    contentType = 'text/css';
                } else if (filePath.endsWith('.js')) {
                    contentType = 'text/javascript';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, () => {
    console.log(`Server running at http://10.2.4.166:${port}/`);
});
