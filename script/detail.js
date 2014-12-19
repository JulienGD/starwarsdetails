/*
	init slideshow listeners
*/



var MatSlide = function(){
};

MatSlide.prototype.init = function(){
	//click events for growing slides
	var slides = document.querySelectorAll(".slide");
	for ( var i = 0; i < slides.length; i++){
		slides[i].addEventListener("click", this.grow, false);
	}

	//next slide event 
	var nextArrows = document.querySelectorAll('.slideshow-control-next');
	for(var i=0;i<nextArrows.length;i++){
		nextArrows[i].addEventListener('click',this.nextSlide,false);
	}

	//prev slide event
	var prevArrows = document.querySelectorAll('.slideshow-control-prev');
	for(var i=0;i<prevArrows.length;i++){
		prevArrows[i].addEventListener('click',this.prevSlide,false);
	}
}
/*
	listener next
*/
MatSlide.prototype.nextSlide = function(){

	//this context refers to clicked element's DOM !!!

	var slideshow = this.parentElement.parentElement;
	var slideNodes = slideshow.childNodes;
	var currSlide = null;
	var nextSlide = null;

	for ( var i = 0; i < slideNodes.length; i++){
		if ( slideNodes[i].nodeName == "DIV"){
			if ( hasClass(slideNodes[i], "current")){
				currSlide = slideNodes[i];
			}
		}
	}
	if ( currSlide.nextSibling){
		nextSlide = currSlide.nextSibling;
		currSlide.className = "slide";
		nextSlide.className += " current shadow";	
		nextSlide.style.left = 0;
		setTimeout(function(){
			nextSlide.classname = "slide current";
		}, 1200);
	}
}

/*
	listener prev
*/
MatSlide.prototype.prevSlide = function(){

	//this context refers to clicked element's DOM !!!

	var slideshow = this.parentElement.parentElement;
	var slideNodes = slideshow.childNodes;
	var currSlide = null;
	var prevSlide = null;

	for ( var i = 0; i < slideNodes.length; i++){
		if ( slideNodes[i].nodeName == "DIV"){
			if ( hasClass(slideNodes[i], "current")){
				currSlide = slideNodes[i];
			}
		}
	}
	if ( currSlide.previousSibling.previousSibling){
		prevSlide = currSlide.previousSibling;
		currSlide.className = "slide shadow";
		currSlide.style.left = "200%"
		setTimeout(function(){
			currSlide.className = "slide";
		}, 1200);
		prevSlide.className += " current";	
	}
}

/*
	grows slides bigger
*/

MatSlide.prototype.grow = function(){
	this.style.position = "absolute";
}


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

	window.onload = function(){
		// tein
		var mSlide = new MatSlide;
		mSlide.init();
	};

var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}
/*
======================
						TEMPLATES
======================
*/
// 1 - Society
var Society = function(metadata){
	this.metadata = metadata;
	this.template = 
		'<div class="infopanel-half-hz">'+
			'<div class="header">'+
				'<div class="exit-button"></div>'+
				'<h1>Société</h1>'+
			'</div>'+
			'<div class="text">'+
				'<%this.abstract%>'+
				'</br>'+
				'<h3><%this.capital%></h3>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-half-hz">'+
			'<div class="infopanel-half-vt">'+
				'<div class="infopanel-twothird-hz" id="info-">'+
					'<canvas id="radar-languages"></canvas>'+
				'</div>'+
				'<div class="infopanel-third-hz">'+
					'<ul>'+
						'<%for(var index in this.places) {%>'+ 
				    		'<li><%this.places[index]%></li>'+
				    	'<%}%>'+
			   		'</ul>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-half-vt">'+
				'<canvas id="pie-species"></canvas>'+
				'<canvas id="bar-inhabitants"></canvas>'+
			'</div>'+
		'</div>';
}

Society.prototype.init = function(){
	var self = this;
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);

	// $(".infopanel div").css({
	// 	opacity : 0
	// });
	// debugger;
	// $(".infopanel div").fadeIn("fast", function(){
		var ctx,
			newChart;
		//#radar-language radar chart for number of languauges
		ctx = document.getElementById("radar-languages").getContext("2d");
		chart = new Chart(ctx).Radar(radarLanguages());
		//#pie-species pie chart for number of inhabiting species
		ctx = document.getElementById("pie-species").getContext("2d");
		chart = new Chart(ctx).Pie(pieSpecies(self.metadata.name));	
		// //#bar-inhabitants radar chart for number of inhabitants
		ctx = document.getElementById("bar-inhabitants").getContext("2d");
		chart = new Chart(ctx).Bar(barInhabitants);
	//})
}

