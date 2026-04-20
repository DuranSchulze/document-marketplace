import { Suspense } from 'react'
import { FailedPageContent } from './FailedPageContent'

export default function FailedPage() {
  return (
    <Suspense>
      <FailedPageContent />
    </Suspense>
  )
}
