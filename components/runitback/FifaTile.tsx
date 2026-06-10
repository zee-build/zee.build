import Link from 'next/link'

interface FifaTileProps {
  href: string
  variant?: 'standard' | 'featured'
  className?: string
  children: React.ReactNode
}

export default function FifaTile({ href, variant = 'standard', className = '', children }: FifaTileProps) {
  return (
    <Link
      href={href}
      className={`rib-tile relative block overflow-hidden rounded-lg p-5 group ${
        variant === 'featured' ? 'md:row-span-2 min-h-[320px] md:min-h-[440px]' : 'min-h-[180px]'
      } ${className}`}
    >
      {children}
    </Link>
  )
}
