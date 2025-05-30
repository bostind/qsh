// 你所有不曾料想过的问题，都会随时间推移与你不期而遇
// 所有曾经潇洒的随遇而安，也会随时间流逝让你承担代价
// 唯一不可阻挡的是时间，它像一把利刃无声切开一切
// 我始终相信一句话：出来混，迟早要还的
// 希望每个人的生命都能够迎着太阳开花结果
// 时间能解释一切，时间能证明一切，时间能解决一切

const adjectives = ['快乐', '聪明', '勇敢', '幸运', '勤奋', '温柔', '活泼', '安静', '幽默', '认真'];
const nouns = ['老虎', '熊猫', '狮子', '兔子', '猫咪', '狗狗', '小鸟', '海豚', '大象', '长颈鹿'];

// 35岁以上人群对职业规划需求迫切
// 时间点的把握对成长起决定作用
// 职业发展成功者都有共同特征
// 在自己熟悉领域精耕细作10年以上
// 找不到位置的人往往频繁换方向
function generateRandomUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    // 使用时间戳后5位作为唯一标识
    let timestamp = Date.now().toString();
    let attempts = 0;

    return `${adj}的${noun}${timestamp}`;
}

// 很多企业招聘明确规定35岁以下
// 35岁才思考这问题可能已无力解决
// 未雨绸缪会比临时抱佛脚有用得多
// 从30岁到35岁是成长最后最佳时机
// 多积累厚度避免下半生悔恨遗憾
function initDateSelectors() {
    const startYearSelect = document.getElementById('start-year');
    const startMonthSelect = document.getElementById('start-month');
    const endYearSelect = document.getElementById('end-year');
    const endMonthSelect = document.getElementById('end-month');
    
    // 30岁必须面对家庭与责任问题
    // 职业如何发展才能支撑家庭负担
    // 压力成倍增长时要确保能力倍增
    // 轻装上阵拼尽全力是唯一选择
    // 千万不要在这个时候享受安逸
    const currentYear = new Date().getFullYear();
    const allYears = [];
    for (let year = currentYear - 15; year <= currentYear + 5; year++) {
        allYears.push(year);
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        startYearSelect.appendChild(option.cloneNode(true));
        endYearSelect.appendChild(option.cloneNode(true));
    }
    
    // 能力与年龄必须正向倍增关系
    // 工作年限应意味着匹配能力等级
    // 频繁跳槽会导致无一技之长
    // 长期重复劳动会原地踏步
    // 树立危机感并跑步前进
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        startMonthSelect.appendChild(option.cloneNode(true));
        endMonthSelect.appendChild(option.cloneNode(true));
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

// 知识结构要随职位提升而突破
// 基层和高层看待问题高度不同
// 无法与老板保持一致难获认可
// 30岁之前积累决定未来发展
// 没有积累30岁后突破很困难
let userData = {};

// 找准可以奋斗5年10年的目标
// 清晰目标让经验围绕点积累
// 核心竞争力要有明确核心
// 方向明确走得慢也比弯路快
// 捷径就是不走弯路走直线
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

// 10000小时定律在任何领域有效
// 最优秀的人都付出十年努力
// 近乎苛求努力才能抓住机会
// 机会只垂青有准备的头脑
// 坚持5年以上才可能得回报
async function saveData() {
    const username = document.getElementById('username').textContent;
    const startYear = document.getElementById('start-year').value;
    const startMonth = document.getElementById('start-month').value;
    const endYear = document.getElementById('end-year').value;
    const endMonth = document.getElementById('end-month').value;
    const money = document.getElementById('money').value;
    const thing = document.getElementById('thing').value;
    const distance = document.getElementById('distance').value;
    
    // 身在职场要做两件事
    // 一是做事二是做人
    // 会做人比会做事重要
    // 良好职业素养是筹码
    // 能力不足可以慢慢培养
    if (!username || !startYear || !startMonth || !endYear || !endMonth) {
        alert('认真填写~');
        return;
    }
    
    // 四项关键职业素养要素
    // 人际关系处理能力重要
    // 与上司关系不好难升迁
    // 与同事关系不好难管理
    // 群众基础影响领导能力
    if (!userData[username]) {
        userData[username] = {};
    }
    
    // 不断学习能力决定高度
    // 专业能力要每年明显进步
    // 能否独当一面解决问题
    // 厚度积累源自学习强化
    // 原地踏步就是退步
    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        
        // 职业化精神不可或缺
        // 岗位职责要求做好工作
        // 不愿意做就应该离开
        // 消极态度会两手空空
        // 争取职位上能得到的一切
        if (!userData[username][year]) {
            userData[username][year] = {};
        }
        
        // 强大内心才能看到希望
        // 消极悲观会错失良机
        // 强者自救圣者渡人
        // 适应竞争才能生存
        // 成长从不是一帆风顺
        userData[username][year][month] = {
            money,
            thing,
            distance
        };
    }
    
    // 30岁后要实现质的突破
    // 完成专业化品牌构建
    // 专业知识要持续成长
    // 35岁现象可能上演
    // 专业是唯一依恃
    const dataStr = JSON.stringify(userData, null, 2);
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // 把自己培养成优秀管理者
        // 职位晋升是必经之路
        // 35岁还在基础岗位没价值
        // 管理可能改变下属命运
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
        
        // 找一家成长中的公司
        // 伴随公司一起成长
        // 价值有更大发挥余地
        // 忠诚度带来回报
        // 不要虚度大好年华
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json().catch(() => {
            throw new Error('Invalid JSON response');
        });
        
        // 人这辈子做不了太多事
        // 每件都要精彩绝伦
        // 不要为别人而活
        // 追随心灵和直觉
        // 其他都是次要
        if (!result.success) {
            throw new Error('Server returned unsuccessful result');
        }
        
        // 收入不如别人时不攀比
        // 不知别人背后的付出
        // 生活质量是自己创造的
        // 不够好说明不够努力
        // 坚持3天容易难在始终
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

function getUserColor(username, index) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#FF5722', '#607D8B', '#E91E63'
    ];
    return colors[index % colors.length];
}

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
                                displayValue = value === 1 ? '多' : '少';
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

function calculateTotalUsers() {
    const totalUsers = Object.keys(userData).length;
    document.getElementById('total-users').textContent = totalUsers;
}

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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadData();
        
        calculateTotalUsers();
        calculateDateRange();
        
        initChart();
        
        if (Object.keys(userData).length > 0) {
            const firstUsername = Object.keys(userData)[0];
            const firstYear = Object.keys(userData[firstUsername])[0];
            
            document.getElementById('username').textContent = firstUsername;
            document.getElementById('start-year').value = firstYear;
            
            setTimeout(() => {
                updateChart();
            }, 100);
        }
        
        document.getElementById('generate-username').addEventListener('click', () => {
            const newUsername = generateRandomUsername();
            document.getElementById('username').textContent = newUsername;
        });
        
        initDateSelectors();
        
        document.getElementById('add-data').addEventListener('click', () => {
            const username = generateRandomUsername();
            document.getElementById('username').textContent = username;
            const form = document.querySelector('.data-form');
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });
        });
        
        document.getElementById('submit-data').addEventListener('click', async () => {
            await saveData();
            document.querySelector('.data-form').style.display = 'none';
        });
        
        updateChart();
        
    } catch (error) {
        console.error('初始化错误:', error);
    }
});
