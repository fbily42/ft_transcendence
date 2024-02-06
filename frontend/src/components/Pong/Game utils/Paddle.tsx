import { PaddleObj } from "./data";

// let paddle: PaddleObj;
export  function Paddle_2(ctx: CanvasRenderingContext2D , canvas: HTMLCanvasElement,  paddle_2: PaddleObj, keys: {[key:string]: boolean}) {
	
	// if (!paddle)
	// paddle = {
	// 	x: 10,
	// 	y: 20,
	// 	height : 20,
	// 	width : 30,
	// 	color : '#FFA62b',

	// }

	if (keys['ArrowLeft']) {
		if ((paddle_2.y - 10) > 0 )
			paddle_2.y -= 10;
		}
	if (keys['ArrowRight']) {
		if ((paddle_2.y + 10 + 60) < canvas.height )
		{
			paddle_2.y += 10;
		}
	}

	ctx.beginPath();
	ctx.rect(paddle_2.x, paddle_2.y, paddle_2.width, paddle_2.height);
	ctx.fillStyle = paddle_2.color;
	ctx.strokeStyle = paddle_2.color;
	ctx.lineWidth = 1;
	ctx.fillStyle = paddle_2.color;
	ctx.shadowBlur = 0;
	ctx.shadowColor = "blue";
	ctx.strokeRect(paddle_2.x, paddle_2.y, paddle_2.width, paddle_2.height);
	ctx.fill();


}

export function Paddle_1(ctx: CanvasRenderingContext2D , canvas: HTMLCanvasElement, paddle_1: PaddleObj, keys: {[key:string]: boolean}) {
	
	// if (!paddle)
	// paddle = {
	// 	x: 10,
	// 	y: 20,
	// 	height : 20,
	// 	width : 30,
	// 	color : '#FFA62b',

	// }
	console.log('ici');
	if (keys['a']) {
		if ((paddle_1.y - 10) > 0 )
			paddle_1.y -= 10;
		}

	if (keys['d']) {
		if ((paddle_1.y + 10 + 60) < canvas.height )
		{
			paddle_1.y += 10;
		}
	}

	ctx.beginPath();
	ctx.rect(paddle_1.x, paddle_1.y, paddle_1.width, paddle_1.height);
	ctx.fillStyle = paddle_1.color;
	ctx.strokeStyle = paddle_1.color;
	ctx.lineWidth = 1;
	ctx.fillStyle = paddle_1.color;
	ctx.shadowBlur = 0;
	ctx.shadowColor = "blue";
	ctx.strokeRect(paddle_1.x, paddle_1.y, paddle_1.width, paddle_1.height);
	ctx.fill();


}