// 2 - Planet's data

var Insights = function(metadata){
	this.metadata = metadata;
	this.template = 
		'<div class="infopanel-third-hz">'+
		'<div class="header">'+
			'<div class="exit-button"></div>'+
			'<h1><%this.name%></h1>'+
		'</div>'+
		'<div class="text">'+
			'<%this.geography%>'+
			'</br>'+
			'<h3><%this.capital%></h3>'+
		'</div>'+
	'</div>'+
	'<div class="infopanel-twothird-hz">'+
		'<div class="infopanel-half-vt">'+
			'<div class="infopanel-half-hz" id="info-">'+
				'<canvas id="radar-satellites"></canvas>'+
			'</div>'+
			'<div class="infopanel-half-hz">'+
				'<canvas id="bars-surface"></canvas>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-half-vt">'+
			'<div class="infopanel-half-hz">'+
				'<canvas id="polar-distance"></canvas>'+
			'</div>'+
			'<div class="infopanel-half-hz">'+
				'<canvas id="polar-diameter"></canvas>'+
			'</div>'+			
		'</div>'+
	'</div>';
}

Insights.prototype.init = function(){
	var self = this;
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);
	var ctx,
		newChart,
		data;
	//'<canvas id="radar-satellites"></canvas>'+
	ctx = document.getElementById("radar-satellites").getContext("2d");
	chart = new Chart(ctx).Radar(radarSatellites);
	//'<canvas id="bars-surface"></canvas>'+
	ctx = document.getElementById("bars-surface").getContext("2d");
	chart = new Chart(ctx).Bar(barsSurface);
	//'<canvas id="polar-distance"></canvas>'+
	ctx = document.getElementById("polar-distance").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDistance(self.metadata.name));
	//'<canvas id="polar-diameter"></canvas>'+
	ctx = document.getElementById("polar-diameter").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDiameter(self.metadata.name));
}

var Home = function(metadata){
	this.metadata = metadata;
	this.template = 
	'<div class="name">'+
			'<p><%this.name%></p>'+
		'</div>'+
		'<div class="infopanel-half-hz">'+
			'<div class="infopanel-half-vt">'+
				'<div class="floating-wrapper-plus" id="button-society">'+
					'<div class="floating-wrapper">'+
						'<a href="javascript:void(0)" class="button floating danger ripple" id="button-society">+</a>' +
					'</div>' +
				'</div>' +
	
				'<div class="slideshow">'+
					'<div class="slideshow-controls">'+
						'<div class="slideshow-control-prev">&#10094;</div>'+
						'<div class="slideshow-control-next">&#10095;</div>'+
					'</div>'+
					'<div class="slide current">'+
						'<h1>Société</h1>'+
							'<div class="slide-inner">'+
								'<canvas id="pie-species"></canvas>'+
							'</div>'+
					'</div>'+
					'<div class="slide">'+
							'<div class="slide-inner">'+
								'<canvas id="bar-inhabitants"></canvas>'+
							'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="infopanel-half-vt">'+
				'<div class="floating-wrapper-plus" id="button-physics">'+
					'<div class="floating-wrapper">'+
						'<a href="javascript:void(0)" class="button floating danger ripple" id="button-insights">+</a>' +
					'</div>' +
				'</div>' +
				'<div class="slideshow">'+
					'<div class="slideshow-controls">'+
						'<div class="slideshow-control-prev">&#10094;</div>'+
						'<div class="slideshow-control-next">&#10095;</div>'+
					'</div>.'+
					'<div class="slide current">'+
						'<h1>Physique</h1>'+
						'<div class="slide-inner">'+
							'<canvas id="polar-distance"></canvas>'+
						'</div>'+
					'</div>'+
					'<div class="slide">'+
							'<div class="slide-inner">'+
								'<canvas id="polar-diameter"></canvas>'+
							'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="infopanel-half-hz">'+
			'<div class="infopanel-half-tt"> '+
				'<div class="floating-wrapper-plus" id="button-movies">'+
					'<div class="floating-wrapper">'+
						'<a href="javascript:void(0)" class="button floating danger ripple" id="button-movies">+</a>' +
					'</div>' +
				'</div>' +
				'<h1>Histoire</h1>'+
				'<p><%this.history%></p>'+
			'</div>'+
		'</div>';
}

