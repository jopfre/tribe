import WebGLView from './webgl/WebGLView';
import GUIView from './gui/GUIView';
import TweenMax from "gsap/TweenMax";
import ScrollMagic from 'scrollmagic';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';

export default class App {

	constructor() {

	}

	init() {
		this.initWebGL();
		this.initGUI();
		this.initScrollMagic();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
		document.querySelector('.container').appendChild(this.webgl.renderer.domElement);
	}

	initGUI() {
		this.gui = new GUIView(this);
	}

	initScrollMagic() {
		let webgl = this.webgl;

		var controller = new ScrollMagic.Controller({triggerElement: "#trigger",
			globalSceneOptions: {
				triggerHook: 'onLeave'
			}
		});

		// Change backgrounds
		new ScrollMagic.Scene({
			triggerElement: '.trigger'
		})
		.on("start", function (e) {
			webgl.next();
		})
		.addTo(controller);


		var slides = document.querySelectorAll("section");
		// fade in out content
		for (var i=0; i<slides.length; i++) {
			new ScrollMagic.Scene({
					triggerElement: slides[i]
				})
				.setTween(slides[i], 0.5, {autoAlpha:1})
				.setPin(slides[i])
				.addTo(controller);
		}
		for (var i=0; i<slides.length; i++) {
			new ScrollMagic.Scene({
					triggerElement: slides[i+1]
				})
				.setTween(slides[i], 0.5, {autoAlpha:0})
				.addTo(controller);
		}
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
		
		const el = this.webgl.renderer.domElement;
		el.addEventListener('click', this.click.bind(this));
	}

	animate() {
		this.update();
		this.draw();

		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.gui.stats) this.gui.stats.begin();
		if (this.webgl) this.webgl.update();
		if (this.gui) this.gui.update();
	}

	draw() {
		if (this.webgl) this.webgl.draw();
		if (this.gui.stats) this.gui.stats.end();
	}
	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (this.webgl) this.webgl.resize();
	}

	keyup(e) {
		// g
		if (e.keyCode == 71) { if (this.gui) this.gui.toggle(); }
	}

	click(e) {
		// this.webgl.next();
	}
}
