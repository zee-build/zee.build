import type { Metadata } from 'next'
import LinkCardGrid from '@/components/runitback/LinkCardGrid'

export const metadata: Metadata = {
  title: 'Run It Back — Link Your Card',
  description: 'Claim your player card to finish setting up your account.',
}

export default function LinkCardPage() {
  return (
    <div className="rib-page min-h-[70vh] py-8">
      <LinkCardGrid />
    </div>
  )
}
