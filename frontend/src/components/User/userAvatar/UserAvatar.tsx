import AvatarBg from '../../../assets/avatar-assets/background.svg'

export default function UserAvatar() {
    return (
        <div>
            <div className="relative">
                {/* <img src={NameBg} alt="Avatar Background" className='absolute top-0'/> */}
                <img src={AvatarBg} alt="Avatar Background" className='object-cover'/>
            </div>
        </div>
    )
}
