import { PaddleObj } from "./data";

let paddle: PaddleObj;
export default function Paddle(ctx: CanvasRenderingContext2D , canvas: HTMLCanvasElement) {
	
	if (!paddle)
	paddle = {
		x: 10,
		y: 20,
		height : 20,
		width : 30,
		color : '#FFA62b',

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