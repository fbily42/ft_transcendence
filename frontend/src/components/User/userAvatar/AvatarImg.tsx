import { Button } from '@/components/ui/button'

import PinguProfile from '../../../assets/empty-state/pingu-face.svg'
import PingaProfile from '../../../assets/avatar-assets/pinga-face.svg'
import MamaProfile from '../../../assets/avatar-assets/mama-face.svg'
import PapaProfile from '../../../assets/avatar-assets/papa-face.svg'
import PingiProfile from '../../../assets/avatar-assets/pingi-face.svg'
import RobbyProfile from '../../../assets/avatar-assets/robby-face.svg'
import { useQuery } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

type ImageSelectorProps = {
    onSelect: (selectedImage: string) => void
}

const AvatarImg: React.FC<ImageSelectorProps> = ({ onSelect }) => {
    const { data } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const images: string[] = [
        PinguProfile,
        PingaProfile,
        MamaProfile,
        PapaProfile,
        PingiProfile,
        RobbyProfile,
        data?.photo42 || '',
    ]

    const handleImageClick = (image: string) => {
        onSelect(image)
    }

    return (
        <div className="flex">
            {images.map((image, idx) => (
                <div
                    key={idx}
                    className="bg-[#C1E2F7] flex items-center w-[70px] h-[70px] border-[3px] border-customYellow rounded-full overflow-hidden"
                >
                    <Button
                        type="button"
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                            e.preventDefault()
                            handleImageClick(image)
                        }}
                        key={idx}
                        id="boxe"
                        className="w-full h-full bg-center bg-no-repeat bg-[#C1E2F7] hover:bg-[#C1E2F7]"
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                        }}
                    ></Button>
                </div>
            ))}
        </div>
    )
}

export default AvatarImg
