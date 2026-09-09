import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function FloatingContact() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (pathname === '/contact') return null

  return (
    <motion.button
      type="button"
      onClick={() => navigate('/contact')}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contact us"
      className="fixed bottom-6 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] sm:bottom-8 sm:right-8"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.34A10 10 0 1 0 12 2Zm0 2a8 8 0 0 1 6.9 12.05l-.28.47.86 3.15-3.24-.84-.47.27A8 8 0 1 1 12 4Zm-3.3 3.9c-.2 0-.5.06-.77.36-.26.3-1 1-1 2.4s1.03 2.77 1.18 2.96c.14.19 2 3.16 5 4.3 2.47.95 2.97.77 3.5.72.54-.05 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34-.28-.14-1.72-.85-1.98-.95-.27-.1-.46-.14-.65.14-.19.28-.75.94-.92 1.14-.17.19-.34.21-.62.07-.28-.14-1.19-.44-2.27-1.4-.84-.75-1.4-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.65-1.6-.9-2.18-.24-.57-.48-.49-.65-.5h-.55Z" />
      </svg>
    </motion.button>
  )
}
