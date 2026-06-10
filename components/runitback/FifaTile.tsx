import Link from 'next/link'

interface FifaTileProps {
  href: string
  variant?: 'standard' | 'featured'
  className?: string
  admin?: boolean
  children: React.ReactNode
}

export default function FifaTile({ href, variant = 'standard', className = '', admin = false, children }: FifaTileProps) {
  if (variant === 'featured') {
    return (
      <Link href={href} className={`rib-hero-tile ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`rib-menu-tile ${admin ? 'rib-menu-tile--admin' : ''} ${className}`}
    >
      {children}
    </Link>
  )
}
