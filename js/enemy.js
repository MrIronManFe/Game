/*
游戏中怪兽元素共有两种状态（存活和死亡），存活时怪兽会移动，死亡时会绽放成烟花。以下是怪兽元素需要注意的内容：
怪兽尺寸为 50 * 50
一行怪兽元素共有7个，每个怪兽之间间隔为 10
怪兽元素处于存活状态时，需绘制为怪兽图像 img/enemy.png
怪兽元素处于存活状态时，每一帧移动距离为 2
当最右边的怪兽元素移动到 怪兽移动区域的左右边界时，下一帧则往下移动，移动的距离为 50，如下图所示：
*/

/**
 * 怪兽实例构造函数
 * @param {[type]} opts [description]
 */
let Enemy = function(opts) {
    let enemyOpts = opts || {};
    this.icon = enemyOpts.icon;
    this.boomIcon = enemyOpts.boomIcon;
    this.status = '';
    Element.call(this, enemyOpts);
}
/**
 * 继承函数
 */
extend(Enemy, Element);

/**
 * 怪兽渲染函数
 * @return {[type]} [description]
 */
Enemy.prototype.draw = function() {
    let self = this;
    let enemyStatus = this.status;
    let pic = new Image();
    // 根据状态决定如何渲染
    switch (enemyStatus) {
        // 状态为空，第一次渲染
        case '':
            pic.src = this.icon;
            pic.onload = function() {
                self.status = 'alive';
                content.drawImage(pic, self.x, self.y, self.size, self.size);
            };
            break;
            // 状态为alive，动画进行时期间的渲染
        case 'alive':
            pic.src = this.icon;
            content.drawImage(pic, self.x, self.y, self.size, self.size);
            break;
            // 状态为boom，碰撞后的渲染
        case 'boom':
            pic.src = this.boomIcon;
            content.drawImage(pic, self.x, self.y, self.size, self.size);
            this.countDown += 1;
            break;
    }
};

/**
 * 怪兽移动函数
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
Enemy.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
};
// 怪兽对象
let ENEMYS = {
    // 怪兽实例数组
    enemys: [],
    // 创建怪兽并且加入数组
    createEnemys: function() {
        // 根据等级确定一共有几行怪兽
        for (let i = 0; i < GAME.opts.level; i++) {
            // 根据配置文件确认每行的怪兽数量
            for (let j = 0; j < GAME.opts.numPerLine; j++) {
                // 怪兽配置对象
                let initOpt = {
                    x: GAME.opts.canvasPadding + (GAME.opts.enemyGap + GAME.opts.enemySize) * j,
                    y: GAME.opts.canvasPadding + i * GAME.opts.enemySize,
                    size: GAME.opts.enemySize,
                    speed: GAME.opts.enemySpeed,
                    icon: GAME.opts.enemyIcon,
                    boomIcon: GAME.opts.enemyBoomIcon,
                }
                this.enemys.push(new Enemy(initOpt));
            }
        }
    },
    // 怪兽对象渲染函数
    drawEnemys: function() {
        if (!ENEMYS.enemys[0]) {
            return;
        }
        let self = this;
        this.enemys.forEach(function(element, index) {
            // 判断怪兽的倒数状态，若为3，消失
            if (element.countDown === 3) {
                self.enemys.splice(index, 1);
                // 添加分数
                POINT.score += 10;
            } else {
                // 渲染怪兽实例
                element.draw();
            }
        })
    },
    // 怪兽对象移动函数
    enemysMove: function() {
        let self = this;
        // 确定最下面一个怪兽实例的位置
        let lastenemy = this.enemys[this.enemys.length - 1];
        let enemysBottom = lastenemy.y + lastenemy.size;
        // 当怪兽实例碰到飞机实例，游戏结束
        if (enemysBottom >= canvas.height - GAME.opts.canvasPadding - GAME.opts.planeSize.height) {
            GAME.opts.status = 'failed';
            return;
        }
        // 判断怪兽对象整体移动方向
        switch (GAME.opts.enemyDirection) {
            case 'right':
                // 获取最右序列
                let maxIndex = 0;
                // let minIndex = 0;
                for (let i = 0; i < ENEMYS.enemys.length; i++) {
                    if (ENEMYS.enemys[i + 1]) {
                        maxIndex = ENEMYS.enemys[i + 1].x >= ENEMYS.enemys[i].x ? i + 1 : i;
                        // minIndex = ENEMYS.enemys[i + 1].x <= ENEMYS.enemys[i].x ? i + 1 : i;
                    }
                }
                // 最右怪物实例
                let lastRightEnemy = ENEMYS.enemys[maxIndex];
                // 最右位置
                let rightPosition = lastRightEnemy.x + lastRightEnemy.size;
                // 判断是否超出画布右侧边栏
                if (rightPosition > canvas.width - GAME.opts.canvasPadding) {
                    // 是,换方向
                    GAME.opts.enemyDirection = 'left';
                    // 整体下移
                    self.enemys.forEach(function(element) {
                        element.move(0, element.size);
                    })
                } else {
                    // 否则往右移动
                    self.enemys.forEach(function(element) {
                        element.move(element.speed, 0);
                    })
                }
                break;
            case 'left':
                // 获取最左序列
                let minIndex = ENEMYS.enemys.length - 1;
                for (let i = ENEMYS.enemys.length; i > 0; i--) {
                    if (ENEMYS.enemys[i - 2]) {
                        minIndex = ENEMYS.enemys[i - 2].x <= ENEMYS.enemys[i - 1].x ? i - 2 : i - 1;
                    }
                }
                // 最左怪物对象
                let leftPosition = self.enemys[minIndex].x;
                // 判断是否超出画布左侧边栏
                if (leftPosition < GAME.opts.canvasPadding) {
                    // 是，换方向
                    GAME.opts.enemyDirection = 'right';
                    // 整体下移
                    self.enemys.forEach(function(element) {
                        element.move(0, element.size);
                    })
                } else {
                    // 否则往左移动
                    self.enemys.forEach(function(element) {
                        element.move(-element.speed, 0);
                    })
                }
                break;
        }
    },
}