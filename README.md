# BlogNest - Full-Stack Blogging Platform

A modern, production-ready full-stack blogging platform built with Next.js 15, React 19, and TypeScript. Features include user authentication, rich text editing, nested comments, real-time interactions, analytics, and much more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Deployment](#deployment)

## Features

### Authentication & Authorization

- **Clerk Authentication** - Secure user authentication with email/password and social logins
- **Protected Routes** - Middleware-based route protection for authenticated pages
- **User Profiles** - Custom user profiles with avatars and user information
- **Role-based Access** - Author verification and permission management
- **Session Management** - Secure session handling with Clerk

### Article Management

- **Rich Text Editor** - Jodit WYSIWYG editor with full formatting options including bold, italic, lists, links, and more
- **Draft System** - Save articles as drafts before publishing
- **Auto-save** - Automatic draft saving to prevent content loss
- **Image Upload** - Cloudinary integration for optimized image hosting and management
- **Categories & Tags** - Organize content with categories and up to 10 tags per article
- **Article Editing** - Full CRUD operations for articles with edit history
- **Reading Time** - Automatic calculation and display of estimated reading time
- **View Tracking** - Track article views for analytics with intelligent view counting
- **Cover Images** - Support for article cover images with optimized loading
- **Article Export** - Export articles as Markdown or plain text files

### Advanced Comment System

- **Nested Comments** - Unlimited depth comment threading for discussions
- **Real-time Updates** - See new comments without page refresh
- **Author Information** - Display commenter avatars, names, and timestamps
- **Comment Reactions** - Like, love, and react to comments (schema ready for implementation)
- **Edit History** - Track comment edits with timestamps
- **Reply System** - Reply to specific comments with threaded conversations
- **Responsive Design** - Mobile-friendly comment interface

### Engagement Features

- **Like System** - Like articles with real-time counter updates
- **Bookmark System** - Save articles for later reading with dedicated bookmarks page
- **Share Functionality** - Share articles on social media with Open Graph support and native share API
- **Reading Progress** - Visual progress bar showing reading completion
- **Related Articles** - Content recommendations based on category and tags
- **Trending Articles** - Discover trending content based on engagement metrics

### Search & Discovery

- **Full-Text Search** - Search across titles, content, and categories
- **Search Highlighting** - Highlight matching terms in search results
- **Category Filtering** - Filter articles by category
- **Tag-based Search** - Find articles by tags
- **Debounced Search** - Optimized search with 300ms debounce for better performance
- **Real-time Search Results** - Instant search results as you type

### Analytics Dashboard

- **Overview Statistics** - Total articles, views, likes, comments, and bookmarks
- **Article Performance** - Track individual article metrics including views, likes, comments, and bookmarks
- **Recent Articles** - View performance of recent publications
- **Engagement Metrics** - Detailed analytics including engagement rate and average performance
- **Trending Articles** - Discover trending content based on engagement scores
- **Top Performing Articles** - Identify your best-performing content
- **Visual Analytics** - Charts and progress bars for easy data visualization

### User Experience

- **Dark/Light Mode** - System-aware theme switching with persistent preferences
- **Responsive Design** - Fully responsive across all devices and screen sizes
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Toast Notifications** - User-friendly notification system for actions and errors
- **Pagination** - Efficient content pagination for better performance
- **Social Sharing** - Open Graph and Twitter Card support for rich link previews
- **Command Palette** - Quick navigation and actions with keyboard shortcuts (Ctrl/Cmd + K)
- **Smooth Animations** - Polished UI with smooth transitions and animations

### Performance Optimizations

- **Database Indexing** - Optimized queries with strategic indexes on frequently queried fields
- **Image Optimization** - Next.js Image component with lazy loading and automatic optimization
- **Code Splitting** - Dynamic imports for better performance and smaller bundle sizes
- **Server Components** - Leveraging Next.js 15 App Router for optimal performance
- **View Tracking** - Efficient view counting system with debouncing
- **API Route Optimization** - Optimized API endpoints with proper error handling

### Security Features

- **Input Validation** - Zod schema validation for all forms and API endpoints
- **XSS Protection** - HTML sanitization for user-generated content
- **CSRF Protection** - Built-in Next.js CSRF protection
- **Secure File Uploads** - File type and size validation for image uploads
- **Environment Variables** - Secure configuration management
- **Route Protection** - Middleware-based authentication for protected routes

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - Latest React with Server Components and improved performance
- **TypeScript** - Type-safe development with full type checking
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Jodit React** - Rich text editor for article creation
- **react-hot-toast** - Toast notifications for user feedback
- **date-fns** - Date formatting and manipulation
- **next-themes** - Theme management for dark/light mode

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Next.js 15 server actions for form handling
- **Prisma ORM** - Type-safe database access and migrations
- **PostgreSQL** - Production-ready relational database
- **Zod** - Schema validation for runtime type checking

### Services & Integrations

- **Clerk** - Authentication and user management
- **Cloudinary** - Image hosting and optimization
- **Next.js Image** - Optimized image delivery with automatic format conversion

### Development Tools

- **ESLint** - Code linting and quality checks
- **TypeScript** - Static type checking
- **Prisma Migrate** - Database migrations and schema management

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud-hosted)
- Clerk account (for authentication) - Get your keys at https://dashboard.clerk.com
- Cloudinary account (for image hosting) - Sign up at https://cloudinary.com

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
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"

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

   # (Optional) Open Prisma Studio to view your database
   npx prisma studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
