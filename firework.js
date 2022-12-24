// 模拟烟花特效，主要思想是构造一个粒子系统
// 位置初始化为屏幕底端，速度初始化为y轴负方向，施加重力效果
// 向上喷射，达到最高点时开始炸裂，炸裂后生成一系列粒子，速度方向随机初始化
// 爆炸后粒子随机初始速度方向决定了烟花的形状


//221215
//需要改进的地方：爆炸之后消失的效果、爆炸有延迟、颜色的明度变化

// 爆炸加上渐隐效果 √
// 限制部分颜色的出现 √ （不过这个颜色范围，，）
// 颜色名都变化 √
// 字体中随机取点可能造成字体不完整，试一试固定间隔取值。太整齐也不行，加点随机.还是随机吧

// 添加形状特效。圆或者球？



var explodeMinVel = 0.0;     // 炸裂后的最小速度，决定烟花大小
var explodeMaxVel = 4.0;    // 炸裂后的最大速度

var initMinminVel = -12;
var initMinVel = -9.5;        // 竖直方向的最小初始速度
var initMaxVel = -8;        // 竖直方向的最大初始速度


var gravity = 0.15;           // 重力
var maxExplodedNum = 200;    // 粒子爆炸后的个数

var fireworkSize = 4.0;      // 未爆炸粒子大小
var explodedFwSize = 2.0;    // 爆炸后粒子大小
var disappearSpeed = 10;      // 烟花消失的速度
var colorRandomSize = 10.0;    // 烟花颜色的波动

function firework(x, y, exploding, wordvec, k){
	this.pos = createVector(x, y);            // 位置
	this.vel = createVector(0.0, 0.0);                            // 速度
	this.acc = createVector(0.0, 0.0);                            // 加速度
	this.exploding = exploding;                                   // 是否是炸裂的粒子
	
	this.explodedFireworks = [];                                  // 炸裂后的粒子
	this.lifespan = 400;                                          // 生命值
	
	this.toDelete = false;                                        // 是否删除
	
	//add
	this.isShowing = true;		//爆炸之后不再显示
	this.movingTime = 300;		//爆炸结束前一段时间速度降低
	this.traceLen = 0;
	this.traceP = [];
	this.k = k;

	this.red = random(0, 255);                             // 红色随机颜色
	this.green = random(0, 255);                           // 红色随机颜色
	this.blue = random(0, 255);                            // 红色随机颜色
	this.hue = floor(random(280, 430)%360);

	this.wordvec = wordvec;                                // 词和词的像素点坐标向量
	// 初始化粒子速度
	this.initialize = function(){
		if(this.exploding == false){
			if(this.k) {
				this.vel = createVector(0.0, random(initMinVel, initMaxVel));
			}
			else {
				this.vel = createVector(0.0, random(initMinVel-1, initMinminVel));
			}
			
			this.traceLen = 2;
		}else{
			// 根据字符的像素点向量赋值
			var randi = floor(random(0, this.wordvec.length));
			// var randi = floor(this.wordvec.length / maxExplodedNum * this.k) + floor(random(0,2));
			// console.log(this.wordvec.length);
			this.vel = createVector(this.wordvec[randi].x, this.wordvec[randi].y);
			this.vel.mult(0.28);
			this.traceLen = floor(random(3, 10));
		}
	}
	
	// 运动
	this.move = function(){
		// if(this.movingTime >  this.lifespan && this.exploding)
		// 	this.vel.mult(0.8);
		if(this.exploding)
			this.vel.mult(0.95);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		if (this.lifespan % 1 == 0) {
			if(this.traceP.length > this.traceLen) {
				//删除队尾
				this.traceP.pop()
			}
			//队首插入
			//为啥插入之后整个数组数据都一样啊？？
			this.traceP.unshift([this.pos.x, this.pos.y]);
		}
		this.updateLifespan();            // 更新生命值
		// 当且仅当该粒子没有爆炸过，并且生命值结束或到达最高点时爆炸
		if(this.exploding == false && (this.lifespan <= 0.0 || this.vel.y >= 0.0)){
			this.explode();
			this.isShowing = false;
		}

	}
	// 施加外力
	this.applyForce = function(fv){
		this.acc = createVector(0.0, 0.0);
		this.acc.add(fv);
	}
	// 更新生命值
	this.updateLifespan = function(){
		if(this.exploding == true){
			this.lifespan -= disappearSpeed;
		}
	}
	// 判断是否要删除
	this.explode = function(){
		this.exploding = true;           // 修改爆炸参数
		// 增加一系列粒子
		for(var k = 0; k < maxExplodedNum; k++){
			var fw = new firework(this.pos.x, this.pos.y, true, this.wordvec, 1);
			fw.initialize();
			// 继承颜色并随机扰动
			fw.red = this.red + random(-colorRandomSize, colorRandomSize);
			fw.green = this.green + random(-colorRandomSize, colorRandomSize);
			fw.blue = this.blue + random(-colorRandomSize, colorRandomSize);
			fw.hue = this.hue;
			fw.applyForce(createVector(0.0, gravity/2));
			this.explodedFireworks.push(fw);
		}
	}
	
	// 显示
	this.show = function(){
		if(this.exploding == true){
			if(this.explodedFireworks.length <= 0){
				this.toDelete = true;
			}
			for(var k = this.explodedFireworks.length - 1; k >= 0; k--){
				this.explodedFireworks[k].move();
				this.explodedFireworks[k].show();
				if(this.explodedFireworks[k].lifespan <= 0){
					this.explodedFireworks.splice(k, 1);
				}
			}
		}
		if(this.isShowing ==false)
			return
		noStroke();
		var s = 0.0;
		let c,brightness;
		if(this.lifespan < 200 && this.exploding) {
			brightness = floor(5*sqrt((this.lifespan))+29);
			// c = 'hsb(' + this.hue + ',100%,'+ floor(5*sqrt((this.lifespan))+39) +'%)'
			// c = 'hsb(' + this.hue + ',100%,'+ floor(((this.lifespan/3)+33)) +'%)'
		}
		else {
			brightness = 100;
			// c = 'hsb(' + this.hue + ',100%,100%)'
			// console.log(this.lifespan)
		}	
		// fill(c);

		if(this.exploding == false){
			s = fireworkSize;
		}else{
			s = explodedFwSize;
		}
		// for(var i = 0; i <= 0; i++){
		// 	ellipse(this.pos.x + i * this.vel.x, this.pos.y + i * this.vel.y, s);
		// }
		strokeWeight(s);
		for(var i = 0; i < this.traceP.length-1; i++){
			c = 'hsb(' + this.hue + ',100%,'+ Math.max(0,brightness-i*10) +'%)'
			stroke(c);
			// ellipse(this.traceP[i][0], this.traceP[i][1], s);
			line(this.traceP[i][0], this.traceP[i][1],this.traceP[i+1][0], this.traceP[i+1][1])
		}
	}
}