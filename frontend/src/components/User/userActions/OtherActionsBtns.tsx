import { Button } from '@/components/ui/button'
import { addNewFriend, removeFriend } from '@/lib/Dashboard/dashboard.requests'
import { useParams } from 'react-router-dom'

export default function OtherActionsBtns() {
    const param = useParams()

    return (
        <div>
            <Button onClick={() => addNewFriend(param.id!)}>Add Friend</Button>
            <Button
                variant={'destructive'}
                onClick={() => removeFriend(param.id!)}
            >
                Remove Friend
            </Button>
        </div>
    )
}
