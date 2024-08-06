import React, { useEffect, useRef, useState } from "react";

const useMouse = () => {
	const elemRef = useRef(null);
	const [mousePos, setMousePos] = useState(null);

	let rect;
	let left;
	let top;
	let clientX;
	let clientY;

	useEffect(() => {
		rect = elemRef.current.getBoundingClientRect();
		left = rect.left;
		top = rect.top;

		elemRef.current.onclick = (e) => {
			clientX = e.clientX - left;
			clientY = e.clientY - top;
			setMousePos({ clientX, clientY });
		};
	}, [elemRef]);

	return {
		targetRef: elemRef,
		boundingBox: rect,
		mousePos,
	};
};

export default useMouse;
