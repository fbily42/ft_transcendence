import { BallMovement, WallCollision , Paddle_Collision, Paddle_hit} from "@/components/Pong/Game utils/Ballmovement";
import { Paddle_1, Paddle_2 } from "@/components/Pong/Game utils/Paddle";
// import Paddle_2 from "@/components/Pong/Game utils/Paddle";
import data from "@/components/Pong/Game utils/data";
import React, { useEffect, useRef, useState } from "react";

export default function Board(){
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

	
	useEffect(() => {
		let {ballObj, paddle_1,paddle_2, Game_stat}= data;

		const handleKeyDown = (event: KeyboardEvent) => {
			setKeys(prevKeys => ({ ...prevKeys, [event.key]: true }));
		  };
		
		  const handleKeyUp = (event: KeyboardEvent) => {
			setKeys(prevKeys => ({ ...prevKeys, [event.key]: false }));
		  };
		  window.addEventListener('keydown', handleKeyDown);
		  
		  window.addEventListener('keyup', handleKeyUp);
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

				Paddle_1(ctx, canvas, paddle_1, keys);
				Paddle_2(ctx, canvas, paddle_2, keys);
				if (WallCollision(ballObj, canvas, ctx, Game_stat) == 1)
					console.log(' tu as marque');
				Paddle_Collision(ballObj, paddle_1);
				Paddle_Collision(ballObj, paddle_2);
				
				
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


	return (
	<div>
		<canvas id="canvas_pong" ref={canvasRef} height={1000} width="1600px" />
	</div> );
		
}