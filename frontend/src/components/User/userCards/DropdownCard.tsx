import { Button } from '@/components/ui/button'
import { Sailboat } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type DropdownCardProps = {
    variant?: 'FRIEND' | 'OTHER'
    id: string
}

const DropdownCard: React.FC<DropdownCardProps> = ({ id }) => {
    const navigate = useNavigate()

    return (
        <Button
            onClick={() => {
                navigate(`/profile/${id}`)
            }}
            variant={'ghost'}
            size={'smIcon'}
        >
            <Sailboat size={'16px'} />
        </Button>
    )
}

export default DropdownCard
