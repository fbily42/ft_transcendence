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
		className={'bg-black/50 backdrop-blur-sm fixed inset-0 flex justify-center items-center transition-colors'}
		onClick={onClose}>
		<div
			className={'bg-white roundd-lg shadow p-4 transition-all max-w-md rounded-md'}
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
		className={' bg-black/50 backdrop-blur-sm fixed inset-0 flex justify-center items-center transition-colors'}
		onClick={onClose}>
		<div
			className={'bg-white roundd-lg shadow p-4 transition-all max-w-md border rounded-md'}
			onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	</div>
  )
}

export default Modal;
