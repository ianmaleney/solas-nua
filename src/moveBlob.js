// Should really do this with translation, not position.
export const move = (el) => {
	let x = Math.floor(Math.random() * 100);
	let y = Math.floor(Math.random() * 100);
	el.style.left = `${x}vw`;
	el.style.top = `${y}vh`;
};