FullStackBlogApp/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── analytics/
│   │   │   ├── bookmark-post/
│   │   │   ├── create-comment/
│   │   │   ├── create-user/
│   │   │   ├── delete-user/
│   │   │   ├── edit-article/
│   │   │   ├── fetch-articles/
│   │   │   ├── fetch-comments/
│   │   │   ├── get-single-article/
│   │   │   ├── like-post/
│   │   │   ├── pagination-prisma/
│   │   │   ├── related-articles/
│   │   │   ├── reply-comment/
│   │   │   ├── search-article/
│   │   │   └── track-view/
│   │   ├── articles/         # Article pages
│   │   │   ├── [id]/        # Single article view
│   │   │   └── editArticle/ # Article editing
│   │   ├── components/       # React components
│   │   │   ├── ArticleClient.tsx
│   │   │   ├── Bookmark.tsx
│   │   │   ├── CommentComponent.tsx
│   │   │   ├── LikeComponent.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── ShareComponent.tsx
│   │   │   └── ...
│   │   ├── analytics/        # Analytics dashboard
│   │   ├── bookmarks/        # Bookmarks page
│   │   ├── create-article/   # Article creation
│   │   ├── sign-in/          # Authentication pages
│   │   ├── sign-up/
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
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

## API Documentation

### Article Endpoints

#### GET /api/fetch-articles
Fetch all published articles with pagination support.

**Response:**
```json
{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "category": "string",
      "tags": ["string"],
      "views": 0,
      "user": {...},
      "_count": {
        "likes": 0,
        "comments": 0,
        "bookmarks": 0
      }
    }
  ]
}
```

#### GET /api/get-single-article/[articleId]
Fetch a single article by ID with full details.

#### GET /api/search-article?searchTerm=query&category=cat&tags=tag1,tag2
Search articles with full-text search.

**Query Parameters:**
- `searchTerm` (required): Search query
- `category` (optional): Filter by category
- `tags` (optional): Comma-separated tags

#### POST /api/track-view
Track article view with intelligent counting.

**Body:**
```json
{
  "articleId": "string"
}
```

#### POST /api/edit-article
Update an existing article.

**Body:**
```json
{
  "articleId": "string",
  "title": "string",
  "content": "string",
  "category": "string",
  "tags": ["string"],
  "coverPic": "string",
  "isDraft": "boolean"
}
```

