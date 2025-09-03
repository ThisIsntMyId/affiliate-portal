# Affiliate Portal

A modern affiliate management platform built with Next.js, TypeScript, and Drizzle ORM. This application provides comprehensive tools for managing brands, affiliates, and tracking referral performance.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - Technical architecture, patterns, and design decisions
- **[Components](./docs/COMPONENTS.md)** - Reusable UI components and usage guidelines
- **[API Reference](./docs/API.md)** - API endpoints and integration guide

## ✨ Key Features

- **Brand Management** - Create and manage brand profiles
- **Affiliate Tracking** - Track affiliate performance and commissions
- **Referral System** - Generate and manage referral links
- **Analytics Dashboard** - Comprehensive reporting and insights
- **User Management** - Role-based access control
- **Real-time Updates** - Live data synchronization

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **UI Components**: Custom component library
- **Authentication**: JWT with secure cookies

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── models/                 # Data access layer
├── actions/                # Server Actions (controllers)
├── services/               # Third-party integrations
├── auth/                   # Authentication module
├── db/                     # Database configuration
└── utils/                  # Utility functions
```

## 🏗️ Architecture

This application follows a clean, layered architecture:

- **Models**: Data access and business logic
- **Actions**: User interaction handling (like Laravel controllers)
- **API Routes**: External interface for integrations
- **Services**: Third-party integrations and cross-cutting concerns
- **Pages**: Server-side rendering and UI

For detailed architecture information, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## 🚀 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SQLite (for development)

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure your environment variables
3. Run database migrations: `npm run db:migrate`
4. Start the development server: `npm run dev`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate database schema
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help:

- Check the [documentation](./docs/)
- Open an [issue](https://github.com/your-org/affiliate-portal/issues)
- Contact the development team

---

**Built with ❤️ for efficient affiliate management**