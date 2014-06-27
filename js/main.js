"use strict"; 

$( ".slide" ).draggable({ axis: "x", containment: [ -740, 0, 840, 200 ] });
$( ".cursor" ).draggable({ axis: "x", containment: [ 0, 0, 800, 200 ] });

var primary = 17;
var secondary = 13;
var tertiary = 9;
var minor = 5;

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
	var logX = Math.log(f(x)) / Math.LN10;
	var x0 = logX * options.factor + options.x;
	var top = options.y;
	if (options.up) {
		top = top - size;
	}
	options.div.append($('<div class="marker" style="top: ' + top + 'px; left: ' + x0 + 'px; height: ' + size + 'px;"></div>'));
}

function label(x, value, f, options) {
	var logX = Math.log(f(x)) / Math.LN10;
	var x0 = logX * options.factor + options.x;
	var top = options.y + (options.up ? -30 : 20);
	options.div.append($('<div class="label" style="top: ' + top + 'px; left: ' + (x0 - 10) + 'px;">' + value + '</div>'));
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

function ab(x) { return Math.sqrt(x); }
function cd(x) { return x; }

function drawCD(div, up, y) {
	var options = {
		x: 10,
		y: y,
		thickness: .5,
		factor: 780,
		up: up,
		div: div
	};
	
	var subdivisions = [];
	subdivisions[2] = {divisions: [2, 5, 5], length: 1};
	subdivisions[5] = {divisions: [2, 5, 2], length: 1};
	subdivisions[10] = {divisions: [2, 5], length: 1};
	
	for (var i = 1; i < 10; i++) {
		marker(i, primary, cd, options);
		label(i, i, cd, options);
		subdivide(i, getDivisionInfo(subdivisions, i).length, getDivisionInfo(subdivisions, i).divisions, cd, options);
	}
	marker(10, primary, cd, options);
	label(10, 1, cd, options);
}

function drawAB(div, up, y) {
	var options = {
		x: 10,
		y: y,
		thickness: .5,
		factor: 780,
		up: up,
		div: div
	};
	
	var subdivisions = [];
	subdivisions[2] = {divisions: [2, 5, 2], length: 1};
	subdivisions[5] = {divisions: [2, 5], length: 1};
	subdivisions[10] = {divisions: [2, 2], length: 1};
	subdivisions[20] = {divisions: [2, 5, 2], length: 10};
	subdivisions[50] = {divisions: [2, 5], length: 10};
	subdivisions[100] = {divisions: [2, 2], length: 10};

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

}

drawCD($('.slide'), true, 70);

drawAB($('.slide'), false, 0);

drawCD($('.body-bottom'), false, 0);

drawAB($('.body-top'), true, 46);
