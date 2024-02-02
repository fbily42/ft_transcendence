import { BallObj } from "./data";



export function BallMovement(ctx: CanvasRenderingContext2D, ballObj: BallObj) {
	// let data = new Ball(ballObj.x, ballObj.y, ballObj.rad);
	// data.draw(ctx);
	ctx.beginPath();
	ctx.arc(ballObj.x, ballObj.y , ballObj.rad, 0, 2 * Math.PI);
	ctx.fillStyle = "red";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx?.fill();
	ctx.stroke();
	
	ballObj.x += ballObj.dx;
	ballObj.y += ballObj.dy;

}
// class Ball{
// 	constructor(x, y, rad) {
// 		this.x = x;
// 		this.y = y;
// 		this.rad = rad;
// 	}
// 	draw(ctx) {
// 		ctx.beginPath();
// 		ctx.arc(this.x, this.y , this.rad, 0, 2 * Math.PI);
// 		ctx.fillStyle = "red";
// 		ctx.strokeStyle = "black";
// 		ctx.lineWidth = 1;
// 		ctx?.fill();
// 		ctx.stroke();
// 	}
// }

export function WallCollision(ballObj: BallObj, canvas: HTMLCanvasElement)
{
	if (ballObj.y - ballObj.rad <= 0 || ballObj.y + ballObj.rad >= canvas.height)
		ballObj.dy *= -1;
	if(ballObj.x - ballObj.rad <= 0 || ballObj.x + ballObj.rad >= canvas.width)
		ballObj.dx *= -1
}