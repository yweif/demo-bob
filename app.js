const PROMO_MESSAGES = [
    {
        icon: '🌍',
        title: '低碳生活 从我做起',
        desc: '每一天的低碳选择，都是对地球的温柔呵护。让我们一起行动，为美好未来贡献力量！'
    },
    {
        icon: '🚴',
        title: '绿色出行 健康生活',
        desc: '选择骑行或步行，不仅能减少碳排放，还能锻炼身体。一举两得，何乐不为？'
    },
    {
        icon: '🌱',
        title: '植物的力量',
        desc: '一棵树一年可吸收约18.3kg二氧化碳。多种一棵树，就多一份清新的空气。'
    },
    {
        icon: '💡',
        title: '节约用电 小习惯大不同',
        desc: '随手关灯、使用节能灯泡，这些小习惯每年可减少数百千克碳排放。'
    },
    {
        icon: '♻️',
        title: '循环利用 减少浪费',
        desc: '垃圾分类、使用环保袋、重复利用物品，让资源循环起来，地球更美好。'
    },
    {
        icon: '🥗',
        title: '素食减排 效果显著',
        desc: '素食一餐可减少约1.2kg碳排放，一周素食相当于少开车40公里。'
    },
    {
        icon: '💧',
        title: '节约用水 点滴珍贵',
        desc: '全球淡水资源有限，节约用水不仅省钱，更是对地球的责任。'
    },
    {
        icon: '🏠',
        title: '家居环保 从家开始',
        desc: '选择环保材料、合理使用空调、自然通风采光，打造绿色低碳之家。'
    }
];

const ACTIVITIES = [
    { id: 'bike', name: '骑自行车出行', icon: '🚲', carbon: 2.5, points: 10 },
    { id: 'public', name: '乘坐公共交通', icon: '🚌', carbon: 1.8, points: 8 },
    { id: 'vegetarian', name: '素食一餐', icon: '🥗', carbon: 1.2, points: 6 },
    { id: 'reuse', name: '使用环保袋', icon: '🛍️', carbon: 0.5, points: 4 },
    { id: 'water', name: '节约用水', icon: '💧', carbon: 0.3, points: 3 },
    { id: 'electricity', name: '节约用电', icon: '💡', carbon: 0.8, points: 5 },
    { id: 'recycle', name: '垃圾分类', icon: '♻️', carbon: 0.6, points: 5 },
    { id: 'plant', name: '植树/绿植养护', icon: '🌱', carbon: 5.0, points: 20 }
];

const ACHIEVEMENTS = [
    { id: 'first', name: '环保新星', desc: '完成第一次低碳打卡', icon: '🌱', condition: (data) => data.totalCheckins >= 1 },
    { id: 'week', name: '坚持一周', desc: '连续打卡7天', icon: '⭐', condition: (data) => data.streak >= 7 },
    { id: 'month', name: '环保达人', desc: '连续打卡30天', icon: '🏆', condition: (data) => data.streak >= 30 },
    { id: 'carbon10', name: '减碳先锋', desc: '累计减少碳排放10kg', icon: '🌍', condition: (data) => data.totalCarbon >= 10 },
    { id: 'carbon50', name: '地球卫士', desc: '累计减少碳排放50kg', icon: '🎖️', condition: (data) => data.totalCarbon >= 50 },
    { id: 'points500', name: '积分大师', desc: '累计获得500积分', icon: '💎', condition: (data) => data.totalPoints >= 500 }
];

const VENUES = [
    {
        name: '上海碳秘馆',
        address: '虹口区和平公园内',
        features: '沉浸式影院、骑行磨咖啡豆、再生材料图书馆、屋顶光伏',
        hours: '除周一外每天开放，个人免预约',
        url: 'https://www.shhk.gov.cn'
    },
    {
        name: '上海现代建筑科技馆·低碳建筑馆',
        address: '宝山区蕴川路2000号',
        features: '数字人讲解、超低能耗建筑实景、五恒系统体验屋、好房子样板间',
        hours: '免费开放，周六下午样板间开放',
        url: 'http://satm.org.cn'
    },
    {
        name: '上海绿色低碳技术科创教育基地',
        address: '松江区鼎源路300号11号楼',
        features: '光热电与储能制氢平台、3D智造平台、院士工作站、青少年课程',
        hours: '需预约参观',
        url: 'http://www.shicti.com'
    }
];

