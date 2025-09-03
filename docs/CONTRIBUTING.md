# Contributing Guidelines

Thank you for your interest in contributing to the Affiliate Portal! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- SQLite (for development)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/affiliate-portal.git
   cd affiliate-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-user-authentication`
- `bugfix/fix-login-validation`
- `refactor/improve-database-queries`
- `docs/update-api-documentation`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add JWT token validation
fix(api): resolve brand creation validation error
docs(api): update endpoint documentation
refactor(models): improve database query performance
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type usage
- Use strict type checking

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic

### File Organization

Follow the established directory structure:
```
src/
├── app/                    # Next.js App Router
├── models/                 # Data access layer
├── actions/                # Server Actions
├── services/               # Third-party integrations
├── auth/                   # Authentication
├── db/                     # Database
└── utils/                  # Utilities
```

### Component Guidelines

- Use functional components with hooks
- Follow the component patterns in [COMPONENTS.md](./COMPONENTS.md)
- Use TypeScript interfaces for props
- Implement proper error handling

### Database Guidelines

- Use Drizzle ORM for database operations
- Follow the schema patterns in `src/db/schema.ts`
- Use proper migrations for schema changes
- Add indexes for performance optimization

## Testing

### Unit Tests

Write unit tests for:
- Model functions
- Service functions
- Utility functions
- Component logic

### Integration Tests

Write integration tests for:
- API endpoints
- Database operations
- Authentication flows
- User interactions

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document API endpoints
- Update README.md for new features
- Keep architecture documentation current

### Component Documentation

- Document component props and usage
- Provide usage examples
- Update COMPONENTS.md for new components

## Security

### Authentication

- Never commit sensitive data
- Use environment variables for secrets
- Implement proper input validation
- Follow security best practices

### Data Protection

- Validate all user inputs
- Use parameterized queries
- Implement proper error handling
- Follow OWASP guidelines

## Performance

### Optimization Guidelines

- Use React.memo for expensive components
- Implement proper caching strategies
- Optimize database queries
- Use lazy loading for large components

### Monitoring

- Add performance monitoring
- Track user interactions
- Monitor API response times
- Log errors appropriately

## Issue Reporting

### Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests

When requesting features, include:
- Clear description of the feature
- Use case and benefits
- Mockups or examples if applicable
- Implementation suggestions

## Code Review

### Review Process

- All code must be reviewed before merging
- Address review comments promptly
- Test changes thoroughly
- Ensure documentation is updated

### Review Guidelines

- Check for code quality and standards
- Verify tests are included
- Ensure security best practices
- Validate performance implications

## Release Process

### Versioning

We follow semantic versioning:
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Notes

Include in release notes:
- New features
- Bug fixes
- Breaking changes
- Migration instructions

## Community

### Communication

- Be respectful and inclusive
- Provide constructive feedback
- Help other contributors
- Follow the code of conduct

### Getting Help

- Check existing documentation
- Search existing issues
- Ask questions in discussions
- Contact maintainers if needed

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Thank You

Thank you for contributing to the Affiliate Portal! Your contributions help make this project better for everyone.
