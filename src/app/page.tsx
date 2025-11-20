"use client"
import { Button } from '@/components/ui/button'
import { useSession } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect } from 'react'
import RecentArtciles from './components/RecentArtciles'
import Footer from './components/Footer'
import TrendingArticles from './components/TrendingArticles'
import { ArrowRight, Sparkles, BookOpen, Users, TrendingUp } from 'lucide-react'

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
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 sm:mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Welcome to BlogNest
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight px-2">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Discover. Write.
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Share. Inspire.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            A modern blog platform where developers express their thoughts, explore new ideas, 
            and connect with a vibrant community of creators and innovators.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
            <Link href={`${isSignedIn ? "/articles" : "/sign-in"}`} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/articles" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full border-2 hover:bg-muted transition-all"
              >
                Explore Articles
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mt-12 sm:mt-16 px-4">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all card-hover">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">100+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Articles Published</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all card-hover">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">500+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Writers</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all card-hover">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentArtciles />
          </div>
          <div className="lg:col-span-1">
            <TrendingArticles />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home