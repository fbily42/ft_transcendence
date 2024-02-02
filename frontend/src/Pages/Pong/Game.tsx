import { BallMovement, WallCollision } from "@/components/Pong/Game utils/Ballmovement";
import data from "@/components/Pong/Game utils/data";
import React, { useEffect, useRef } from "react";

export default function Board(){
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch(event.key) {
				case 'ArrowLeft':
					break;
				case 'ArrowRight':
					break;
				case 'a':
					break;
				case 'd':
					break;
				
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		const render = () => {
			const canvas = canvasRef.current;
			if (canvas)
			{
				const ctx =  canvas.getContext("2d")
				if (!ctx)
					return;

				ctx?.clearRect(0, 0, canvas.width, canvas.height);
				let {ballObj}= data;
				BallMovement(ctx, ballObj);
				WallCollision(ballObj, canvas);
				
				
					// if (ballObj.y - ballObj.rad > 0)
			}
			// console.log("frame");
			requestAnimationFrame(render);

		}
		render();
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, [])


	return <canvas id="canvas_pong" ref={canvasRef} height={500} width="800px" />
}