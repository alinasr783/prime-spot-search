# Real Estate Platform

## Project Overview
This is a full-stack real estate platform built with React and Express, featuring property listings, search functionality, and admin management. The application uses TypeScript, Tailwind CSS, and shadcn/ui components.

## Architecture
- **Frontend**: React with Vite, TypeScript, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state

## Recent Changes
- Created missing `use-media-query` hook to fix SearchForm import errors
- Fixed routing configuration using wouter
- Working on resolving Footer component Link import issues

## User Preferences
- Use Arabic language for UI text where appropriate
- Implement responsive design patterns
- Focus on real estate domain-specific features

## Current Issues Being Resolved
- Missing useMediaQuery hook causing SearchForm to fail
- Footer component has Link import conflicts between react-router-dom and wouter
- Application failing to start due to import resolution issues

## Key Features
- Property search with advanced filters
- Admin dashboard for property management
- Contact settings management
- Image upload functionality
- Responsive design for mobile and desktop