import { PaddleObj } from "./data";

// let paddle: PaddleObj;
export default function Paddle(ctx: CanvasRenderingContext2D , canvas: HTMLCanvasElement, paddle: PaddleObj, keys: {[key:string]: boolean}) {
	
	// if (!paddle)
	// paddle = {
	// 	x: 10,
	// 	y: 20,
	// 	height : 20,
	// 	width : 30,
	// 	color : '#FFA62b',

	// }
	if (keys['ArrowLeft'] || keys['a']) {
		if ((paddle.y - 10) > 0 )
			paddle.y -= 10;
		}
	if (keys['ArrowRight'] || keys['d']) {
		if ((paddle.y + 10 + 60) < canvas.height )
		{
			console.log('height paddle', paddle.y);
			console.log('canvas height', canvas.height);
			paddle.y += 10;
		}
	}

	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.fillStyle = paddle.color;
	ctx.strokeStyle = paddle.color;
	ctx.lineWidth = 1;
	ctx.fillStyle = paddle.color;
	ctx.shadowBlur = 0;
	ctx.shadowColor = "blue";
	ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.fill();


}