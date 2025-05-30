/**
 * 数据可视化服务
 * 提供数据保存API和静态文件服务
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// 服务器配置
const port = 8866;
const rootDir = __dirname;

/**
 * 创建HTTP服务器处理请求
 * 1. 处理POST /save API保存数据
 * 2. 提供静态文件服务
 */
const server = http.createServer((req, res) => {
    // 处理数据保存请求
    if (req.method === 'POST' && req.url === '/save') {
        // 验证Content-Type
        if (req.headers['content-type'] !== 'application/json') {
            res.writeHead(400);
            return res.end('Invalid content type');
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        // 处理请求体数据
        req.on('end', () => {
            try {
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
        // 处理静态文件请求
        let filePath = path.join(rootDir, req.url === '/' ? 'index.html' : req.url);
        
        // 读取并返回静态文件
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
                // 人际关系处理很重要
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

// 启动服务器
server.listen(port, () => {
    console.log(`Server running at http://qsh.bostind.com:${port}/`);
});
