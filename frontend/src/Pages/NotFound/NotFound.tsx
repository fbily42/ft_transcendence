import Snow from '@/components/Auth/Snow'
import PinguEpisode from '../../assets/other/Pingu_EpisodeExtract.mp4'

function NotFound(): JSX.Element {
    return (
        <div className="h-[100vh] w-full bg-black">
            <Snow />

            <div className="flex flex-col h-full items-center justify-center p-[36px]">
                <div className="flex flex-col justify-center items-center z-10 text-customBlue">
                    <p className="text-9xl font-bold">404</p>
                    <p className="text-5xl font-semibold">Not found</p>
                </div>
                <div className="z-10 h-full">
                    <video
                        muted={true}
                        autoPlay={true}
                        loop={true}
                        controls={false}
                        width="900"
                    >
                        <source src={PinguEpisode} type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    )
}

export default NotFound
