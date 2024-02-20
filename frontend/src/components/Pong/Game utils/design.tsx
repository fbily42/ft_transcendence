import { imageForGame } from '@/lib/Game/Game.types'
import filet from './../../../assets/Game/filet.svg'

export default function Static_image(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gameImages: imageForGame
) {
    // img_filet.onload = function (){
    // 	requestAnimationFrame(render);
    // };
    ctx.drawImage(
        gameImages.image.img_filet,
        canvas.width / 2,
        0,
        gameImages.image.img_filet.width,
        canvas.height
    )
    ctx.drawImage(
        gameImages.image.img_ice,
        0,
        0,
        canvas.width,
        (canvas.height * 5) / 100
    )
    ctx.drawImage(
        gameImages.image.img_ice_bottom,
        0,
        (canvas.height * 95) / 100,
        canvas.width,
        (canvas.height * 5) / 100
    )

    gameImages.image.img_filet.src = filet
}
