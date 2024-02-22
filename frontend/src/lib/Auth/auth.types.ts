import { Dispatch, SetStateAction } from "react"

export type SetProfileFormprops = {
    submitButtonText: string
    currentAvatar: string
    currentPseudo: string
	onClose: () => void
}

export type ProfileFormProps = {
	pseudo : string
	avatar: string 
	file: File | null
	setErrorMessage: Dispatch<SetStateAction<string>>
	onClose: () => void
}