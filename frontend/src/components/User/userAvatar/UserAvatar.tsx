import AvatarBg from '../../../assets/avatar-assets/background.svg'

export default function UserAvatar({isMobile}) {
    return (
        <div>
            <div className={`relative ${isMobile ? 'w-full h-full' : 'w-full h-full'}`}>
                {/* <img src={NameBg} alt="Avatar Background" className='absolute top-0'/> */}
                <img src={AvatarBg} alt="Avatar Background" className={`object-cover w-full h-full`}/>
            </div>
        </div>
    )
}
