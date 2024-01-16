import React from 'react'

type propTypes = {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<propTypes> = ({open, onClose, children}) => {
  return (
	<div
		className={`fixed inset-0 flex justify-center items-center transition-colors
		${open ? "visible bg-black/20" : "invisible"}`}
		onClick={onClose}>
		<div
			className={`bg-white roundd-lg shadow p-6 transition-all max-w-md
			${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
			onClick={(e) => e.stopPropagation()}>
			<button className='absolute top-2 right-2 py-1 px-2 border berder-neutral-200 rounded-md' onClick={onClose}>X</button>
			{children}
		</div>
	</div>
  )
}

export default Modal

// https://www.youtube.com/watch?v=1CN7C6u31zA