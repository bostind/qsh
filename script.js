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

// 生成用户颜色
function getUserColor(username, index) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#FF5722', '#607D8B', '#E91E63'
    ];
    return colors[index % colors.length];
}

// 图表数据和控件
let dataChart = null;
let allChartData = {
    labels: [],
    userDatasets: {}
};

function initChart() {
    const ctx = document.getElementById('data-chart').getContext('2d');
    dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
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

// 更新可见数据范围
function updateVisibleData(startIndex, endIndex) {
    if (!dataChart || !allChartData.labels.length) return;
    
    const visibleLabels = allChartData.labels.slice(startIndex, endIndex);
    dataChart.data.labels = visibleLabels;
    
    // 更新每个用户的数据集
    Object.keys(allChartData.userDatasets).forEach(username => {
        const userData = allChartData.userDatasets[username];
        const datasets = dataChart.data.datasets.filter(d => d.user === username);
        
        if (datasets.length >= 3) {
            datasets[0].data = userData.moneyData.slice(startIndex, endIndex);
            datasets[1].data = userData.thingData.slice(startIndex, endIndex);
            datasets[2].data = userData.distanceData.slice(startIndex, endIndex);
        }
    });
    
    dataChart.update();
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
        allChartData.labels = [];
        allChartData.userDatasets = {};
        
        // 初始化每个用户的数据集
        Object.keys(userData).forEach((username, index) => {
            allChartData.userDatasets[username] = {
                moneyData: [],
                thingData: [],
                distanceData: [],
                color: getUserColor(username, index)
            };
        });
        
        // 按时间顺序组织数据
        sortedYears.forEach(year => {
            sortedMonths.forEach(month => {
                const monthData = allData.filter(d => d.year === year && d.month === month);
                if (monthData.length > 0) {
                    allChartData.labels.push(`${year}年${month}月`);
                    
                    // 为每个用户添加数据点
                    Object.keys(allChartData.userDatasets).forEach(username => {
                        const userMonthData = monthData.filter(d => d.username === username);
                        const userData = allChartData.userDatasets[username];
                        
                        if (userMonthData.length > 0) {
                            userData.moneyData.push(userMonthData[0].money === '多' ? 1 : 0);
                            userData.thingData.push(userMonthData[0].thing === '多' ? 1 : 0);
                            userData.distanceData.push(userMonthData[0].distance === '远' ? 0 : 1);
                        } else {
                            // 没有数据时填充null
                            userData.moneyData.push(null);
                            userData.thingData.push(null);
                            userData.distanceData.push(null);
                        }
                    });
                }
            });
        });
        
        // 创建数据集
        dataChart.data.datasets = [];
        Object.keys(allChartData.userDatasets).forEach((username, index) => {
            const userData = allChartData.userDatasets[username];
            const color = userData.color;
            
            // 钱数据集
            dataChart.data.datasets.push({
                label: `${username}-钱`,
                data: userData.moneyData,
                borderColor: color,
                backgroundColor: color + '80',
                tension: 0.1,
                user: username,
                category: 'money'
            });
            
            // 事数据集
            dataChart.data.datasets.push({
                label: `${username}-事`,
                data: userData.thingData,
                borderColor: color,
                backgroundColor: color + '80',
                tension: 0.1,
                borderDash: [5, 5],
                user: username,
                category: 'thing'
            });
            
            // 距离数据集
            dataChart.data.datasets.push({
                label: `${username}-距离`,
                data: userData.distanceData,
                borderColor: color,
                backgroundColor: color + '80',
                tension: 0.1,
                borderDash: [10, 5],
                user: username,
                category: 'distance'
            });
        });
        
        // 初始化滑块控件
        const rangeSlider = document.getElementById('chart-range');
        const dataLength = allChartData.labels.length;
        const displayCount = Math.min(30, dataLength);
        
        rangeSlider.min = 0;
        rangeSlider.max = Math.max(0, dataLength - displayCount);
        rangeSlider.value = 0;
        
        // 默认显示最近30个数据点
        const startIndex = Math.max(0, dataLength - displayCount);
        updateVisibleData(startIndex, dataLength);
        
        // 添加滑块事件监听
        rangeSlider.addEventListener('input', function() {
            const startIndex = parseInt(this.value);
            const endIndex = Math.min(startIndex + displayCount, dataLength);
            updateVisibleData(startIndex, endIndex);
        });
        
        // 更新范围标签
        if (dataLength > 0) {
            document.getElementById('range-start').textContent = '最新';
            document.getElementById('range-end').textContent = '最早';
        }
    } catch (error) {
        console.error('更新图表错误:', error);
    }
}

// 计算总用户数
function calculateTotalUsers() {
    const totalUsers = Object.keys(userData).length;
    document.getElementById('total-users').textContent = totalUsers;
}

// 计算数据时间范围
function calculateDateRange() {
    let minDate = { year: Infinity, month: Infinity };
    let maxDate = { year: -Infinity, month: -Infinity };
    let hasData = false;

    // 遍历所有用户数据
    Object.values(userData).forEach(user => {
        Object.entries(user).forEach(([yearStr, months]) => {
            const year = parseInt(yearStr);
            const monthStrs = Object.keys(months);
            if (monthStrs.length > 0) {
                hasData = true;
                const minMonth = Math.min(...monthStrs.map(Number));
                const maxMonth = Math.max(...monthStrs.map(Number));
                
                // 检查是否为更早的日期
                if (year < minDate.year || 
                    (year === minDate.year && minMonth < minDate.month)) {
                    minDate = { year, month: minMonth };
                }
                
                // 检查是否为更晚的日期
                if (year > maxDate.year || 
                    (year === maxDate.year && maxMonth > maxDate.month)) {
                    maxDate = { year, month: maxMonth };
                }
            }
        });
    });

    if (hasData) {
        document.getElementById('date-range').textContent = 
            `${minDate.year}年${minDate.month}月 - ${maxDate.year}年${maxDate.month}月`;
    } else {
        document.getElementById('date-range').textContent = '暂无数据';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 首先加载数据
        await loadData();
        
        // 更新概览统计
        calculateTotalUsers();
        calculateDateRange();
        
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


