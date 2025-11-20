# BlogNest - Full-Stack Blogging Platform

<div align="center">

![BlogNest](https://img.shields.io/badge/BlogNest-Full--Stack-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)

A modern, production-ready full-stack blogging platform built with Next.js 15, React 19, and TypeScript. Features include user authentication, rich text editing, nested comments, real-time interactions, analytics, and much more.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [API Documentation](#-api-documentation)

</div>

---

## Features

###  Authentication & Authorization
- **Clerk Authentication** - Secure user authentication with email/password and social logins
- **Protected Routes** - Middleware-based route protection
- **User Profiles** - Custom user profiles with avatars
- **Role-based Access** - Author verification and permissions

###  Article Management
- **Rich Text Editor** - Jodit WYSIWYG editor with full formatting options
- **Draft System** - Save articles as drafts before publishing
- **Auto-save** - Automatic draft saving to prevent content loss
- **Image Upload** - Cloudinary integration for optimized image hosting
- **Categories & Tags** - Organize content with categories and up to 10 tags per article
- **Article Editing** - Full CRUD operations for articles
- **Reading Time** - Automatic calculation and display of estimated reading time
- **View Tracking** - Track article views for analytics

### Advanced Comment System
- **Nested Comments** - Unlimited depth comment threading
- **Real-time Updates** - See new comments without page refresh
- **Author Information** - Display commenter avatars, names, and timestamps
- **Comment Reactions** - Like, love, and react to comments (schema ready)
- **Edit History** - Track comment edits
- **Responsive Design** - Mobile-friendly comment interface

### Engagement Features
- **Like System** - Like articles with real-time counter updates
- **Bookmark System** - Save articles for later reading
- **Share Functionality** - Share articles on social media with Open Graph support
- **Reading Progress** - Visual progress bar showing reading completion
- **Related Articles** - AI-powered content recommendations based on category and tags

###  Search & Discovery
- **Full-Text Search** - Search across titles, content, and categories
- **Search Highlighting** - Highlight matching terms in search results
- **Category Filtering** - Filter articles by category
- **Tag-based Search** - Find articles by tags
- **Debounced Search** - Optimized search with 300ms debounce

### Analytics Dashboard
- **Overview Statistics** - Total articles, views, likes, and comments
- **Article Performance** - Track individual article metrics
- **Recent Articles** - View performance of recent publications
- **Engagement Metrics** - Detailed analytics for content creators
- **Trending Articles** - Discover trending content based on engagement

###  User Experience
- **Dark/Light Mode** - System-aware theme switching
- **Responsive Design** - Fully responsive across all devices
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Toast Notifications** - User-friendly notification system
- **Pagination** - Efficient content pagination
- **Social Sharing** - Open Graph and Twitter Card support

###  Performance Optimizations
- **Database Indexing** - Optimized queries with strategic indexes
- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Dynamic imports for better performance
- **Server Components** - Leveraging Next.js 15 App Router
- **View Tracking** - Efficient view counting system

### 🔒 Security Features
- **Input Validation** - Zod schema validation for all forms
- **XSS Protection** - HTML sanitization for user-generated content
- **CSRF Protection** - Built-in Next.js CSRF protection
- **Secure File Uploads** - File type and size validation
- **Environment Variables** - Secure configuration management

---

##  Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Jodit React** - Rich text editor
- **react-hot-toast** - Toast notifications
- **date-fns** - Date formatting

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Next.js 15 server actions
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production-ready relational database
- **Zod** - Schema validation

### Services & Integrations
- **Clerk** - Authentication and user management
- **Cloudinary** - Image hosting and optimization
- **Next.js Image** - Optimized image delivery

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Migrate** - Database migrations

---

##  Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Clerk account (for authentication)
- Cloudinary account (for image hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FullStackBlogApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env


   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
     bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   



## 📁 Project Structure

```
FullStackBlogApp/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── analytics/
│   │   │   ├── bookmark-post/
│   │   │   ├── create-comment/
│   │   │   ├── fetch-articles/
│   │   │   ├── fetch-comments/
│   │   │   ├── like-post/
│   │   │   ├── related-articles/
│   │   │   ├── search-article/
│   │   │   └── track-view/
│   │   ├── articles/         # Article pages
│   │   ├── components/       # React components
│   │   ├── create-article/   # Article creation
│   │   ├── analytics/        # Analytics dashboard
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   └── lib/
│       ├── prisma.ts         # Prisma client
│       ├── cloudinary.ts     # Cloudinary config
│       └── utils.ts          # Utility functions
├── actions/
│   └── action.ts             # Server actions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

---


---

##  Key Features Explained

### Reading Progress Indicator
A visual progress bar at the top of article pages that shows reading completion percentage. Updates in real-time as users scroll.

### Full-Text Search
Advanced search functionality that searches across article titles, content, and categories. Includes search term highlighting and filtering options.

### Analytics Dashboard
Comprehensive analytics for content creators including:
- Total articles, views, likes, and comments
- Individual article performance metrics
- Recent articles engagement data

### Draft System
Save articles as drafts before publishing. Drafts are not visible to other users and can be edited and published later.

### Tag System
Add up to 10 tags per article for better content discovery. Tags are used in search and related articles recommendations.

### Related Articles
AI-powered content recommendations based on:
- Article category
- Article tags
- Engagement metrics

### View Tracking
Automatic view counting that tracks when users read articles. Views are counted after 2 seconds of viewing to ensure genuine engagement.

---

##  Configuration

### Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User** - User accounts and profiles
- **Article** - Blog articles with tags, drafts, and views
- **Comment** - Nested comment system
- **Like** - Article likes
- **Bookmark** - User bookmarks
- **Notification** - User notifications (schema ready)

### Environment Variables

See `.env.example` for all required environment variables.

---


---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---



##  Author

- GitHub: [@yourusername](https://github.com/shibin4135)

---

##  Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Cloudinary](https://cloudinary.com/) - Image hosting

---

<div align="center">

**Built with ❤️ using Next.js 15 and React 19**

⭐ Star this repo if you find it helpful!

</div>
