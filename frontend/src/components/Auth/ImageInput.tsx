import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ChangeEvent, useRef } from 'react'

type ImageInputprops = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    size: number
}

const ImageInput: React.FC<ImageInputprops> = ({ onChange, size }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    return (
        <div>
            <Input
                type="file"
                accept="image/svg+xml"
                onChange={onChange}
                hidden
                ref={fileInputRef}
                className="hidden"
            />
            <Button
                type="button"
                className={
                    'rounded-full bg-customYellow' +
                    ` w-[${size}px]` +
                    ` h-[${size}px]`
                }
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault()
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                        fileInputRef.current.click()
                    }
                }}
            >
                <div className="text-white ">
                    <Plus
                        className={` w-[${size / 2}px]` + ` h-[${size / 2}px]`}
                    />
                </div>
            </Button>
        </div>
    )
}

export default ImageInput
