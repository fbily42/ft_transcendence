import { imageForGame } from '@/lib/Game/Game.types'
import filet from './../../../assets/Game/filet.svg'

export default function Static_image(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    gameImages: imageForGame,
) {
    // img_filet.onload = function (){
    // 	requestAnimationFrame(render);
    // };

    if (gameImages.image.img_filet.complete) {
        ctx.drawImage(
            gameImages.image.img_filet,
            canvas.width / 2,
            0,
            gameImages.image.img_filet.width / 2,
            canvas.height
        )
    } else {
        gameImages.image.img_filet.onload = function () {
            ctx.drawImage(
                gameImages.image.img_filet,
                canvas.width / 2,
                0,
                gameImages.image.img_filet.width / 2,
                canvas.height
            )
        }
    }
    if (gameImages.image.img_ice.complete) {
        ctx.drawImage(
            gameImages.image.img_ice,
            0,
            0,
            canvas.width,
            (canvas.height * 5) / 100
        )
    } else {
        gameImages.image.img_ice.onload = function () {
            ctx.drawImage(
                gameImages.image.img_ice,
                0,
                0,
                canvas.width,
                (canvas.height * 5) / 100
            )
        }
    }

    if (gameImages.image.img_ice_bottom.complete) {
        ctx.drawImage(
            gameImages.image.img_ice_bottom,
            0,
            (canvas.height * 95) / 100,
            canvas.width,
            (canvas.height * 5) / 100
        )
    } else {
        gameImages.image.img_ice_bottom.onload = function () {
            ctx.drawImage(
                gameImages.image.img_ice_bottom,
                0,
                (canvas.height * 95) / 100,
                canvas.width,
                (canvas.height * 5) / 100
            )
        }
    }
}

export function decoration(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
) {
    ctx.beginPath() // Commence un nouveau chemin
    ctx.lineWidth = 5
    ctx.moveTo(canvas.width / 2, 0) // Déplace le point de départ du nouveau chemin aux coordonnées (50, 50)
    ctx.lineTo(canvas.width / 2, canvas.height) // Ajoute une ligne au chemin aux coordonnées (200, 200)
    ctx.strokeStyle = 'black' // Définit la couleur de la ligne comme blanche
    ctx.stroke()
}
