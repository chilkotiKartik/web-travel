import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-green-500 text-navy-950 hover:bg-green-600 focus-visible:outline-green-600',
  dark: 'bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900',
  outline: 'border border-white/40 text-white hover:bg-white/10 focus-visible:outline-white',
  'outline-dark': 'border border-navy-900/25 text-navy-900 hover:bg-navy-900/5 focus-visible:outline-navy-900',
  ghost: 'text-navy-900 hover:bg-navy-900/5 focus-visible:outline-navy-900',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
}

/** Polymorphic button: renders <Link> for `to`, <a> for `href`, else <button>. */
export const Button = forwardRef(function Button(
  { as, to, href, variant = 'primary', size = 'md', className = '', children, ...rest },
  ref
) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`

  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  const Component = as || 'button'
  return (
    <Component ref={ref} className={cls} {...rest}>
      {children}
    </Component>
  )
})
