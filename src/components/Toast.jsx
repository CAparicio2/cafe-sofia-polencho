import { useCafe } from '../context/CafeContext.jsx'

export default function Toast() {
  const { toastText } = useCafe()
  return (
    <div className="toast" hidden={!toastText} role="status">
      {toastText}
    </div>
  )
}
