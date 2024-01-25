import { getChannels } from '@/lib/Chat/chat.requests'
import { useQuery } from '@tanstack/react-query'

function Groups() {
    const { data: channels } = useQuery({
        queryKey: ['channels'],
        queryFn: getChannels,
    })

    return (
        <div className="ml-4">
            <h1>Groups</h1>
            {channels?.map((channel, index) => (
                <div key={index}>{channel.name}</div>
            ))}
        </div>
    )
}

export default Groups