Home.prototype.init = function(){
	var self = this;

	// insert template in DOM
	document.querySelector(".infopanel").innerHTML = TemplateEngine(self.template, self.metadata);
	var ctx,
		newChart,
		data;

	//set up event listeners for buttons
	document.getElementById("button-society").addEventListener('click', function(){
		setTimeout(function(){
			var society = new Society(self.metadata);
			society.init();
		}, 700);
	});
	document.getElementById("button-insights").addEventListener('click', function(){
		setTimeout(function(){
			var insights = new Insights(self.metadata);
			insights.init();
		}, 700);
	});
	//document.getElementById("button-movies")
	//draw charts
	ctx = document.getElementById("pie-species").getContext("2d");
	chart = new Chart(ctx).Pie(pieSpecies(self.metadata.name));	

	ctx = document.getElementById("bar-inhabitants").getContext("2d");
	chart = new Chart(ctx).Bar(barInhabitants);

	ctx = document.getElementById("polar-distance").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDistance(self.metadata.name));

	ctx = document.getElementById("polar-diameter").getContext("2d");
	chart = new Chart(ctx).PolarArea(polarDiameter(self.metadata.name));

	//setup slideshows
	var mSlide = new MatSlide;
	mSlide.init();
}

$.fn.materialripple = function(options) {
	var defaults = {
		rippleClass: 'ripple-wrapper'
	}
	$.extend(defaults, options);
	$(this).append('<span class="'+defaults.rippleClass+'"></span>');
	$(this).addClass('has-ripple').css({'position': 'relative', 'overflow': 'hidden'});

	$(this).bind('click', function(e){
		$(this).find('.'+defaults.rippleClass).removeClass('animated');
		var mouseX = e.clientX;
		var mouseY = e.clientY;

		elementWidth = $(this).outerWidth();
		elementHeight = $(this).outerHeight();
		d = Math.max(elementWidth, elementHeight);
		$(this).find('.'+defaults.rippleClass).css({'width': d, 'height': d});
		var rippleX = e.clientX - $(this).offset().left - d/2;
		var rippleY = e.clientY - $(this).offset().top - d/2;

		$(this).find('.'+defaults.rippleClass).css('top', rippleY+'px').css('left', rippleX+'px').addClass('animated');
		$(this).parent().addClass('animated');
	});
}

$(function(){
	$('.ripple').materialripple();
	});

function initThreeJs(){

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth/2, window.innerHeight );
	document.getElementById("container").appendChild( renderer.domElement );

	camera.position.z = 5;

	function render() {
		requestAnimationFrame( render );
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render( scene, camera );
	}
	render();
}

function getMetadata(){
	var url = document.URL,
		planete = url.slice(url.indexOf("&")+1, url.length),
		metadata;

	for (var i = 0; i < planetsMetadata.length; i++){
		if ( planetsMetadata[i].name == planete) { metadata = planetsMetadata[i] }
	}

	return metadata;
}

function init(){
	
	var metadata = getMetadata();
	var home = new Home(metadata);
	home.init();
	
	//initThreeJs();
}

init();


/*
	transition :
		créer une div au même endroit
		lui appliquer la classe
			setTimeout
				repeat
*/

// function materialTransition(el){
// 	var self = el;
// 	var buttonTemplate = 
// 					'<div class="floating-wrapper-plus" id="growing-button">'+
// 						'<div class="floating-wrapper">'+
// 							'<a href="javascript:void(0)" class="button floating danger ripple" id="button-movies">+</a>' +
// 						'</div>' +
// 					'</div>';

// 	document.querySelector(".infopanel").innerHTML += TemplateEngine(buttonTemplate);
// 	var button = document.getElementById("growing-button");
// 	button.style.position = "absolute";
// 	button.style.left = self.offsetLeft;
// 	button.style.top = self.offsetTop;
// 	button.style.zIndex = 30;
// 	button.style.transition= "all 1s ease-in-out";
// 	button.style.transform= "scale(100)";
// 	debugger;
// 	setTimeout(function(){
// 		document.querySelector(".infopanel").innerHTML += TemplateEngine(buttonTemplate);
// 		var button = document.getElementById("growing-button");
// 		button.style.position = "absolute";
// 		button.firstChild.firstChild.backgroundColor = "#fff";
// 		button.style.left = self.offsetLeft;
// 		button.style.top = self.offsetTop;
// 		button.style.zIndex = 30;
// 		button.style.transition= "all .2s ease-in-out";
// 		button.style.transform= "scale(100)";
// 	}, 250);
// 	setTimeout(function(){
// 		var society = new Society(self.metadata);
// 		society.init();
// 	}, 500);
// 	console.log(el);
// }







