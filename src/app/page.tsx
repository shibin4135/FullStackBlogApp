"use client"
import { Button } from '@/components/ui/button'
import { useSession } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect } from 'react'
import RecentArtciles from './components/RecentArtciles'
import Footer from './components/Footer'

const Home = () => {
  const { isSignedIn } = useSession()
  useEffect(() => {
    const createUser = async () => {
      const response = await fetch('/api/create-user', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
      });
      await response.json();
    }
    if (isSignedIn) {
      createUser()

    }
  }, [isSignedIn])

  return (
    <>
      <section className="w-full py-16 bg-gradient-to-r from-blue-50 to-purple-100 dark:from-zinc-800 dark:to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover. Write. Share.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            A modern blog platform to express your thoughts, explore new ideas, and connect with developers.
          </p>
          <Link href={`${isSignedIn ? "/articles" : "/sign-in"}`}>
            <Button className="text-md px-6 py-3 rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
      <RecentArtciles />
      <Footer />
    </>
  )
}

export default Home