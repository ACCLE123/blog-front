import { Suspense } from 'react'
import CreatePostClient from './CreatePostClient'

export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CreatePostClient />
    </Suspense>
  )
}