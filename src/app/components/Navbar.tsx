'use client';

import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useState } from 'react';
import ThemeProviderComponent from './ThemeProviderComponent';
import { Menu, X, PenSquare, BarChart3, Keyboard } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          href="/" 
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          BlogNest
        </Link>

        <ul className="hidden md:flex list-none items-center space-x-8 text-sm font-medium">
          <SignedIn>
            <li>
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link 
                href="/articles" 
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Articles
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link 
                href="/bookmarks" 
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Bookmarks
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link 
                href="/analytics" 
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <ThemeProviderComponent/>
            </li>
          </SignedIn>
        </ul>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <SignedIn>
            <button
              onClick={() => {
                if ((window as any).openCommandPalette) {
                  (window as any).openCommandPalette();
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors text-xs text-muted-foreground hover:text-foreground"
              title="Open command palette (⌘K)"
            >
              <Keyboard className="h-3.5 w-3.5" />
              <kbd className="hidden md:inline-flex items-center gap-1">
                <span className="text-[10px]">⌘</span>
                <span>K</span>
              </kbd>
            </button>
          </SignedIn>
          <SignedIn>
            <Link href="/create-article">
              <Button className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                <PenSquare className="h-4 w-4" />
                Write
              </Button>
              <Button size="icon" className="sm:hidden">
                <PenSquare className="h-4 w-4" />
              </Button>
            </Link>

            <div className="hidden sm:block">
              <SignOutButton>
                <Button variant="outline" className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  Logout
                </Button>
              </SignOutButton>
            </div>

            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9"
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" className="hidden sm:block">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                Sign Up
              </Button>
            </Link>
          </SignedOut>

          {/* Mobile menu button */}
          <SignedIn>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </SignedIn>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-slide-in">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/articles" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Articles
            </Link>
            <Link 
              href="/bookmarks" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Bookmarks
            </Link>
            <Link 
              href="/analytics" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Analytics
            </Link>
            <div className="pt-2 border-t border-border">
              <ThemeProviderComponent/>
            </div>
            <div className="pt-2">
              <SignOutButton>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logout
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
