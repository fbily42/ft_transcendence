import filet from './../../../assets/Game/filet.svg'

export default function Static_image(ctx: CanvasRenderingContext2D,canvas: HTMLCanvasElement,  img_filet: HTMLImageElement, img_ice: HTMLImageElement, img_ice_bottom: HTMLImageElement)
{
	// img_filet.onload = function (){
	// 	requestAnimationFrame(render);
	// };
	ctx.drawImage(img_filet, canvas.width / 2, 0, img_filet.width, canvas.height);
	ctx.drawImage(img_ice, 0, 0, canvas.width, (canvas.height * 5/100) );
	ctx.drawImage(img_ice_bottom, 0, (canvas.height * 95/100), canvas.width, (canvas.height * 5/100) );

	img_filet.src = filet;
}