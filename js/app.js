// 元素
let container = document.getElementById('game');
let canvas = document.querySelector('#canvas');
let content = canvas.getContext('2d');
/**
 * 整个游戏对象
 */
let GAME = {
    /**
     * 初始化函数,这个函数只执行一次
     * @param  {object} opts 
     * @return {[type]}      [description]
     */
    init: function(opts) {
        // 挂载配置文件到Game.opts
        this.opts = Object.assign({}, opts, CONFIG);
        this.status = GAME.opts.status;
        this.bindEvent();
    },
    /**
     * 绑定函数
     * @return {[type]} [description]
     */
    bindEvent: function() {
        var self = this;
        var playBtn = document.querySelector('.js-play');
        // 开始游戏按钮绑定
        playBtn.onclick = function() {
            self.play();
        };
        // 重新开始游戏按钮绑定
        var replayBtnArr = document.querySelectorAll('.js-replay');
        replayBtnArr.forEach(function(element, index) {
            element.addEventListener('click', function() {
                self.replay();
            })
        });
        // 下一关游戏按钮绑定
        var nextBtn = document.querySelector('.js-next');
        nextBtn.addEventListener('click', function() {
            self.nextLevel();
        })
    },
    /**
     * 更新游戏状态，分别有以下几种状态：
     * start  游戏前
     * playing 游戏中
     * failed 游戏失败
     * success 游戏成功
     * all-success 游戏通过
     * stop 游戏暂停（可选）
     */
    setStatus: function(status) {
        this.status = status;
        container.setAttribute("data-status", status);
    },
    /**
     * [开始游戏]
     * @return {[type]} [description]
     */
    play: function() {
        // 修改游戏配置状态
        GAME.opts.status = 'playing';
        // 设置游戏状态
        this.setStatus(GAME.opts.status);
        // 生成怪兽对象
        ENEMYS.createEnemys();
        // 生成飞机对象
        GAME.plane = new Plane({
            x: (canvas.width - GAME.opts.planeSize.width) / 2,
            y: canvas.height - GAME.opts.canvasPadding - GAME.opts.planeSize.height,
            size: GAME.opts.planeSize,
            speed: GAME.opts.planeSpeed,
            icon: GAME.opts.planeIcon,
        });
        // 生成键盘对象
        GAME.keybord = new Keyboard();
        // 渲染元素
        drawElements();
        // 调用动画
        animate();
    },
    /**
     * [下一关游戏]
     * @return {[type]} [description]
     */
    nextLevel: function() {
        // 关卡递增
        GAME.opts.level += 1;
        // 怪兽移动速度增加
        GAME.opts.enemySpeed += 0.25;
        // 清空怪物数组
        ENEMYS.enemys = [];
        // 子弹组清空
        BULLETS.bullets = [];
        // 飞机对象清空;
        GAME.plane = null;
        // 键盘对象清空
        GAME.keybord = null;
        // 动画清空
        GAME.t = null;
        // 调用开始游戏
        GAME.play();
    },
    /**
     * 重新开始游戏
     * @return {[type]} [description]
     */
    replay: function() {
        // 清空分数
        POINT.score = 0;
        // 清空怪物数组
        ENEMYS.enemys = [];
        // 子弹组清空
        BULLETS.bullets = [];
        // 飞机对象清空;
        GAME.plane = null;
        // 键盘对象清空
        GAME.keybord = null;
        // 动画清空
        GAME.t = null;
        // 修改游戏配置状态
        GAME.opts.status = 'start';
        // 重设关卡
        GAME.opts.level = 1;
        // 重设怪兽速度
        GAME.opts.enemySpeed = 2;
        // 设置游戏状态
        this.setStatus(GAME.opts.status);
    },
    // 更新画板
    updatePanel: function() {
        // 更新怪兽数据
        // 怪兽没有被完全消灭
        if (ENEMYS.enemys.length !== 0) {
            // 怪兽对象整体移动
            ENEMYS.enemysMove();
        } else {
            // 怪兽对象完全消灭，已经完成当前关卡
            // 取消动画
            cancelAnimationFrame(GAME.t);
            // 清空画布
            content.clearRect(0, 0, canvas.width, canvas.height);
            // 判断是否完成所有关卡了
            GAME.opts.status = GAME.opts.level === GAME.opts.totalLevel ? 'all-success' : 'success';
            // 通往下一关
            if (GAME.opts.status === 'success') {
                // 修改文字
                let levelTxt = document.querySelector('.game-next-level');
                levelTxt.innerHTML = '下一个Level:' + GAME.opts.level;
            }
            GAME.setStatus(GAME.opts.status);
            // 不需要重画
            return false;
        }
        // 更新子弹数据
        // 若有子弹对象
        if (BULLETS.bullets[0]) {
            BULLETS.bulletCrash();
            BULLETS.bulletsMove();
        }
        // 更新飞机数据
        // 如果按了左方向键或者长按左方向键
        if (this.keybord.pressedLeft) {
            this.plane.move('left');
        }
        // 如果按了右方向键或者长按右方向键
        if (this.keybord.pressedRight) {
            this.plane.move('right');
        }
        // 如果按了上方向键
        if (this.keybord.pressedUp || this.keybord.pressedSpace) {
            // 飞机射击子弹
            this.plane.shoot(this.plane.x + this.plane.size.width * 0.5, this.plane.y);
            // 取消飞机射击
            this.keybord.pressedUp = false;
            this.keybord.pressedSpace = false;
        }
        // 需要重画
        return true;
    },
}

// 初始化
GAME.init(CONFIG);

/**
 * 动画函数
 * @return {[type]} [description]
 */
function animate() {
    // 判断游戏状态
    switch (GAME.opts.status) {
        // 游戏中
        case 'playing':
            // 更新数据，判断是否需要重画
            var updatePanelOrNot = GAME.updatePanel();
            // 清空怪物移动区域的画布
            content.clearRect(0, 0, canvas.width, canvas.height);
            // 需要重画与否
            if (updatePanelOrNot) {
                // 重绘画布
                drawElements();
                // 调用动画
                GAME.t = requestAnimationFrame(animate);
            }
            break;
        case 'failed':
            // 游戏失败
            // 清除动画
            cancelAnimationFrame(GAME.t);
            // 清除画布
            content.clearRect(0, 0, canvas.width, canvas.height);
            // // 设置游戏状态
            GAME.setStatus(GAME.opts.status);
            // // 显示当前所得分数
            let showPoint = document.querySelector('.score');
            showPoint.innerHTML = POINT.score;
            break;
        case 'all-success':
            // 游戏通过
            // 清除动画
            cancelAnimationFrame(GAME.t);
            // 清除画布
            content.clearRect(0, 0, canvas.width, canvas.height);
            // 设置游戏状态
            GAME.setStatus(GAME.opts.status);
            break;
        case 'stop':
            // 游戏暂停（可选）
            // 停止动画元素
            cancelAnimationFrame(GAME.t);
            break;
    }
}