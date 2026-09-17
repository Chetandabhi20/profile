import { useState, useEffect } from 'react'

/**
 * Toast notification component.
 * @param {{ message: string, type: 'success'|'error', onClose: () => void }} props
 */
function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // wait for fade-out animation
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast--${type}${visible ? '' : ' toast--exit'}`}>
      <span className="toast__icon">
        {type === 'success' ? '[✔]' : '[✘]'}
      </span>
      <span className="toast__msg">{message}</span>
    </div>
  )
}

export default Toast
