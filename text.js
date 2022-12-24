// 处理字符串并获得每个文字的像素点数组


// 分割字符串，得到字矩阵
function getTextArray(ptxt){
	var tarr = [];
	var lines = split(ptxt, "/n");
	for(var k = 0; k < lines.length; k++){
		var line = lines[k];
		var lineArr = split(line, " ");
		for(var i = lineArr.length - 1; i >= 0; i--){
			if(lineArr[i] == ""){
				lineArr.splice(i, 1);
			}
		}
		if(lineArr.length > 0){
			tarr.push(lineArr);
		}
	}
	return tarr;
}

// 每个字得到像素点数组
function getTextDict(tarr){
	var tdict = [];
	for(var i = 0; i < tarr.length; i++){
		for(var j = 0; j < tarr[i].length; j++){
			var word = tarr[i][j];
			if(findDictVec(word, tdict) == false){
				tdict.push(new wordVec(word, getStringVector(word)));
			}
		}
	}
	return tdict;
}

// 字对应的像素点数组
function wordVec(word, vec){
	this.word = word;
	this.vec = vec;
}

// 查找某个字的像素点数组
function findDictVec(word, tdict){
	for(var k = 0; k < tdict.length; k++){
		if(tdict[k].word == word){
			return tdict[k].vec;
		}
	}
	return false;
}

// 先把字符串绘制在屏幕上，然后根据字符串高度和宽度信息获得某个屏幕区域里面红色像素点的坐标位置
function getStringVector(mystr){
	var s = min(width, height);
	ts = s * 0.1;
	tx = s * 0.3;
	ty = s * 0.3;
	
	background(0);
	textSize(ts);               // 文本大小
	stroke(255, 0, 0);          // 红色线条绘制
	text(mystr, tx, ty);        // 绘制文本
	tw = textWidth(mystr);      // 文本宽度
	
	var strVector = [];
	loadPixels();
	var d = pixelDensity();     // 不同显示器不一样
	// 获得区域里面不是背景点的像素点
	for(var j = floor(tx) * d; j < (tx + tw)  * d; j++){
		for(var i = floor(ty - ts) * d; i <= (ty+1) * d; i++){
			var starti = (i * width * d + j) * 4;
			var r = pixels[starti];
			var g = pixels[starti + 1];
			var b = pixels[starti + 2];
			if(!(r == 0 && g == 0 && b == 0)){
				strVector.push(createVector(j - (tx + tw/2) * d, i - (ty - ts/2) * d));  // 以字的中心为原点
			}
		}
	}
	return strVector;
}


function getCircle(r) {
	var strVector = [];
	dtheta = 360/180;
	for(var theta=0; theta<360; theta=dtheta+theta) {
		strVector.push(createVector(r*Math.cos(theta)*random(0.95,1.05), r*Math.sin(theta)*random(0.95,1.05)));
	}
	for(var theta=0; theta<360; theta=dtheta*1.5+theta) {
		strVector.push(createVector(0.8*r*Math.cos(theta + random(-dtheta, dtheta))*random(0.95,1.05), 0.8*r*Math.sin(theta + random(-dtheta, dtheta))*random(0.95,1.05)));
	}
	for(var theta=0; theta<360; theta=dtheta*2+theta) {
		strVector.push(createVector(0.5*r*Math.cos(theta + random(-dtheta, dtheta))*random(0.95,1.05), 0.5*r*Math.sin(theta + random(-dtheta, dtheta))*random(0.95,1.05)));
		strVector.push(createVector(0.3*r*Math.cos(theta + random(-dtheta, dtheta))*random(0.95,1.05), 0.3*r*Math.sin(theta + random(-dtheta, dtheta))*random(0.95,1.05)));
	}
	
	return strVector;
}

function getHeart(r) {
	r = r/16;
	var strVector = [];
	dtheta = 1;
	for(var theta=0; theta<360; theta=dtheta+theta) {
		strVector.push(createVector(r*16*Math.pow(Math.sin(theta),3)*random(0.95,1.05), -r*(13*Math.cos(theta)-5*Math.cos(theta*2)-2*Math.cos(theta*3)-Math.cos(theta*4))*random(0.95,1.05)));
	}
	return strVector;
}

function getHeart2(r) {
	r = r/16;
	var strVector = [];
	dtheta = 2;
	for(var theta=0; theta<360; theta=dtheta+theta) {
		strVector.push(createVector(r*16*Math.pow(Math.sin(theta),3)*random(0.95,1.05), -r*(13*Math.cos(theta)-5*Math.cos(theta*2)-2*Math.cos(theta*3)-Math.cos(theta*4))*random(0.95,1.05)));
		theta = theta +random(-dtheta,dtheta);
		strVector.push(createVector(r*16*Math.pow(Math.sin(theta),3)*random(0.45,1), -r*(13*Math.cos(theta)-5*Math.cos(theta*2)-2*Math.cos(theta*3)-Math.cos(theta*4))*random(0.45,1)));
	}
	return strVector;
}

function getHeart3(r) {
	n = 300;
	r = r/3.14;
	d = 2*Math.PI/n;
	t = 10;
	var x = 0;
	var strVector = [];
	for(let i=0; i<n; i++) {
		x = (d*i-Math.PI);
		strVector.push(createVector(r*x, -r*(Math.pow(Math.abs(x),2/3)+0.9*Math.sqrt(Math.PI*Math.PI-x*x)*Math.sin(t*x*Math.PI))));
	}
	return strVector;
}