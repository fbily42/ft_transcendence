import OtpModal from '@/components/TwoFA/OtpModal'
import axios from 'axios'
import { error } from 'console'
import React, { useEffect, useState } from 'react'
import {
    useLocation,
    useNavigate,
    useParams,
    useBeforeUnload,
} from 'react-router-dom'

type uuidData = {
    uuid: string | undefined
}

function TwoFA(): JSX.Element {
    let { id } = useParams<string>()
    const navigate = useNavigate()
    const location = useLocation()
    const [open2FA, setOpen2FA] = useState<boolean>(false)

    const data: uuidData = {
        uuid: id,
    }

    const removeRequest = () => {
        const response = axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/otp/removeUuid`,
            data,
            { withCredentials: true }
        )
    }

    useBeforeUnload(
        React.useCallback(() => {
            removeRequest()
        }, [location.pathname])
    )

    useEffect(() => {
        async function checkRequest() {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/otp/uuidExists/${id}`,
                    { withCredentials: true }
                )

                const navigationEntries: PerformanceEntryList =
                    window.performance.getEntriesByType('navigation')
                if (
                    navigationEntries.length > 0 &&
                    navigationEntries[0].type !== 'navigate'
                ) {
                    throw new Error()
                }
                setOpen2FA(true)
            } catch (error) {
                navigate('/auth')
            }
        }

        checkRequest()

        return removeRequest
    }, [location.pathname])

    const onOtpModalClose = () => {
        setOpen2FA(false)
        navigate('/auth')
    }

    return (
        <div className="z-20">
            <OtpModal
                open={open2FA}
                onClose={onOtpModalClose}
                uuid={id!}
            ></OtpModal>
        </div>
    )
}

export default TwoFA