### Engagement Endpoints

#### GET /api/like-post?userId=id&articleId=id
Check if user has liked an article.

#### POST /api/like-post
Toggle like on an article.

**Body:**
- `userId`: User ID
- `articleId`: Article ID

#### GET /api/bookmark-post?userId=id&articleId=id
Check if user has bookmarked an article.

#### POST /api/bookmark-post
Toggle bookmark on an article.

**Body:**
- `userId`: User ID
- `articleId`: Article ID

### Comment Endpoints

#### POST /api/fetch-comments
Fetch comments for an article with nested replies.

**Body:**
```json
{
  "articleId": "string"
}
```

#### POST /api/create-comment
Create a new comment.

**Body:**
- `userId`: User ID
- `articleId`: Article ID
- `comment`: Comment text

#### POST /api/reply-comment
Reply to a comment.

**Body:**
```json
{
  "commentId": "string",
  "replyText": "string",
  "articleId": "string"
}
```

### Analytics Endpoints

#### GET /api/analytics?type=overview
Get user analytics overview.

**Query Parameters:**
- `type`: `overview` | `trending`

**Response:**
```json
{
  "overview": {
    "totalArticles": 0,
    "totalViews": 0,
    "totalLikes": 0,
    "totalComments": 0
  },
  "recentArticles": [...],
  "trendingArticles": [...]
}
```

### Content Discovery

#### GET /api/related-articles?articleId=id&category=cat&tags=tag1,tag2
Get related articles based on category and tags.

### User Management

#### POST /api/create-user
Create or update user profile from Clerk authentication.

#### DELETE /api/delete-user/[id]
Delete a user account.

## Configuration

### Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User** - User accounts and profiles linked to Clerk
- **Article** - Blog articles with tags, drafts, views, and metadata
- **Comment** - Nested comment system with replies
- **Like** - Article likes with unique constraints
- **Bookmark** - User bookmarks for articles
- **CommentReaction** - Comment reactions (schema ready)
- **Notification** - User notifications (schema ready)

### Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Deploy!

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

**Important:** Make sure to:

- Set all environment variables in your deployment platform
- Run database migrations: `npx prisma migrate deploy`
- Configure Clerk and Cloudinary for production domains
- Set up proper CORS if needed
- Configure image domains in `next.config.ts`

### Database Setup

For production, use a managed PostgreSQL service:

- Vercel Postgres
- Supabase
- Neon
- Railway PostgreSQL
- AWS RDS

Update your `DATABASE_URL` environment variable with the production database connection string.

## Key Features Explained

### Reading Progress Indicator

A visual progress bar at the top of article pages that shows reading completion percentage. Updates in real-time as users scroll through the content.

### Full-Text Search

Advanced search functionality that searches across article titles, content, and categories. Includes search term highlighting and filtering options for better discovery.

### Analytics Dashboard

Comprehensive analytics for content creators including:
- Total articles, views, likes, comments, and bookmarks
- Individual article performance metrics
- Recent articles engagement data
- Engagement rate calculations
- Average performance metrics
- Top performing articles with engagement scores

### Draft System

Save articles as drafts before publishing. Drafts are not visible to other users and can be edited and published later. Supports auto-save functionality.

### Tag System

Add up to 10 tags per article for better content discovery. Tags are used in search and related articles recommendations for improved content organization.

### Related Articles

Content recommendations based on:
- Article category matching
- Article tags similarity
- Engagement metrics

### View Tracking

Automatic view counting that tracks when users read articles. Views are counted after a delay to ensure genuine engagement and prevent bot inflation.

### Command Palette

Quick navigation and actions accessible via keyboard shortcut (Ctrl/Cmd + K). Features include:
- Quick navigation to pages
- Theme switching
- Article creation
- Bookmarks access
- Analytics dashboard access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Jodit](https://xdsoft.net/jodit/) - Rich text editor
