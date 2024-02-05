import { BallMovement, WallCollision } from "@/components/Pong/Game utils/Ballmovement";
import Paddle from "@/components/Pong/Game utils/Paddle";
import data from "@/components/Pong/Game utils/data";
import React, { useEffect, useRef, useState } from "react";

export default function Board(){
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

	
	useEffect(() => {
		let {ballObj, paddle}= data;
		const handleKeyDown = (event: KeyboardEvent) => {
			setKeys(prevKeys => ({ ...prevKeys, [event.key]: true }));
		  };
		
		  const handleKeyUp = (event: KeyboardEvent) => {
			setKeys(prevKeys => ({ ...prevKeys, [event.key]: false }));
		  };
		  window.addEventListener('keydown', handleKeyDown);
		  window.addEventListener('keyup', handleKeyUp);
		// const handleKeyDown = (event: KeyboardEvent) => {
		// 	switch(event.key) {
		// 		case 'ArrowLeft':
		// 			paddle.y;
		// 			break;
		// 		case 'ArrowRight':
		// 			paddle.y += 10;
		// 			break;
		// 		case 'a':
		// 			break;
		// 		case 'd':
		// 			break;
				
		// 	}
		// }
		// window.addEventListener('keydown', handleKeyDown);
		let animationFrameId: number;
		const render = () => {
			const canvas = canvasRef.current;
			if (canvas)
			{
				const ctx =  canvas.getContext("2d")
				if (!ctx)
					return;
				

				ctx?.clearRect(0, 0, canvas.width, canvas.height);
				BallMovement(ctx, ballObj);
				Paddle(ctx, canvas, paddle, keys);
				if (WallCollision(ballObj, canvas, paddle) == 1)
					console.log(' tu as marque');
				
				
				
					// if (ballObj.y - ballObj.rad > 0)
			}
			// console.log("frame");
			animationFrameId = requestAnimationFrame(render);

		}
		render();
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			// window.removeEventListener('keydown', handleKeyDown);
			cancelAnimationFrame(animationFrameId);
		}
	}, [keys])


	return <canvas id="canvas_pong" ref={canvasRef} height={500} width="800px" />
}