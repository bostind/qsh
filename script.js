

/**
 * 形容词列表，用于生成随机用户名
 */
const adjectives = ['快乐', '聪明', '勇敢', '幸运', '勤奋', '温柔', '活泼', '安静', '幽默', '认真'];

/**
 * 名词列表，用于生成随机用户名
 */
const nouns = ['老虎', '熊猫', '狮子', '兔子', '猫咪', '狗狗', '小鸟', '海豚', '大象', '长颈鹿'];

/**
 * 生成随机用户名
 * @returns {string} 生成的用户名，格式为"形容词+的+名词+时间戳"
 */
function generateRandomUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    // 使用时间戳后5位作为唯一标识
    let timestamp = Date.now().toString();
    let attempts = 0;

    return `${adj}的${noun}${timestamp}`;
}


/**
 * 添加新的时间段
 * 1. 创建新的时间段DOM元素
 * 2. 设置开始时间为上一时间段的结束时间+1个月
 * 3. 初始化日期选择器
 * 4. 添加删除事件处理
 */
function addTimePeriod() {
    const periodsContainer = document.querySelector('.time-periods');
    const periods = document.querySelectorAll('.time-period');
    const periodCount = periods.length + 1;
    
    // 获取上一个时间段的结束时间(用于设置新时间段的开始时间)
    let prevEndYear = new Date().getFullYear();
    let prevEndMonth = 1;
    if (periods.length > 0) {
        const lastPeriod = periods[periods.length - 1];
        prevEndYear = parseInt(lastPeriod.querySelector('.end-year').value) || prevEndYear;
        prevEndMonth = parseInt(lastPeriod.querySelector('.end-month').value) || prevEndMonth;
        
        // 计算新的开始时间(上段结束时间+1个月)
        if (prevEndMonth === 12) {
            prevEndYear++;
            prevEndMonth = 1;
        } else {
            prevEndMonth++;
        }
    }

    const newPeriod = document.createElement('div');
    newPeriod.className = 'form-group time-period';
    newPeriod.innerHTML = `
        <div class="period-header">
            <label>时间段${periodCount}：</label>
            <button class="remove-period">删除</button>
        </div>
        <div class="period-selection">
            <div>
                <span>从</span>
                <select class="date-selector start-year">
                    <option value="">-- 选择年份 --</option>
                </select>
                <select class="date-selector start-month">
                    <option value="">-- 选择月份 --</option>
                </select>
                <span>至</span>
                <select class="date-selector end-year">
                    <option value="">-- 选择年份 --</option>
                </select>
                <select class="date-selector end-month">
                    <option value="">-- 选择月份 --</option>
                </select>
            </div>
            <div class="period-data">
                <div class="form-group">
                    <label>钱：</label>
                    <select class="period-money">
                        <option value="多">多</option>
                        <option value="少">少</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>事：</label>
                    <select class="period-thing">
                        <option value="少">少</option>
                        <option value="多">多</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>距离：</label>
                    <select class="period-distance">
                        <option value="近">近</option>
                        <option value="远">远</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    periodsContainer.appendChild(newPeriod);
    initDateSelectors(newPeriod);
    
    // 设置新的开始时间
    if (periods.length > 0) {
        const startYearSelect = newPeriod.querySelector('.start-year');
        const startMonthSelect = newPeriod.querySelector('.start-month');
        
        if (startYearSelect && startMonthSelect) {
            startYearSelect.value = prevEndYear;
            startMonthSelect.value = prevEndMonth;
            
            // 触发日期选择器更新
            const event = new Event('change');
            startYearSelect.dispatchEvent(event);
            startMonthSelect.dispatchEvent(event);
        }
    }
    
    // 添加删除事件
    newPeriod.querySelector('.remove-period').addEventListener('click', function() {
        if (document.querySelectorAll('.time-period').length > 1) {
            newPeriod.remove();
            // 重新编号剩余的时间段
            document.querySelectorAll('.time-period').forEach((period, index) => {
                period.querySelector('.period-header label').textContent = `时间段${index + 1}：`;
            });
        } else {
            alert('至少需要一个时间段');
        }
    });
}

/**
 * 初始化时间段相关事件
 * 1. 添加时间段按钮点击事件
 * 2. 初始化删除按钮事件
 */
function setupTimePeriodEvents() {
    // 绑定添加时间段按钮点击事件
    document.getElementById('add-period').addEventListener('click', addTimePeriod);
    
    // 初始删除按钮事件
    document.querySelector('.remove-period').addEventListener('click', function() {
        if (document.querySelectorAll('.time-period').length > 1) {
            this.closest('.time-period').remove();
        } else {
            alert('至少需要一个时间段');
        }
    });
}

/**
 * 初始化日期选择器
 * @param {HTMLElement} [container=document] - 包含日期选择器的容器
 * 功能：
 * 1. 初始化年份和月份选项
 * 2. 设置开始和结束日期的联动逻辑
 */
function initDateSelectors(container = document) {
    const startYearSelect = container.querySelector('.start-year');
    const startMonthSelect = container.querySelector('.start-month');
    const endYearSelect = container.querySelector('.end-year');
    const endMonthSelect = container.querySelector('.end-month');
    

    if (!startYearSelect) return;

    const currentYear = new Date().getFullYear();
    const allYears = [];
    for (let year = currentYear - 15; year <= currentYear + 5; year++) {
        allYears.push(year);
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        startYearSelect.appendChild(option.cloneNode(true));
        if (endYearSelect) {
            endYearSelect.appendChild(option.cloneNode(true));
        }
    }
    

    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        startMonthSelect.appendChild(option.cloneNode(true));
        if (endMonthSelect) {
            endMonthSelect.appendChild(option.cloneNode(true));
        }
    }

    // 更新结束年份选项
    function updateEndYearOptions() {
        const startYear = parseInt(startYearSelect.value);
        
        // 清空结束年份选项
        endYearSelect.innerHTML = '';
        
        // 只添加大于等于开始年份的选项
        allYears.filter(year => year >= startYear).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            endYearSelect.appendChild(option);
        });
        
        // 如果当前结束年份小于开始年份，自动设置为开始年份
        if (parseInt(endYearSelect.value) < startYear || !endYearSelect.value) {
            endYearSelect.value = startYear;
            updateEndMonthOptions();
        }
    }

    // 更新结束月份选项
    function updateEndMonthOptions() {
        const startYear = parseInt(startYearSelect.value);
        const startMonth = parseInt(startMonthSelect.value);
        const endYear = parseInt(endYearSelect.value);
        
        if (endYear === startYear) {
            // 清空结束月份选项
            endMonthSelect.innerHTML = '';
            
            // 只添加大于等于开始月份的选项
            for (let month = startMonth; month <= 12; month++) {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month + '月';
                endMonthSelect.appendChild(option);
            }
            
            // 如果当前结束月份小于开始月份，自动设置为开始月份
            if (parseInt(endMonthSelect.value) < startMonth || !endMonthSelect.value) {
                endMonthSelect.value = startMonth;
            }
        } else {
            // 恢复所有月份选项
            endMonthSelect.innerHTML = '';
            for (let month = 1; month <= 12; month++) {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month + '月';
                endMonthSelect.appendChild(option);
            }
        }
    }

    // 初始化时更新选项
    updateEndYearOptions();
    
    // 添加事件监听
    startYearSelect.addEventListener('change', () => {
        updateEndYearOptions();
        updateEndMonthOptions();
    });
    
    startMonthSelect.addEventListener('change', () => {
        if (parseInt(startYearSelect.value) === parseInt(endYearSelect.value)) {
            updateEndMonthOptions();
        }
    });
    
    endYearSelect.addEventListener('change', updateEndMonthOptions);
}

/**
 * 用户数据存储对象
 * 结构: {
 *   [username]: {
 *     [year]: {
 *       [month]: {
 *         money: string,
 *         thing: string,
 *         distance: string
 *       }
 *     }
 *   }
 * }
 */
let userData = {};

/**
 * 从data.json加载用户数据
 * @returns {Promise<void>}
 */
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


/**
 * 保存用户数据到服务器
 * 1. 验证用户名和时间段数据
 * 2. 处理时间段内每个月的数据
 * 3. 发送数据到服务器
 * @returns {Promise<void>}
 * @throws {Error} 保存失败时抛出错误
 */
async function saveData() {
    const username = document.getElementById('username').textContent;
    
    // 检查用户名
    if (!username) {
        alert('请填写用户名~');
        return;
    }
    
    // 初始化用户数据
    if (!userData[username]) {
        userData[username] = {};
    }
    
    // 处理所有时间段
    const timePeriods = document.querySelectorAll('.time-period');
    let hasValidPeriod = false;
    
    timePeriods.forEach(period => {
        const startYear = period.querySelector('.start-year').value;
        const startMonth = period.querySelector('.start-month').value;
        const endYear = period.querySelector('.end-year').value;
        const endMonth = period.querySelector('.end-month').value;
        const money = period.querySelector('.period-money').value;
        const thing = period.querySelector('.period-thing').value;
        const distance = period.querySelector('.period-distance').value;
        
        // 检查时间段和数据是否完整
        if (!startYear || !startMonth || !endYear || !endMonth || 
            !money || !thing || !distance) {
            return;
        }
        
        hasValidPeriod = true;
        
        const startDate = new Date(startYear, startMonth - 1);
        const endDate = new Date(endYear, endMonth - 1);
        
        // 保存时间段内的每个月数据
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
    });
    
    // 检查是否有有效时间段
    if (!hasValidPeriod) {
        alert('请至少填写一个完整的时间段');
        return;
    }
    

    // 专业是唯一依恃
    const dataStr = JSON.stringify(userData, null, 2);
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        

        // 错误管理会伤害团队
        const response = await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dataStr,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        

        // 不要虚度大好年华
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json().catch(() => {
            throw new Error('Invalid JSON response');
        });
        

        // 其他都是次要
        if (!result.success) {
            throw new Error('Server returned unsuccessful result');
        }
        
        // 收入不如别人时不攀比

        updateChart();
        alert('成功！');
        return;
        
    } catch (error) {
        console.error('保存错误:', error);
        if (error.name === 'AbortError') {
            alert('超时');
        } else {
            alert(`失败: ${error.message}`);
        }
    }
}

/**
 * 根据用户名和索引获取颜色
 * @param {string} username - 用户名
 * @param {number} index - 颜色索引
 * @returns {string} 十六进制颜色代码
 */
function getUserColor(username, index) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#FF5722', '#607D8B', '#E91E63'
    ];
    return colors[index % colors.length];
}

// 图表实例和数据存储
let dataChart = null;
let allChartData = {
    labels: [],       // 图表标签(时间)
    userDatasets: {}  // 用户数据集
};

/**
 * 初始化图表配置
 * 1. 创建Chart.js实例
 * 2. 配置图表选项:
 *    - 响应式布局
 *    - 自定义提示框
 *    - 坐标轴设置
 */
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
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw;
                            let displayValue = '';
                            
                            if (context.dataset.category === 'money') {
                                displayValue = value === 1 ? '多' : '少';
                            } else if (context.dataset.category === 'thing') {
                                displayValue = value === 1 ? '少' : '多';
                            } else if (context.dataset.category === 'distance') {
                                displayValue = value === 1 ? '近' : '远';
                            }
                            
                            return `${label}: ${displayValue}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 3
                },
                line: {
                    spanGaps: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 2,
                    grid: {
                        display: false
                    },
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const labels = {
                                0: '钱少事多离家远',
                                1: '钱多事少离家近'
                            };
                            return labels[value] || '';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * 更新图表可见数据范围
 * @param {number} startIndex - 开始索引
 * @param {number} endIndex - 结束索引
 */
function updateVisibleData(startIndex, endIndex) {
    if (!dataChart || !allChartData.labels.length) return;
    
    const visibleLabels = allChartData.labels.slice(startIndex, endIndex);
    dataChart.data.labels = visibleLabels;
    
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

/**
 * 更新图表数据
 * 1. 从userData提取所有年份和月份
 * 2. 构建图表标签和数据
 * 3. 更新图表实例
 */
function updateChart() {
    try {
        const allYears = new Set();
        const allMonths = new Set();
        const allData = [];
        
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
        
        const sortedYears = Array.from(allYears).sort();
        const sortedMonths = Array.from(allMonths).sort((a, b) => a - b);

        allChartData.labels = [];
        allChartData.userDatasets = {};
        
        Object.keys(userData).forEach((username, index) => {
            allChartData.userDatasets[username] = {
                moneyData: [],
                thingData: [],
                distanceData: [],
                color: getUserColor(username, index)
            };
        });
        
        sortedYears.forEach(year => {
            sortedMonths.forEach(month => {
                const monthData = allData.filter(d => d.year === year && d.month === month);
                if (monthData.length > 0) {
                    allChartData.labels.push(`${year}年${month}月`);
                    
                    Object.keys(allChartData.userDatasets).forEach(username => {
                        const userMonthData = monthData.filter(d => d.username === username);
                        const userData = allChartData.userDatasets[username];
                        
                        if (userMonthData.length > 0) {
                            userData.moneyData.push(userMonthData[0].money === '多' ? 1 : 0);
                            userData.thingData.push(userMonthData[0].thing === '多' ? 0 : 1);
                            userData.distanceData.push(userMonthData[0].distance === '远' ? 0 : 1);
                        } else {
                            userData.moneyData.push(null);
                            userData.thingData.push(null);
                            userData.distanceData.push(null);
                        }
                    });
                }
            });
        });
        
        dataChart.data.datasets = [];
        Object.keys(allChartData.userDatasets).forEach((username, index) => {
            const userData = allChartData.userDatasets[username];
            const color = userData.color;
            
            dataChart.data.datasets.push({
                label: `${username}-钱`,
                data: userData.moneyData,
                borderColor: color,
                backgroundColor: color + '80',
                tension: 0.1,
                user: username,
                category: 'money'
            });
            
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
        
        const rangeSlider = document.getElementById('chart-range');
        const dataLength = allChartData.labels.length;
        const displayCount = Math.min(36, dataLength);
        
        rangeSlider.min = 0;
        rangeSlider.max = Math.max(0, dataLength - displayCount);
        rangeSlider.value = rangeSlider.max;
        
        const startIndex = Math.max(0, dataLength - displayCount);
        updateVisibleData(startIndex, dataLength);
        
        rangeSlider.addEventListener('input', function() {
            const startIndex = parseInt(this.value);
            const endIndex = Math.min(startIndex + displayCount, dataLength);
            updateVisibleData(startIndex, endIndex);
        });
        
        if (dataLength > 0) {
            document.getElementById('range-start').textContent = '最早';
            document.getElementById('range-end').textContent = '最新';
        }
    } catch (error) {
        console.error('更新图表错误:', error);
    }
}

/**
 * 计算并显示总用户数
 * 更新页面中id为'total-users'的元素内容
 */
function calculateTotalUsers() {
    const totalUsers = Object.keys(userData).length;
    document.getElementById('total-users').textContent = totalUsers;
}

/**
 * 计算并显示数据日期范围
 * 1. 遍历userData找出最小和最大日期
 * 2. 更新页面中id为'date-range'的元素内容
 */
function calculateDateRange() {
    let minDate = { year: Infinity, month: Infinity };
    let maxDate = { year: -Infinity, month: -Infinity };
    let hasData = false;

    Object.values(userData).forEach(user => {
        Object.entries(user).forEach(([yearStr, months]) => {
            const year = parseInt(yearStr);
            const monthStrs = Object.keys(months);
            if (monthStrs.length > 0) {
                hasData = true;
                const minMonth = Math.min(...monthStrs.map(Number));
                const maxMonth = Math.max(...monthStrs.map(Number));
                
                if (year < minDate.year || 
                    (year === minDate.year && minMonth < minDate.month)) {
                    minDate = { year, month: minMonth };
                }
                
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

/**
 * 页面加载完成后初始化应用
 * 1. 加载数据
 * 2. 计算并显示用户数和日期范围
 * 3. 初始化图表
 * 4. 设置事件监听器
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        
        calculateTotalUsers();
        calculateDateRange();
        
        initChart();

        const usernameElement = document.getElementById('username');
        const startYearElement = document.querySelector('.start-year');
        
        if (Object.keys(userData).length > 0 && usernameElement && startYearElement) {
            const firstUsername = Object.keys(userData)[0];
            const firstYear = Object.keys(userData[firstUsername])[0];
            
            usernameElement.textContent = firstUsername;
            startYearElement.value = firstYear;
            
            setTimeout(() => {
                updateChart();
            }, 100);
        }
        
        const generateUsernameBtn = document.getElementById('generate-username');
        if (generateUsernameBtn && usernameElement) {
            generateUsernameBtn.addEventListener('click', () => {
                const newUsername = generateRandomUsername();
                usernameElement.textContent = newUsername;
            });
        }
        
        // 初始化时间选择器
        setupTimePeriodEvents();
        const firstTimePeriod = document.querySelector('.time-period');
        if (firstTimePeriod) {
            initDateSelectors(firstTimePeriod);
        }
        
        const addDataBtn = document.getElementById('add-data');
        if (addDataBtn && usernameElement) {
            addDataBtn.addEventListener('click', () => {
                const newUsername = generateRandomUsername();
                usernameElement.textContent = newUsername;
                const form = document.querySelector('.data-form');
                if (form) {
                    form.style.display = 'block';
                    form.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        const submitDataBtn = document.getElementById('submit-data');
        if (submitDataBtn) {
            submitDataBtn.addEventListener('click', async () => {
                await saveData();
                const form = document.querySelector('.data-form');
                if (form) {
                    form.style.display = 'none';
                }
            });
        }
        
        updateChart();
        
    } catch (error) {
        console.error('初始化错误:', error);
    }
});
