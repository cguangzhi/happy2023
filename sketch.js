// 每次烟花喷射都是一句话，每一个烟花都是一个字的形状
// 主要思路：构造烟花粒子系统，粒子爆炸时的喷射速度是文字的像素点坐标


var txt;                         // 要显示的文本
var textArray;                   // 文本矩阵，每一行为一句话，每一个元素为一个文字
var textDict;                    // 文字到文字的像素点数组的映射
var fireworks = [];              // 每一句话中所有字的粒子数组
var fireworks2 = [];             // 随机生成的烟花
var fireVect=[];

var row = 0;                     // 显示第几行
var blankNums = 0;               // 空白帧

function preload(){
	// txt = "2 0 2 3 /n 新 年 快 乐 /n 举 头 望 明 月 /n 低 头 思 故 乡";         // 文本
	txt = "2 0 2 3 /n 元 旦 快 乐 ";         // 文本
}

function setup(){
	createCanvas(1100, 500);                 // 根据自己电脑屏幕自己设置
	background(0);
	// colorMode(HSB, 360,100, 100);
	textArray = getTextArray(txt);           // 文本处理，得到文本矩阵
	textDict = getTextDict(textArray);       // 逐个字进行绘制，然后得到像素点数组
	fireVect.push(getCircle(20));
	fireVect.push(getHeart(20));
	fireVect.push(getHeart2(20));
	fireVect.push(getHeart3(20));
	frameRate(30);
}

function draw(){
	background(0, 125);

	// 烟花初始化
	if(fireworks2.length < 3) {
		let indd = round(random(-0.5,fireVect.length-1+0.5));
		var fire = new firework(floor(random(0, 1)*width), height, false, fireVect[indd], 0);
		fire.initialize();
		fire.applyForce(createVector(0.0, gravity));
		fireworks2.push(fire);
	}
	// 烟花显示
	for(var i = fireworks2.length - 1; i >= 0; i--){
		fireworks2[i].move();
		fireworks2[i].show();
		if(fireworks2[i].toDelete == true){
			fireworks2.splice(i, 1);
		}
	}

	if(fireworks.length == 0){
		// 放完一遍之后空出一些空白帧
		if(row >= textArray.length){
			if(blankNums <= 30){
				blankNums++;
				return;
			}else{
				row = 0;
				blankNums = 0;
			}
		}
		// 构造下一行文本的粒子
		for(var k = 0; k < textArray[row].length; k++){
			var word = textArray[row][k];
			var vec = findDictVec(word, textDict);
			var fw = new firework((k + 0.5) * width / textArray[row].length, height, false, vec, 1);
			fw.initialize();
			fw.applyForce(createVector(0.0, gravity));
			fireworks.push(fw);
		}
		row += 1;
	}
	// 显示
	for(var i = fireworks.length - 1; i >= 0; i--){
		fireworks[i].move();
		fireworks[i].show();
		if(fireworks[i].toDelete == true){
			fireworks.splice(i, 1);
		}
	}

}