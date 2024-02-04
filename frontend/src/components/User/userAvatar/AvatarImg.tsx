import {
    Pingu,
    Pinga,
    Mama,
    Papa,
    Pingi,
    Robby,
    Photo42,
} from '@/assets/avatarAssociation'
import { Button } from '@/components/ui/button'

type ImageSelectorProps = {
    onSelect: (selectedImage: string) => void
}

const AvatarImg: React.FC<ImageSelectorProps> = ({ onSelect }) => {
    const images: {
        id: number
        imageProfile: string
        imageBackground: string | undefined
    }[] = [Pingu(), Pinga(), Mama(), Papa(), Pingi(), Robby(), Photo42()]

    const handleImageClick = (image: string) => {
        onSelect(image)
    }

    return (
        <div className="flex">
            {images.map((image) => (
                <div className="bg-[#C1E2F7] flex items-center w-[70px] h-[70px] border-[3px] border-customYellow rounded-full overflow-hidden">
                    <Button
                        onClick={() =>
                            handleImageClick(image.imageBackground || '')
                        }
                        key={image.id}
                        id="boxe"
                        className="w-full h-full bg-center bg-no-repeat bg-[#C1E2F7]"
                        style={{
                            backgroundImage: `url(${image.imageProfile})`,
                            backgroundSize: 'cover',
                        }}
                    ></Button>
                </div>
            ))}
        </div>
    )
}

export default AvatarImg
