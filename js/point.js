 // 2.4、实现游戏分数
 // 在游戏场景左上角有一个分数元素，以下是分数元素需要注意的内容：
 // 分数坐标为（20，20)，分数的文字大小 18px
 // 分数默认为0，当消灭一个怪兽，则分数加1
 // 分数一直进行累加，直到游戏结束
 // 
 /**
  * 分数对象
  * @type {Object}
  */
 let POINT = {
     score: 0,
     drawPoint: function() {
         content.font = '18px sans-serif';
         content.fillStyle = '#fff';
         content.fillText('分数： ' + this.score, GAME.opts.canvasPadding, GAME.opts.canvasPadding);
     }
 }