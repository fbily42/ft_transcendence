import { Button } from '@/components/ui/button';
import React from 'react'

type propTypes = {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export const Modal: React.FC<propTypes> = ({open, onClose, children}) => {

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


export const ModalGame: React.FC<propTypes> = ({open, onClose, children}) => {

	if (!open)
		return null;
  return (
	<div
		className={' fixed inset-0 flex justify-center items-center transition-colors z-50 bg-inherit backdrop-blur-md z-50'}
		onClick={onClose}>
		<div
			className={'border-2 border-black rounded-xl bg-white roundd-lg shadow p-4 transition-all max-w-md border rounded-md z-50'}
			onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	</div>
  )
}

export default Modal;
// https://www.youtube.com/watch?v=1CN7C6u31zA
