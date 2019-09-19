"use strict";

const queryWidth = window.matchMedia("(max-width: 900px)");
const transitionTime = 1100;

/* drawing */

const drawing = () => {
	const canvas = document.querySelector(".sketch__canvas--js");
	const ctx = canvas.getContext("2d");

	const sketch = document.querySelector(".sketch--js");
	const sketch_style = getComputedStyle(sketch);
	canvas.width = parseInt(sketch_style.getPropertyValue("width"));
	canvas.height = parseInt(sketch_style.getPropertyValue("height"));

	const mouse = {
		x: 0,
		y: 0
	};
	const last_mouse = {
		x: 0,
		y: 0
	};

	let firstTime = true;

	/* Mouse Capturing Work */
	canvas.addEventListener(
		"mousemove",
		function(e) {
			if (!firstTime) {
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;
			} else {
				last_mouse.x = e.pageX - this.offsetLeft;
				last_mouse.y = e.pageY - this.offsetLeft;
				firstTime = false;
			}
			mouse.x = e.pageX - this.offsetLeft;
			mouse.y = e.pageY - this.offsetTop;
		},
		false
	);

	/* Drawing on Paint App */
	ctx.lineWidth = 0.1;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.strokeStyle = "black";

	const onPaint = () => {
		ctx.beginPath();
		ctx.moveTo(last_mouse.x, last_mouse.y);
		ctx.lineTo(mouse.x, mouse.y);
		ctx.closePath();
		ctx.stroke();
	};

	canvas.addEventListener("mousemove", onPaint);
};

if (!queryWidth.matches) {
	drawing();
}

/* slides */

let slideReady = true;
let slideReadyTimeout;

function slideImages(thisLine) {
	let count = 0;
	let delta;

	return function(event, changeDirection) {
		const windowHeight = window.innerHeight;
		const line = document.querySelector(thisLine);
		const section = line.querySelector(".gallery__container--js");
		const images = section.querySelectorAll(".gallery__image--js");

		if (!changeDirection) {
			event.wheelDelta
				? (delta = event.wheelDelta)
				: (delta = -1 * event.deltaY);
		} else {
			event.wheelDelta
				? (delta = -1 * event.wheelDelta)
				: (delta = event.deltaY);
		}

		if (delta < 0) {
			if (count < images.length - 2) {
				count += 2;
				section.style.top =
					-1 * images[count].offsetTop + windowHeight * 0.038 + "px";
			} else {
				count = 0;

				section.style.top = -1 * section.scrollHeight + "px";
				const sectionBottom = section.cloneNode(true);

				sectionBottom.style.top = windowHeight + "px";
				line.appendChild(sectionBottom);

				imagesHover();
				imagesClick();

				setTimeout(() => (sectionBottom.style.top = 0 + "px"), 5);
				setTimeout(() => section.remove(), transitionTime);
			}
		} else if (delta > 0) {
			if (count >= 2) {
				count -= 2;
				section.style.top =
					-1 * images[count].offsetTop + windowHeight * 0.038 + "px";
			} else {
				count = images.length - 2;
				section.style.top = images[2].offsetTop + windowHeight * 0.038 + "px";
				const sectionTop = section.cloneNode(true);

				sectionTop.style.top = -1 * section.scrollHeight + "px";
				line.appendChild(sectionTop);

				imagesHover();
				imagesClick();

				setTimeout(
					() =>
						(sectionTop.style.top =
							-1 *
								sectionTop.querySelectorAll(".gallery__image--js")[count]
									.offsetTop +
							windowHeight * 0.038 +
							"px"),
					5
				);
				setTimeout(() => section.remove(), transitionTime);
			}
		}
	};
}
const slideLine1 = slideImages(".gallery--1");
const slideLine2 = slideImages(".gallery--2");

if (!queryWidth.matches) {
	window.addEventListener("wheel", event => {
		if (slideReady) {
			if (event.clientX >= 0 && event.clientX <= window.innerWidth / 3) {
				slideLine1(event, false);
			} else if (
				event.clientX > window.innerWidth / 3 &&
				event.clientX < (window.innerWidth / 3) * 2
			) {
				slideLine1(event, false);
				slideLine2(event, true);
			} else {
				slideLine2(event, false);
			}

			slideReady = false;
			clearTimeout(slideReadyTimeout);
			slideReadyTimeout = setTimeout(() => (slideReady = true), transitionTime);
		}
	});
}

/* init -  header - contact */

const header = document.querySelector(".header");
const contactContainer = document.querySelector(".contact__container");
const backText = document.querySelector(".back-text");
const contactSection = document.querySelector(".contact");

let showContact = false;

const hoverContact = text => {
	if (!showContact) header.textContent = text;
};

const displayContact = () => {
	if (!showContact) {
		contactSection.style.display = "block";
		contactSection.style.opacity = 1;
		contactSection.style.zIndex = 1;
		backText.style.opacity = 1;
		contactSection.style.cursor = "none";
		showContact = true;
	} else {
		setTimeout(() => (contactSection.style.display = "none"), 500);
		contactSection.style.opacity = 0;
		contactSection.style.zIndex = 0;
		backText.style.opacity = 0;
		contactSection.style.cursor = "auto";
		header.textContent = "Patrycja Petryk";
		showContact = false;
	}
};

const backTxtPosition = event => {
	backText.style.left = event.clientX + 10 + "px";
	backText.style.top = event.clientY + 10 + "px";
};

const backTxtPositionOut = () => {
	backText.style.left = -500 + "px";
	backText.style.top = -500 + "px";
};

const imagesHover = () => {
	const images = document.querySelectorAll(".gallery__image--js");
	const galleryParagraph = document.querySelectorAll(".gallery__paragraph--js");

	images.forEach((image, index) => {
		image.addEventListener("mouseover", () => {
			galleryParagraph[index].style.opacity = 1;
		});
		image.addEventListener("mouseout", () => {
			galleryParagraph[index].style.opacity = 0;
		});
	});
};

const imagesClick = () => {
	const images = document.querySelectorAll(".gallery__image--js");
	images.forEach(image => {
		image.addEventListener("click", () => {
			window.open(image.dataset.url);
		});
	});
};

const init = () => {
	window.removeEventListener("click", init);
	document.querySelector(".sketch").style.display = "none";
	document.querySelector(".gallery--1").style.opacity = 1;
	document.querySelector(".gallery--2").style.opacity = 1;
	header.style.fontSize = "18px";
	header.style.zIndex = 1;
	document.querySelector(".enter--js").style.opacity = 0;

	/* images hover */
	imagesHover();

	/* contact */
	header.addEventListener("mouseover", () => hoverContact("contact"));
	header.addEventListener("mouseout", () => hoverContact("Patrycja Petryk"));
	header.addEventListener("click", displayContact);
	contactSection.addEventListener("click", displayContact);

	/* close txt */
	backTxtPositionOut();
	contactSection.addEventListener("mousemove", backTxtPosition);
	contactSection.addEventListener("mouseout", backTxtPositionOut);
	contactContainer.addEventListener(
		"mouseover",
		() => (backText.style.opacity = 0)
	);
	contactContainer.addEventListener(
		"mouseout",
		() => (backText.style.opacity = 1)
	);
	backText.textContent = "close";
	backText.style.opacity = 0;
};

if (!queryWidth.matches) {
	window.addEventListener("click", init);
	window.addEventListener("resize", () => window.scrollTo(0, 0));
}

window.addEventListener("load", imagesClick);
