// 2.1、实现游戏元素 - 飞机（游戏主角）
// 游戏中飞机元素是我们需要操作的主人公，以下是飞机元素需要注意的内容：
// 飞机尺寸为 60 * 100
// 飞机需绘制为飞机图像 img/plane.png
// 可通过键盘左右方向键移动飞机元素，默认飞机移动的步伐长度为 5，飞机不可移动出前面所讲的 飞机移动区域

/**
 * 飞机实例构造函数
 * @param {[object]} opts [配置参数]
 */
let Plane = function(opts) {
    let enemyOpts = opts || {};
    Element.call(this, enemyOpts);
    this.status = '';
    this.icon = enemyOpts.icon;
}
/**
 * 继承函数
 */
extend(Plane, Element);

/**
 * 飞机实例渲染函数
 * @return {[type]} [description]
 */
Plane.prototype.draw = function() {
    let self = this;
    let pic = new Image();
    pic.src = this.icon;
    switch (this.status) {
        case '':
            pic.onload = function() {
                self.status = 'alive';
                content.drawImage(pic, self.x, self.y, self.size.width, self.size.height);
            }
            break;
        case 'alive':
            content.drawImage(pic, self.x, self.y, self.size.width, self.size.height);
            break;
    }
};
/**
 * 飞机实例移动对象
 * @param  {[string]} direction [移动方向]
 */
Plane.prototype.move = function(direction) {
    let speed = this.speed;
    let addX;
    if (direction === 'left') {
        addX = this.x < GAME.opts.canvasPadding ? 0 : -speed;
    } else {
        addX = this.x < (canvas.width - GAME.opts.canvasPadding - this.size.width) ? speed : 0;
    }
    this.x += addX;
}
/**
 * 飞机实例发射函数
 * @param  {[Number]} xPosition [飞机x坐标]
 * @param  {[Number]} yPosition [飞机y坐标]
 */
Plane.prototype.shoot = function(xPosition, yPosition) {
    BULLETS.createBullet(xPosition, yPosition);
};
