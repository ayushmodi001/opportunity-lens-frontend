import React from 'react'
import Quizpage from '@/components/quizpage'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
export default async function page() {
  const session = await auth()
  if (!session?.user) {
    redirect('/unauthorized')
  }
  return (
    <>
        <Quizpage/>
    </>
  )
}