class LowCarbonApp {
    constructor() {
        this.data = this.loadData();
        this.carouselIndex = 0;
        this.carouselTimer = null;
        this.init();
    }

    loadData() {
        const defaultData = {
            checkins: {},
            achievements: [],
            totalPoints: 0,
            totalCarbon: 0,
            totalCheckins: 0,
            streak: 0,
            lastCheckinDate: null
        };
        
        const saved = localStorage.getItem('lowCarbonApp');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveData() {
        localStorage.setItem('lowCarbonApp', JSON.stringify(this.data));
        this.checkStorageQuota();
    }

    init() {
        this.updateStreak();
        this.showPromo();
        this.renderActivities();
        this.renderHistory();
        this.updateStats();
        this.updateHeader();
        this.setupEventListeners();
        this.checkAchievements();
        this.initCarousel();
    }

    showPromo() {
        const saved = localStorage.getItem('lowCarbonPromo');
        const promoData = saved ? JSON.parse(saved) : { index: 0, lastUpdate: null };
        
        const today = new Date().toDateString();
        if (promoData.lastUpdate !== today) {
            promoData.index = (promoData.index + 1) % PROMO_MESSAGES.length;
            promoData.lastUpdate = today;
            localStorage.setItem('lowCarbonPromo', JSON.stringify(promoData));
        }
        
        const message = PROMO_MESSAGES[promoData.index];
        document.getElementById('promo-icon').textContent = message.icon;
        document.getElementById('promo-title').textContent = message.title;
        document.getElementById('promo-desc').textContent = message.desc;
    }

    refreshPromo() {
        const saved = localStorage.getItem('lowCarbonPromo');
        const promoData = saved ? JSON.parse(saved) : { index: 0, lastUpdate: null };
        
        promoData.index = (promoData.index + 1) % PROMO_MESSAGES.length;
        promoData.lastUpdate = new Date().toDateString();
        localStorage.setItem('lowCarbonPromo', JSON.stringify(promoData));
        
        const message = PROMO_MESSAGES[promoData.index];
        const icon = document.getElementById('promo-icon');
        const title = document.getElementById('promo-title');
        const desc = document.getElementById('promo-desc');
        
        icon.style.opacity = '0';
        title.style.opacity = '0';
        desc.style.opacity = '0';
        
        setTimeout(() => {
            icon.textContent = message.icon;
            title.textContent = message.title;
            desc.textContent = message.desc;
            icon.style.opacity = '1';
            title.style.opacity = '1';
            desc.style.opacity = '1';
        }, 300);
    }

    getToday() {
        return new Date().toISOString().split('T')[0];
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
    }

    updateStreak() {
        const today = this.getToday();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (this.data.lastCheckinDate === today || this.data.lastCheckinDate === yesterday) {
            return;
        }
        
        this.data.streak = 0;
        this.saveData();
    }

    renderActivities() {
        const grid = document.getElementById('activities-grid');
        const today = this.getToday();
        const todayCheckins = this.data.checkins[today] || [];
        
        document.getElementById('today-date').textContent = this.formatDate(today);
        
        grid.innerHTML = ACTIVITIES.map(activity => {
            const isCompleted = todayCheckins.includes(activity.id);
            return `
                <div class="activity-card ${isCompleted ? 'completed' : ''}" data-id="${activity.id}">
                    <span class="activity-icon">${activity.icon}</span>
                    <div class="activity-name">${activity.name}</div>
                    <div class="activity-carbon">减少 ${activity.carbon}kg CO₂</div>
                    <div class="activity-check">
                        <svg viewBox="0 0 20 20" fill="none">
                            <path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderHistory() {
        const list = document.getElementById('history-list');
        const dates = Object.keys(this.data.checkins)
            .filter(date => this.data.checkins[date].length > 0)
            .sort((a, b) => new Date(b) - new Date(a))
            .slice(0, 5);
        
        if (dates.length === 0) {
            list.innerHTML = '<div class="history-item" style="justify-content: center; color: var(--text-gray);">还没有打卡记录</div>';
            return;
        }
        
        list.innerHTML = dates.map(date => {
            const checkins = this.data.checkins[date];
            const activities = checkins.map(id => 
                ACTIVITIES.find(a => a.id === id)?.icon
            ).join(' ');
            
            const totalCarbon = checkins.reduce((sum, id) => {
                const activity = ACTIVITIES.find(a => a.id === id);
                return sum + (activity?.carbon || 0);
            }, 0);
            
            return `
                <div class="history-item">
                    <div>
                        <div class="history-date">${this.formatDate(date)}</div>
                        <div class="history-activities">${activities}</div>
                    </div>
                    <div class="history-carbon">-${totalCarbon.toFixed(1)}kg</div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const today = this.getToday();
        const weekStart = new Date(Date.now() - 6 * 86400000);
        
        let weekCheckins = 0;
        let weekCarbon = 0;
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart.getTime() + i * 86400000).toISOString().split('T')[0];
            const checkins = this.data.checkins[date] || [];
            weekCheckins += checkins.length;
            weekCarbon += checkins.reduce((sum, id) => {
                const activity = ACTIVITIES.find(a => a.id === id);
                return sum + (activity?.carbon || 0);
            }, 0);
        }
        
        document.getElementById('week-checkins').textContent = weekCheckins;
        document.getElementById('week-carbon').textContent = `${weekCarbon.toFixed(1)}kg`;
        document.getElementById('week-trees').textContent = `${(weekCarbon / 18.3).toFixed(1)}棵`;
        
        this.renderChart();
    }

    renderChart() {
        const canvas = document.getElementById('weekly-chart');
        const ctx = canvas.getContext('2d');
        const width = canvas.parentElement.clientWidth - 48;
        const height = 200 - 48;
        
        canvas.width = width;
        canvas.height = height;
        
        const data = [];
        const labels = [];
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
            const checkins = this.data.checkins[date] || [];
            const carbon = checkins.reduce((sum, id) => {
                const activity = ACTIVITIES.find(a => a.id === id);
                return sum + (activity?.carbon || 0);
            }, 0);
            data.push(carbon);
            labels.push(weekdays[new Date(date).getDay()]);
        }
        
        const maxCarbon = Math.max(...data, 1);
        const barWidth = width / 7 - 10;
        const barGap = 10;
        const topPad = 20;
        const bottomPad = 22;
        
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, width, height);
        
