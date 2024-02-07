import { BallMovement, WallCollision , Paddle_Collision, Paddle_hit} from "@/components/Pong/Game utils/Ballmovement";
import { Paddle_1, Paddle_2 } from "@/components/Pong/Game utils/Paddle";
// import Paddle_2 from "@/components/Pong/Game utils/Paddle";
import data from "@/components/Pong/Game utils/data";
import React, { useEffect, useRef, useState } from "react";
import fish from './../../assets/fish.svg'
import filet from './../../assets/filet.svg'
import grey from './../../assets/grey.svg'
import pingu from './../../assets/pingu.svg'
import Static_image from "@/components/Pong/Game utils/design";

export default function Board(){
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);
	const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

	
	useEffect(() => {
		let {ballObj, paddle_1,paddle_2, Game_stat}= data;
		// imgRef.current = new Image(); //possible besoin d'ajouter un if (imgRef) comme pour canvas
		
		
		const handleKeyDown = (event: KeyboardEvent) => {
			if (keys[event.key]) {
				return;
			}
			setKeys(prevKeys => ({ ...prevKeys, [event.key]: true }));
		};
		
		const handleKeyUp = (event: KeyboardEvent) => {
			setKeys(prevKeys => ({ ...prevKeys, [event.key]: false }));
		};
		window.addEventListener('keydown', handleKeyDown);
		
		window.addEventListener('keyup', handleKeyUp);
		let animationFrameId: number;
		const img_fish = new Image();
		const img_filet = new Image();
		const img_grey = new Image();
		const img_pingu = new Image();
		
		const render = () => {
			const canvas = canvasRef.current;
			if (canvas)
			{
					paddle_2.x = canvas?.width - 70;
					const ctx =  canvas.getContext("2d")
					if (!ctx)
					return;
				
				if (Game_stat.Gamestate === 'playing')
				{
					img_fish.src = fish;
					img_filet.src = filet;
					img_grey.src = grey;
					img_pingu.src = pingu;
					
					// if (img_fishRef.current)
					// 	ctx.drawImage(img_fishRef.current, ballObj.x, ballObj.y, 10, 10);
					ctx?.clearRect(0, 0, canvas.width, canvas.height);
					Static_image(ctx, canvas, img_filet);
					BallMovement(ctx, ballObj,img_fish);
	
					Paddle_1(ctx, canvas, paddle_1, keys, img_pingu);
					Paddle_2(ctx, canvas, paddle_2, keys, img_grey);
					if (WallCollision(ballObj, canvas, ctx, Game_stat) == 1)
						console.log(' tu as marque');
					Paddle_Collision(ballObj, paddle_1);
					Paddle_Collision(ballObj, paddle_2);
				}
				
				
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
	}, )


	return (
	<div>
		<canvas id="canvas_pong" ref={canvasRef} height={1000} width="1600px" />
	</div> );
		
}