import filet from './../../../assets/filet.svg'

export default function Static_image(ctx: CanvasRenderingContext2D,canvas: HTMLCanvasElement,  img_filet: HTMLImageElement)
{
	// img_filet.onload = function (){
	// 	requestAnimationFrame(render);
	// };
	ctx.drawImage(img_filet, canvas.width / 2, 0, img_filet.width, canvas.height);
	img_filet.src = filet;
}