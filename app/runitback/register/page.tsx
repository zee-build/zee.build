import type { Metadata } from 'next'
import RegisterForm from '@/components/runitback/RegisterForm'

export const metadata: Metadata = {
  title: 'Run It Back — Create Account',
  description: 'Create an account to claim your player card.',
}

export default function RegisterPage() {
  return (
    <div className="rib-page flex items-center justify-center min-h-[70vh]">
      <RegisterForm />
    </div>
  )
}
