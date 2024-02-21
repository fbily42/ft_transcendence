import axios from "axios"
import { Dispatch, SetStateAction } from "react"


export async function setProfileFn(
	pseudo: string,
	avatar: string,
	file: File | null,
	setErrorMessage: Dispatch<SetStateAction<string>>,
	onClose: () => void
) : Promise<void> {
	try {
		const formData = new FormData()

            if (file) formData.append('file', file)
            else {
                formData.append('avatar', avatar)
            }
            formData.append('pseudo', pseudo)

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/uploads`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            )
		onClose()
	}
	catch(error: any) {
		setErrorMessage(error.response.data.message)
		throw error
	}
}