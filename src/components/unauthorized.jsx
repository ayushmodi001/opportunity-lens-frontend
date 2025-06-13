import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Unauthorized() {
return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center ">
        <h1 className="text-4xl font-bold text-red-600 mb-4">🚫 Whoa there, friend! 🚫</h1>
        <div className="mb-6">
            <p className="text-xl mb-2">You've wandered into a restricted area.</p>
            <p className="text-lg mb-4">It's like trying to pet a lion without permission - technically possible, but not recommended!</p>
            <p className="font-semibold text-gray-700">Please log in with proper credentials before proceeding.</p>
        </div>
        <div className="w-64 h-64 mb-6 relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-50"></div>
            <div className="relative flex items-center justify-center w-full h-full">
                <span className="text-8xl">🔒</span>
            </div>
        </div>
        <Link href="/login">
            <Button className="animate-bounce mt-4" variant="outline">
                Escape to Safety
            </Button>
        </Link>
    </div>
)
}
