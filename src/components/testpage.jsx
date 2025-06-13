import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function TestPage() {
    const session = await auth()
    if(!session?.user) redirect("/unauthorized")
  return (
    <div>Hello Test Page</div>
  )
}