        data.forEach((value, index) => {
            const x = index * (barWidth + barGap) + barGap / 2;
            const availableHeight = height - topPad - bottomPad;
            const barHeight = (value / maxCarbon) * availableHeight;
            const y = height - bottomPad - barHeight;
            
            const gradient = ctx.createLinearGradient(x, y, x, height - bottomPad);
            gradient.addColorStop(0, '#22c55e');
            gradient.addColorStop(1, '#86efac');
            ctx.fillStyle = gradient;
            
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, 4);
            ctx.fill();
            
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, height - 5);
            
            if (value > 0) {
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 6);
            }
        });
    }

    updateHeader() {
        document.getElementById('streak-days').textContent = `${this.data.streak}天`;
        document.getElementById('total-points').textContent = `${this.data.totalPoints}积分`;
    }

    setupEventListeners() {
        document.getElementById('promo-refresh').addEventListener('click', () => {
            this.refreshPromo();
        });
        
        document.getElementById('activities-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.activity-card');
            if (!card) return;
            
            const id = card.dataset.id;
            this.toggleCheckin(id);
        });
        
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('achievement-modal').classList.remove('show');
        });
        
        document.getElementById('achievement-modal').addEventListener('click', (e) => {
            if (e.target.id === 'achievement-modal') {
                document.getElementById('achievement-modal').classList.remove('show');
            }
        });
        
        document.getElementById('close-history-modal').addEventListener('click', () => {
            document.getElementById('history-modal').classList.remove('show');
        });
        
        document.getElementById('history-modal').addEventListener('click', (e) => {
            if (e.target.id === 'history-modal') {
                document.getElementById('history-modal').classList.remove('show');
            }
        });
        
        document.getElementById('view-all-btn').addEventListener('click', () => {
            this.showAllHistory();
        });
        
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('确定清除所有数据吗？此操作不可恢复。')) {
                localStorage.removeItem('lowCarbonApp');
                localStorage.removeItem('lowCarbonPromo');
                this.data = this.loadData();
                this.renderAll();
                this.showToast('已清除所有数据');
            }
        });
        
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.dataset.page;
                document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchPage(page);
            });
        });
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!document.getElementById('page-home').classList.contains('hidden') || !document.getElementById('page-profile').classList.contains('hidden')) {
                    this.renderChart();
                }
            }, 100);
        });
    }

    switchPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        document.getElementById(`page-${page}`).classList.remove('hidden');
        
        if (page === 'achievements') {
            this.renderAchievements();
        } else if (page === 'profile') {
            this.renderProfile();
            this.updateStats();
        } else if (page === 'home') {
            this.renderChart();
        }
    }

    renderAll() {
        this.updateStreak();
        this.showPromo();
        this.renderActivities();
        this.renderHistory();
        this.updateStats();
        this.updateHeader();
        this.checkAchievements();
    }

    renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        grid.innerHTML = ACHIEVEMENTS.map(a => {
            const unlocked = this.data.achievements.includes(a.id);
            return `
                <div class="achievement-item ${unlocked ? '' : 'locked'}">
                    <div class="achievement-item-icon">${a.icon}</div>
                    <div class="achievement-item-info">
                        <div class="achievement-item-name">${a.name}</div>
                        <div class="achievement-item-desc">${a.desc}</div>
                    </div>
                    <div class="achievement-item-status ${unlocked ? 'unlocked' : 'locked'}">
                        ${unlocked ? '已获得' : '未解锁'}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderProfile() {
        const totalCarbon = this.data.totalCarbon;
        document.getElementById('profile-total-checkins').textContent = this.data.totalCheckins;
        document.getElementById('profile-total-carbon').textContent = `${totalCarbon.toFixed(1)}kg`;
        document.getElementById('profile-total-points').textContent = this.data.totalPoints;
        document.getElementById('profile-streak').textContent = `${this.data.streak}天`;
        document.getElementById('profile-achievements').textContent = this.data.achievements.length;
        document.getElementById('profile-trees').textContent = `${(totalCarbon / 18.3).toFixed(1)}棵`;
    }

    showAllHistory() {
        const body = document.getElementById('history-modal-body');
        const dates = Object.keys(this.data.checkins)
            .filter(date => this.data.checkins[date].length > 0)
            .sort((a, b) => new Date(b) - new Date(a));
        
        if (dates.length === 0) {
            body.innerHTML = '<div style="text-align:center;color:var(--text-gray);padding:2rem 0;">还没有打卡记录</div>';
        } else {
            body.innerHTML = `<div class="history-modal-list">${dates.map(date => {
                const checkins = this.data.checkins[date];
                const activities = checkins.map(id => 
                    ACTIVITIES.find(a => a.id === id)?.icon
                ).join(' ');
                
                const totalCarbon = checkins.reduce((sum, id) => {
                    const activity = ACTIVITIES.find(a => a.id === id);
                    return sum + (activity?.carbon || 0);
                }, 0);
                
                return `
                    <div class="history-item">
                        <div>
                            <div class="history-date">${this.formatDate(date)}</div>
                            <div class="history-activities">${activities}</div>
                        </div>
                        <div class="history-carbon">-${totalCarbon.toFixed(1)}kg</div>
                    </div>
                `;
            }).join('')}</div>`;
        }
        
        document.getElementById('history-modal').classList.add('show');
    }

    checkStorageQuota() {
        if (this._cleaning) return;
        
        const STORAGE_LIMIT = 5 * 1024 * 1024;
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += (localStorage[key].length + key.length) * 2;
            }
        }
        
        const usageRatio = totalSize / STORAGE_LIMIT;
        
        if (usageRatio > 0.9) {
            this._cleaning = true;
            this.cleanupOldHistory();
            this.showToast('⚠️ 存储空间不足，已清理部分旧数据');
            this._cleaning = false;
        } else if (usageRatio > 0.75) {
            console.warn(`Storage usage at ${(usageRatio * 100).toFixed(1)}%`);
        }
    }
    
    cleanupOldHistory() {
        const dates = Object.keys(this.data.checkins)
            .filter(date => this.data.checkins[date].length > 0)
            .sort((a, b) => new Date(a) - new Date(b));
        
        const keepCount = Math.max(30, dates.length - 20);
        const datesToRemove = dates.slice(0, dates.length - keepCount);
        
        for (const date of datesToRemove) {
            const checkins = this.data.checkins[date];
            for (const id of checkins) {
                const activity = ACTIVITIES.find(a => a.id === id);
                if (activity) {
                    this.data.totalCarbon -= activity.carbon;
                    this.data.totalPoints -= activity.points;
                    this.data.totalCheckins--;
                }
            }
            delete this.data.checkins[date];
        }
        
        this.saveData();
    }

    toggleCheckin(activityId) {
        const today = this.getToday();
        const activity = ACTIVITIES.find(a => a.id === activityId);
        
        if (!this.data.checkins[today]) {
            this.data.checkins[today] = [];
        }
        
        const index = this.data.checkins[today].indexOf(activityId);
        
        if (index > -1) {
            this.data.checkins[today].splice(index, 1);
            this.data.totalCarbon -= activity.carbon;
            this.data.totalPoints -= activity.points;
            this.data.totalCheckins--;
            this.showToast(`取消打卡: ${activity.name}`);
        } else {
            this.data.checkins[today].push(activityId);
            this.data.totalCarbon += activity.carbon;
            this.data.totalPoints += activity.points;
            this.data.totalCheckins++;
            
            if (this.data.lastCheckinDate !== today) {
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                if (this.data.lastCheckinDate === yesterday || this.data.lastCheckinDate === null) {
                    this.data.streak++;
                } else {
                    this.data.streak = 1;
                }
                this.data.lastCheckinDate = today;
            }
            
            this.showToast(`✅ 打卡成功! +${activity.points}积分, 减少${activity.carbon}kg碳排放`);
        }
        
        this.saveData();
        this.renderActivities();
        this.renderHistory();
        this.updateStats();
        this.updateHeader();
        this.checkAchievements();
    }

    checkAchievements() {
        for (const achievement of ACHIEVEMENTS) {
            if (!this.data.achievements.includes(achievement.id) && achievement.condition(this.data)) {
                this.data.achievements.push(achievement.id);
                this.saveData();
                this.showAchievement(achievement);
                break;
            }
        }
    }

    showAchievement(achievement) {
        document.getElementById('achievement-icon').textContent = achievement.icon;
        document.getElementById('achievement-name').textContent = achievement.name;
        document.getElementById('achievement-desc').textContent = achievement.desc;
        document.getElementById('achievement-modal').classList.add('show');
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    initCarousel() {
        const track = document.getElementById('carousel-track');
        const dots = document.getElementById('carousel-dots');
        const prev = document.getElementById('carousel-prev');
        const next = document.getElementById('carousel-next');
        const slides = track.querySelectorAll('.carousel-slide');

        dots.innerHTML = VENUES.map((_, i) =>
            `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`
        ).join('');

        const updateInfo = (index) => {
            const v = VENUES[index];
            document.getElementById('venue-title').textContent = v.name;
            document.getElementById('venue-address').textContent = v.address;
            document.getElementById('venue-features').textContent = v.features;
            document.getElementById('venue-hours').textContent = v.hours;
            document.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        };

        const goTo = (index) => {
            this.carouselIndex = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            updateInfo(index);
        };

        dots.addEventListener('click', (e) => {
            const dot = e.target.closest('.carousel-dot');
            if (!dot) return;
            goTo(Number(dot.dataset.index));
            this.restartCarousel();
        });

        prev.addEventListener('click', () => {
            goTo((this.carouselIndex - 1 + VENUES.length) % VENUES.length);
            this.restartCarousel();
        });

        next.addEventListener('click', () => {
            goTo((this.carouselIndex + 1) % VENUES.length);
            this.restartCarousel();
        });

        const viewport = document.querySelector('.carousel-viewport');
        viewport.addEventListener('mouseenter', () => this.stopCarousel());
        viewport.addEventListener('mouseleave', () => this.startCarousel());

        updateInfo(0);
        this.startCarousel();
    }

    startCarousel() {
        this.stopCarousel();
        this.carouselTimer = setInterval(() => {
            const next = (this.carouselIndex + 1) % VENUES.length;
            this.carouselIndex = next;
            const track = document.getElementById('carousel-track');
            track.style.transform = `translateX(-${next * 100}%)`;
            const v = VENUES[next];
            document.getElementById('venue-title').textContent = v.name;
            document.getElementById('venue-address').textContent = v.address;
            document.getElementById('venue-features').textContent = v.features;
            document.getElementById('venue-hours').textContent = v.hours;
            document.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === next);
            });
        }, 5000);
    }

    stopCarousel() {
        if (this.carouselTimer) {
            clearInterval(this.carouselTimer);
            this.carouselTimer = null;
        }
    }

    restartCarousel() {
        this.stopCarousel();
        this.startCarousel();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LowCarbonApp();
});
