import Pingu from '../../../assets/empty-state/pingu-face.svg'

export default function AvatarImg() {
    return (
        <div>
            <div className="bg-[#C1E2F7] flex items-center w-[70px] h-[70px] border-[3px] border-customYellow rounded-full overflow-hidden">
                <div
                    className="w-full h-full bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${Pingu})`,
                        backgroundSize: 'cover',
                    }}
                ></div>
            </div>
        </div>
    )
}
