import type { Metadata } from 'next'
import LoginForm from '@/components/runitback/LoginForm'

export const metadata: Metadata = {
  title: 'Run It Back — Sign In',
  description: 'Sign in to manage your player profile.',
}

export default function LoginPage() {
  return (
    <div className="rib-page flex items-center justify-center min-h-[70vh]">
      <LoginForm />
    </div>
  )
}
