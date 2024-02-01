import React, { useEffect, useRef } from "react";


export default function Board(){
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas)
		{
			const ctx =  canvas.getContext("2d")
			ctx.fillStyle = "green";
			ctx.fillRect(10, 10, 150, 100);
		}

	}, [])


	return <canvas id="canvas_pong" ref={canvasRef} height={500} width="800px" />
}