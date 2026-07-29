import type { Metadata } from 'next'
import ForgotPasswordForm from '@/components/runitback/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Run It Back — Forgot Password',
  description: 'Request a password reset for your player account.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="rib-page flex items-center justify-center min-h-[70vh]">
      <ForgotPasswordForm />
    </div>
  )
}
