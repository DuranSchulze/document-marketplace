import { Suspense } from 'react'
import { SuccessPageContent } from './SuccessPageContent'

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessPageContent />
    </Suspense>
  )
}
