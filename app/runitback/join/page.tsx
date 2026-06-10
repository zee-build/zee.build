import type { Metadata } from 'next'
import JoinForm from '@/components/runitback/JoinForm'

export const metadata: Metadata = {
  title: 'Run It Back — Join the Squad',
  description: 'Register yourself for Friday & Tuesday five-a-side games at Muweilah.',
}

export default function JoinPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <JoinForm />
    </div>
  )
}
