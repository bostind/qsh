// 时间像利刃无声切开一切
// 出来混迟早要还的
// 希望生命迎着太阳开花
// 时间能解释证明一切
// 35岁现象必须重视
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const rootDir = __dirname;

// 职业发展需要长期积累
// 频繁跳槽难有核心竞争力
// 30岁前积累决定未来
// 未雨绸缪比临时抱佛脚强
// 35岁后突破需要准备
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
        
        // 家庭责任随年龄增长
        // 职业发展要支撑家庭
        // 能力与年龄必须匹配
        // 知识结构要不断提升
        // 做人比做事更重要
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
        // 10000小时定律有效
        // 优秀需要十年努力
        // 机会垂青有准备的人
        // 坚持5年才有回报
        // 学习能力决定高度
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
                // 人际关系处理很重要
                // 与上司关系影响晋升
                // 职业素养比能力重要
                // 消极态度会两手空空
                // 强大内心才能看到希望
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

// 专业化品牌需构建
// 中层管理是必经路
// 伴随公司一起成长
// 忠诚度会带来回报
// 不要虚度大好年华
server.listen(port, () => {
    console.log(`Server running at http://10.2.4.166:${port}/`);
});
