import { Button } from '@/components/ui/button';
import React from 'react'

type propTypes = {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<propTypes> = ({open, onClose, children}) => {

	if (!open)
		return null;
  return (
	<div
		className={'fixed inset-0 flex justify-center items-center transition-colors'}
		onClick={onClose}>
		<div
			className={'bg-white roundd-lg shadow p-4 transition-all max-w-md border rounded-md'}
			onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	</div>
  )
}

export default Modal

// https://www.youtube.com/watch?v=1CN7C6u31zA
