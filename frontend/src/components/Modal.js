import React from 'react'
import './Modal.css'

const Modal = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  )
}

export default Modal
