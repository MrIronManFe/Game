// 子弹对象
let BULLETS = {
    // 子弹实例数组
    bullets: [],
    // 创建子弹实例并加入数组
    createBullet: function(xPosition, yPosition) {
        let bullet = new Bullet({
            x: xPosition,
            y: yPosition,
            size: GAME.opts.bulletSize,
            speed: GAME.opts.bulletSpeed,
        })
        this.bullets.push(bullet);
    },
    // 渲染子弹对象
    drawBullets: function() {
            if (!BULLETS.bullets[0]) {
                return;
            }
        this.bullets.forEach(function(element) {
            element.draw();
        });
    },
    // 子弹对象移动
    bulletsMove: function() {
        let self = this;
        this.bullets.forEach(function(element) {
            // 判断子弹对象是否超越边界
            if (element.y < GAME.opts.canvasPadding) {
                self.bullets.shift();
            } else {
                element.move();
            }
        });
    },
    // 检测子弹对象是否和怪兽碰撞
    bulletCrash: function() {
        // 遍历子弹对象
        for (let i = 0; i < this.bullets.length; i++) {
            // 获取当前子弹实例的位置
            let bulletY = this.bullets[i].y;
            let bulletX = this.bullets[i].x;
            for (let j = 0; j < ENEMYS.enemys.length; j++) {
                // 获取当前怪兽实例的位置
                let enemyBottom = ENEMYS.enemys[j].y + ENEMYS.enemys[j].size;
                let enemyLeft = ENEMYS.enemys[j].x;
                let enemyRight = ENEMYS.enemys[j].x + ENEMYS.enemys[j].size;
                if (bulletY === enemyBottom && bulletX > enemyLeft && bulletX < enemyRight) {
                    // 检验当子弹实例和怪兽实例碰撞，删除该子弹实例
                    BULLETS.bullets.splice(i, 1);
                    // 设置怪兽状态
                    ENEMYS.enemys[j].status = 'boom';
                    // 若碰撞，为相对应怪兽添加倒计时
                    ENEMYS.enemys[j].countDown = 0;
                    // 因子弹无法同时击中目标，跳出循环
                    break;

                }
            }
        }

    }
}

/**
 * 子弹实例构造函数
 * @param {[object]} opts [配置对象]
 */
let Bullet = function(opts) {
    let bulletOpts = opts || {};
    Element.call(this, bulletOpts);
}
/**
 * 继承函数
 */
extend(Bullet, Element);
/**
 * 子弹实例的渲染函数
 * @return {[type]} [description]
 */
Bullet.prototype.draw = function() {
    content.beginPath();
    content.moveTo(this.x, this.y);
    content.lineTo(this.x, this.y - this.size);
    content.lineWidth = 1;
    content.strokeStyle = "#fff";
    content.stroke();
    content.closePath();
};
/**
 * 子弹实例移动函数
 * @return {[type]} [description]
 */
Bullet.prototype.move = function() {
    this.y -= this.speed;
};