'use client';

import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import ThemeProviderComponent from './ThemeProviderComponent';

const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-zinc-900 shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        <Link href="/" className="text-2xl font-bold text-primary">
          BlogNest
        </Link>


        <ul className="hidden md:flex list-none space-x-6 text-md font-medium text-gray-600 dark:text-gray-200">
          <SignedIn>
            <li className="cursor-pointer hover:text-primary transition">
              <Link href="/">Home</Link>
            </li>
            <li className="cursor-pointer hover:text-primary transition">
              <Link href="/articles">Articles</Link>
            </li>
             <li className="cursor-pointer hover:text-primary transition">
              <Link href="/bookmarks"> Bookmarks</Link>
            </li>
            <ThemeProviderComponent/>
          </SignedIn>
        </ul>


        <div className="flex items-center space-x-3">
          <SignedIn>
            <Link href="/create-article">
              <Button>Write</Button>
            </Link>

            <SignOutButton>
              <Button>
                Logout
              </Button>
            </SignOutButton>

            <UserButton />
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
