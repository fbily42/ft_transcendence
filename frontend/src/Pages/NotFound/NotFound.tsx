import Snow from '@/components/Auth/Snow'
import PinguEpisode from '../../assets/other/Pingu_EpisodeExtract.mp4'

function NotFound(): JSX.Element {
    return (
        <div className="h-[100vh] w-full">
            <Snow />

            <div className="flex flex-col h-[100vh] items-center justify-center bg-pink-300 p-[36px]">
                <div className="flex flex-col justify-center items-center z-10">
                    <p className="text-9xl font-bold">404</p>
                    <p className="text-5xl font-semibold">Not found</p>
                </div>
                <div className="z-10">
                    <video
                        muted={true}
                        autoPlay={true}
                        loop={true}
                        controls={false}
                        height={200}
                    >
                        <source src={PinguEpisode} type="video/mp4" />
                    </video>
                </div>
            </div>
        </div>
    )
}

export default NotFound
