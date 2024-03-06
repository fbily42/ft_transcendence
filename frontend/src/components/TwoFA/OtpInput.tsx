import { SyntheticEvent, forwardRef, useMemo } from 'react'
import { Input } from '../ui/input'

type OtpInputProps = {
    value: string
    valueLength: number
    onChange: (value: string) => void
}

const RE_DIGIT = new RegExp(/^\d+$/)

const OtpInput: React.FC<OtpInputProps> = ({
    value,
    valueLength,
    onChange,
}: OtpInputProps) => {
    const valueItems = useMemo(() => {
        const valueArray = value.split('')
        const items: Array<string> = []

        for (let i = 0; i < valueLength; i++) {
            const char = valueArray[i]

            if (RE_DIGIT.test(char)) {
                items.push(char)
            } else {
                items.push('')
            }
        }

        return items
    }, [value, valueLength])

    const inputOnChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        idx: number
    ) => {
        const target: EventTarget & HTMLInputElement = e.target
        let targetValue: string = target.value
        const isTargetValueDigit: boolean = RE_DIGIT.test(targetValue)

        if (!isTargetValueDigit && targetValue != '') {
            return
        }

        targetValue = isTargetValueDigit ? targetValue : ' '

        const newValue: string =
            value.substring(0, idx) +
            targetValue +
            value.substring(idx + 1, valueLength)

        onChange(newValue.substring(0, valueLength))

        if (!isTargetValueDigit) return

        const nextElemtSibling =
            target.nextElementSibling as HTMLInputElement | null

        if (nextElemtSibling) nextElemtSibling.focus()
    }

    const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement

        target.setSelectionRange(0, target.value.length)

        if (e.key !== 'Backspace' || target.value !== '') {
            return
        }

        const prevElemtSibling =
            target.previousElementSibling as HTMLInputElement | null

        if (prevElemtSibling) {
            prevElemtSibling.focus()
        }
    }

    const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { target } = e

        target.setSelectionRange(0, target.value.length)
    }

    return (
        <div className="flex space-x-2 rtl:space-x-reverse justify-center">
            {valueItems.map((digit, idx) => (
                <Input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{1}"
                    maxLength={valueLength}
                    className="w-9 text-center font-extrabold"
                    value={digit}
                    onChange={(e) => inputOnChange(e, idx)}
                    onKeyDown={inputOnKeyDown}
                    onFocus={inputOnFocus}
                />
            ))}
        </div>
    )
}

export default OtpInput
