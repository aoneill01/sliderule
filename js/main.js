"use strict"; 

$( ".cursor" ).draggable(
{ 
	axis: "x", 
	drag: function( event, ui ) {
		ui.position.left = Math.round(2* ui.position.left);
		if (ui.position.left < 0) ui.position.left = 0;
		if (ui.position.left > 1800) ui.position.left = 1800;
		$('.cursor .slide-rule').css('left', -2 * ui.position.left - 100);
	}
});

$( ".drag-slide" ).draggable(
{ 
	axis: "x", 
	drag: function( event, ui ) {
		ui.position.left = Math.round(2* ui.position.left);
		if (ui.position.left < -1600) ui.position.left = -1600;
		if (ui.position.left > 1800) ui.position.left = 1800;
		$('.clone-slide').css('left', ui.position.left);
	}
});

var primary = 10*2;
var secondary = 7*2;
var tertiary = 5*2;
var minor = 3*2;

if (!Object.keys) {
  Object.keys = function(obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}

function marker(x, size, f, options) {
	var logX = f(x);
	var x0 = logX * options.factor + options.x;
	var top = options.y;
	if (options.up) {
		top = top - size;
	}
	options.div.append($('<div class="marker" style="top: ' + top + 'px; left: ' + x0 + 'px; height: ' + size + 'px; ' + (options.color ? 'border-color: ' + options.color : '') +'"></div>'));
}

function label(x, value, f, options) {
	var logX = f(x);
	var x0 = logX * options.factor + options.x;
	var top = options.y + (options.up ? -42 : 15);
	options.div.append($('<div class="label" style="top: ' + top + 'px; left: ' + (x0 - 10) + 'px; ' + (options.color ? 'color: ' + options.color : '') +'">' + value + '</div>'));
}

function subLabel(x, value, f, options) {
	var logX = f(x);
	var x0 = logX * options.factor + options.x;
	var top = options.y + (options.up ? -24 : 5);
	options.div.append($('<div class="sub-label" style="top: ' + top + 'px; left: ' + (x0 + 1) + 'px; ' + (options.color ? 'color: ' + options.color : '') +'">' + value + '</div>'));
}

function scaleLabel(value, options) {
	var top = options.y + (options.up ? -25 : -2);

	options.div.append($('<div class="label" style="top: ' + top + 'px; left: ' + (options.x - 40) + 'px;">' + value + '</div>'));
}

function subdivide(start, length, divisions, f, options) {
	for (var i = 0; i < divisions[0].count; i++) {
		var x = start + length * (i / divisions[0].count);
		if (i != 0) {
			marker(x, divisions[0].size, f, options);
		}
		if (divisions.length > 1) {
			subdivide(x, length / divisions[0].count, divisions.slice(1), f, options);
		}
	}
}

function getDivisionInfo(subdivisions, x) {
	var keys = Object.keys(subdivisions).sort(function(a, b) { return parseInt(a) - parseInt(b); });
	for (var i = 0; i < keys.length; i++) {
		if (x < keys[i]) {
			return {
				length: subdivisions[keys[i]].length,
				divisions: jQuery.map(subdivisions[keys[i]].divisions, function(d, j) {
					return {
						count: d,
						size: j == 0 ? secondary : j == 1 ? tertiary : minor
					};
				})
			};
		}
	}
}

function ab(x) { return Math.log(x * x) / Math.LN10 / 4; }
function cd(x) { return Math.log(x) / Math.LN10; }
function k(x) { return Math.log(x * x * x) / Math.LN10 / 9; }
function s(x) { return Math.log(10 * Math.sin(x * (Math.PI / 180))) / Math.LN10; }
function t(x) { return Math.log(10 * Math.tan(x * (Math.PI / 180))) / Math.LN10; }
function ci(x) { return Math.log(1/x) / Math.LN10 + 1; }
function l(x) { return x / 10; }

function drawCD(div, up, y) {
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div
	};
	
	scaleLabel(up ? "C" : "D", options);
	
	var subdivisions = [];
	subdivisions[2] = {divisions: [10, 2, 5], length: 1};
	subdivisions[4] = {divisions: [2, 5, 5], length: 1};
	subdivisions[10] = {divisions: [2, 5, 2], length: 1};
	
	for (var i = 1; i < 10; i++) {
		marker(i, primary, cd, options);
		label(i, i, cd, options);
		subLabel(1 + i/10, '.' + i, cd, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, cd, options);
	}
	marker(10, primary, cd, options);
	label(10, 1, cd, options);
	
	marker(Math.PI, primary, cd, options);
	label(Math.PI, "π", cd, options);
}

function drawCi(div, up, y) {
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div,
		color: 'red'
	};
	
	scaleLabel("CI", options);
	
	var subdivisions = [];
	subdivisions[2] = {divisions: [10, 2, 5], length: 1};
	subdivisions[4] = {divisions: [2, 5, 5], length: 1};
	subdivisions[10] = {divisions: [2, 5, 2], length: 1};
	
	for (var i = 1; i < 10; i++) {
		marker(i, primary, ci, options);
		label(i, i, ci, options);
		subLabel(1 + i/10, '.' + i, ci, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, ci, options);
	}
	marker(10, primary, ci, options);
	label(10, 1, ci, options);
	
	marker(Math.PI, primary, ci, options);
	label(Math.PI, "π", ci, options);
}


