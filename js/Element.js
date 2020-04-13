/**
 * 公用父类：element对象
 */
var Element = function(opts) {
    var opts = opts || {};
    // 设置坐标和尺寸
    this.x = opts.x;
    this.y = opts.y;
    this.size = opts.size;
    this.speed = opts.speed;
};
// 父类原型
Element.prototype = {
    /**
     * 原型方法 move  
     */
    move: function() {},
    /**
     * 原型方法 draw 
     */
    draw: function() {}
}
// 继承函数
function extend(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}