// 随机用户名生成器
const adjectives = ['快乐', '聪明', '勇敢', '幸运', '勤奋', '温柔', '活泼', '安静', '幽默', '认真'];
const nouns = ['老虎', '熊猫', '狮子', '兔子', '猫咪', '狗狗', '小鸟', '海豚', '大象', '长颈鹿'];

function generateRandomUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}的${noun}${num}`;
}

// 初始化年份和月份下拉框
function initDateSelectors() {
    const startYearSelect = document.getElementById('start-year');
    const startMonthSelect = document.getElementById('start-month');
    const endYearSelect = document.getElementById('end-year');
    const endMonthSelect = document.getElementById('end-month');
    
    // 填充年份（当前年份前后5年）
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        startYearSelect.appendChild(option.cloneNode(true));
        endYearSelect.appendChild(option.cloneNode(true));
    }
    
    // 填充月份
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        startMonthSelect.appendChild(option.cloneNode(true));
        endMonthSelect.appendChild(option.cloneNode(true));
    }
}

// 数据存储
let userData = {};

// 加载JSON数据
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            userData = await response.json();
        } else {
            userData = {};
        }
    } catch (error) {
        userData = {};
    }
}

// 保存数据到JSON文件
async function saveData() {
    const username = document.getElementById('username').textContent;
    const startYear = document.getElementById('start-year').value;
    const startMonth = document.getElementById('start-month').value;
    const endYear = document.getElementById('end-year').value;
    const endMonth = document.getElementById('end-month').value;
    const money = document.getElementById('money').value;
    const thing = document.getElementById('thing').value;
    const distance = document.getElementById('distance').value;
    
    if (!username || !startYear || !startMonth || !endYear || !endMonth) {
        alert('请填写完整信息！');
        return;
    }
    
    // 创建数据结构
    if (!userData[username]) {
        userData[username] = {};
    }
    
    // 保存时间范围内的数据
    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        
        if (!userData[username][year]) {
            userData[username][year] = {};
        }
        
        userData[username][year][month] = {
            money,
            thing,
            distance
        };
    }
    
    // 保存数据到文件
    const dataStr = JSON.stringify(userData, null, 2);
    
    try {
        const response = await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dataStr
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                // 更新图表
                updateChart();
                alert('数据保存成功！');
                return;
            }
        }
        alert('数据保存失败，请重试');
    } catch (error) {
        console.error('保存错误:', error);
        alert('数据保存失败，请重试');
    }
}

// 图表初始化
let dataChart = null;

function initChart() {
    const ctx = document.getElementById('data-chart').getContext('2d');
    dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '钱',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                },
                {
                    label: '事',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: '距离',
                    data: [],
                    borderColor: 'rgb(255, 206, 86)',
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 2,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const labels = {
                                0: '少/远',
                                1: '多/近'
                            };
                            return labels[value] || '';
                        }
                    }
                }
            }
        }
    });
}

// 更新图表数据 - 显示所有用户数据
function updateChart() {
    try {
        // 收集所有年份和月份
        const allYears = new Set();
        const allMonths = new Set();
        const allData = [];
        
        // 遍历所有用户数据
        Object.keys(userData).forEach(username => {
            Object.keys(userData[username]).forEach(year => {
                allYears.add(year);
                Object.keys(userData[username][year]).forEach(month => {
                    allMonths.add(month);
                    allData.push({
                        username,
                        year,
                        month,
                        ...userData[username][year][month]
                    });
                });
            });
        });
        
        // 按年份和月份排序
        const sortedYears = Array.from(allYears).sort();
        const sortedMonths = Array.from(allMonths).sort((a, b) => a - b);
        
        // 准备图表数据
        const labels = [];
        const moneyData = [];
        const thingData = [];
        const distanceData = [];
        
        // 按时间顺序组织数据
        sortedYears.forEach(year => {
            sortedMonths.forEach(month => {
                const monthData = allData.filter(d => d.year === year && d.month === month);
                if (monthData.length > 0) {
                    labels.push(`${year}年${month}月`);
                    
                    // 计算平均值
                    const moneyAvg = monthData.reduce((sum, d) => sum + (d.money === '多' ? 1 : 0), 0) / monthData.length;
                    const thingAvg = monthData.reduce((sum, d) => sum + (d.thing === '多' ? 1 : 0), 0) / monthData.length;
                    const distanceAvg = monthData.reduce((sum, d) => sum + (d.distance === '远' ? 0 : 1), 0) / monthData.length;
                    
                    moneyData.push(moneyAvg);
                    thingData.push(thingAvg);
                    distanceData.push(distanceAvg);
                }
            });
        });
        
        if (dataChart) {
            dataChart.data.labels = labels;
            dataChart.data.datasets[0].data = moneyData;
            dataChart.data.datasets[1].data = thingData;
            dataChart.data.datasets[2].data = distanceData;
            dataChart.update();
        }
    } catch (error) {
        console.error('更新图表错误:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 首先加载数据
        await loadData();
        
        // 初始化图表
        initChart();
        
        // 如果有数据，设置默认显示第一个用户的第一年数据
        if (Object.keys(userData).length > 0) {
            const firstUsername = Object.keys(userData)[0];
            const firstYear = Object.keys(userData[firstUsername])[0];
            
            document.getElementById('username').textContent = firstUsername;
            document.getElementById('start-year').value = firstYear;
            
            // 确保DOM更新后再更新图表
            setTimeout(() => {
                updateChart();
            }, 100);
        }
        
        // 生成新用户名按钮
        document.getElementById('generate-username').addEventListener('click', () => {
            const newUsername = generateRandomUsername();
            document.getElementById('username').textContent = newUsername;
        });
        
        // 初始化日期选择器
        initDateSelectors();
        
        // 添加数据按钮事件 - 显示表单并生成随机用户名
        document.getElementById('add-data').addEventListener('click', () => {
            const username = generateRandomUsername();
            document.getElementById('username').textContent = username;
            document.querySelector('.data-form').style.display = 'block';
        });
        
        // 提交按钮事件
        document.getElementById('submit-data').addEventListener('click', async () => {
            await saveData();
            document.querySelector('.data-form').style.display = 'none';
        });
        
        // 初始更新图表
        updateChart();
        
    } catch (error) {
        console.error('初始化错误:', error);
    }
});


