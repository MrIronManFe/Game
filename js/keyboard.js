/**
 * 怪兽实例构造函数
 */
let Keyboard = function() {
    // 通过bind函数绑定调用对象为keyboard
    document.onkeydown = this.keydown.bind(this);
    document.onkeyup = this.keyup.bind(this);
}

Keyboard.prototype = {
    pressedLeft: false, // 是否点击左边
    pressedRight: false, // 是否点击右边
    pressedUp: false, // 是否按了上报
    pressedSpace: false, // 是否按了上报
    pressedStop: false, //是否点击了停止P
    keydown: function(event) {
        // 获取键位
        var key = event.keyCode;
        console.log(key);
        switch (key) {
            // 点击空格
            case 32:
                this.pressedSpace = true;
                console.log('32');
                break;
                // 点击向左
            case 37:
                this.pressedLeft = true;
                this.pressedRight = false;
                break;
                // 点击向上
            case 38:
                this.pressedUp = true;
                break;
                // 点击向右
            case 39:
                this.pressedLeft = false;
                this.pressedRight = true;
                break;
        }
    },
    keyup: function(event) {
        // 获取键位
        var key = event.keyCode;
        switch (key) {
            // 点击空格
            case 32:
                this.pressedSpace = false;
                break;
                // 点击向左
            case 37:
                this.pressedLeft = false;
                // 点击往上
            case 38:
                this.pressedUp = false;
                break;
                // 点击往右
            case 39:
                this.pressedRight = false;
                break;
                // 点击P停止
            case 80:
            case 112:
                GAME.opts.status = this.pressedStop ? 'playing' : 'stop';
                this.pressedStop = this.pressedStop ? false : true;
                GAME.t = null;
                if (GAME.opts.status === 'playing') {
                    animate();
                }
                break;
        }
    },
};