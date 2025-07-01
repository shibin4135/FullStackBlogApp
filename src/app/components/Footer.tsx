import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600 dark:text-gray-300">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">BlogNest</h2>
          <p>Your home for ideas, stories, and insights from developers.</p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-2">Explore</h3>
          <ul className="space-y-1">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/articles" className="hover:text-primary">Articles</Link></li>
            <li><Link href="/tags" className="hover:text-primary">Tags</Link></li>
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="space-y-1">
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li><a href="#" target="_blank" className="hover:text-primary">GitHub</a></li>
            <li><a href="#" target="_blank" className="hover:text-primary">Twitter</a></li>
            <li><a href="#" target="_blank" className="hover:text-primary">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-400 border-t dark:border-zinc-700">
        © {new Date().getFullYear()} BlogNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