function drawAB(div, up, y) {
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div
	};
	
	scaleLabel(up ? "A" : "B", options);
	
	var subdivisions = [];
	subdivisions[2] = {divisions: [2, 5, 5], length: 1};
	subdivisions[5] = {divisions: [2, 5, 2], length: 1};
	subdivisions[10] = {divisions: [2, 5], length: 1};
	subdivisions[20] = {divisions: [2, 5, 5], length: 10};
	subdivisions[50] = {divisions: [2, 5, 2], length: 10};
	subdivisions[100] = {divisions: [2, 5], length: 10};

	for (var i = 1; i < 10; i++) {
		marker(i, primary, ab, options);
		label(i, i, ab, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, ab, options);
	}
	for (var i = 10; i < 100; i = i + 10) {
		marker(i, primary, ab, options);
		label(i, i/10, ab, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, ab, options);
	}
	marker(100, primary, ab, options);
	label(100, 1, ab, options);

	marker(Math.PI, primary, ab, options);
	label(Math.PI, "π", ab, options);
}

function drawK(div, up, y) {
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div,
		color: 'blue'
	};
	
	scaleLabel("K", options);
	
	var subdivisions = [];
	subdivisions[3] = {divisions: [2, 5, 2], length: 1};
	subdivisions[6] = {divisions: [2, 5], length: 1};
	subdivisions[10] = {divisions: [5], length: 1};
	subdivisions[30] = {divisions: [2, 5, 2], length: 10};
	subdivisions[60] = {divisions: [2, 5], length: 10};
	subdivisions[100] = {divisions: [5], length: 10};
	subdivisions[300] = {divisions: [2, 5, 2], length: 100};
	subdivisions[600] = {divisions: [2, 5], length: 100};
	subdivisions[1000] = {divisions: [5], length: 100};
	
	for (var i = 1; i < 10; i++) {
		marker(i, primary, k, options);
		label(i, i, k, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, k, options);
	}
	for (var i = 10; i < 100; i = i + 10) {
		marker(i, primary, k, options);
		label(i, i/10, k, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, k, options);
	}
	for (var i = 100; i < 1000; i = i + 100) {
		marker(i, primary, k, options);
		label(i, i/100, k, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, k, options);
	}
	marker(1000, primary, k, options);
	label(1000, 1, k, options);
}

function drawS(div, up, y) {
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div,
		color: 'blue'
	};
	
	var subdivisions = [];
	subdivisions[10] = {divisions: [2, 5, 2], length: 1};
	subdivisions[30] = {divisions: [5, 5], length: 5};
	subdivisions[70] = {divisions: [2, 5, 2], length: 10};
	subdivisions[80] = {divisions: [2, 5], length: 10};
	
	scaleLabel("S", options);
	
	for (var i = 6; i < 10; i++) {
		marker(i, primary, s, options);
		label(i, i, s, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, s, options);
	}
	for (var i = 10; i < 30; i = i + 5) {
		marker(i, primary, s, options);
		label(i, i, s, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, s, options);
	}
	for (var i = 30; i < 70; i = i + 10) {
		marker(i, primary, s, options);
		label(i, i, s, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, s, options);
	}
	marker(70, primary, s, options);
	label(70, 70, s, options);
	subdivide(70, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, s, options);
	marker(80, primary, s, options);
	marker(85, secondary, s, options);
	marker(90, primary, s, options);
	label(90, 90, s, options);
}

function drawT(div, up, y) {
	
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div,
		color: 'blue'
	};
	
	scaleLabel("T", options);
	
	var subdivisions = [];
	subdivisions[10] = {divisions: [2, 5, 2], length: 1};
	subdivisions[30] = {divisions: [5, 2, 5], length: 5};
	subdivisions[45] = {divisions: [5, 5], length: 5};
	
	for (var i = 6; i < 10; i++) {
		marker(i, primary, t, options);
		label(i, i, t, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, t, options);
	}
	for (var i = 10; i < 45; i = i + 5) {
		marker(i, primary, t, options);
		label(i, i, t, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, t, options);
	}
	marker(45, primary, t, options);
	label(45, 45, t, options);
}

function drawL(div, up, y) {
	var options = {
		x: 50,
		y: y,
		thickness: .5,
		factor: 1700,
		up: up,
		div: div,
		color: 'blue'
	};
	
	scaleLabel("L", options);
	
	var subdivisions = [];
	subdivisions[10] = {divisions: [2, 5, 5], length: 1};
	
	for (var i = 0; i < 10; i++) {
		marker(i, primary, l, options);
		label(i, i, l, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, l, options);
	}
	marker(10, primary, l, options);
	label(10, 1, l, options);
}

drawAB($('.body'), true, 200);
drawAB($('.slide'), false, 0);

drawCi($('.slide'), true, 120);
drawCD($('.slide'), true, 200);
drawCD($('.body'), false, 400);

drawS($('.body'), true, 105);
drawT($('.body'), true, 50);

drawK($('.body'), false, 495);
drawL($('.body'), false, 550);