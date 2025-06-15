# Notes App

A modern notes application built with SvelteKit and TailwindCSS. Features include CRUD operations, search, sort, pagination, and dark mode.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 5.0
- **Styling**: TailwindCSS 3.4
- **API**: MockAPI (mockapi.io)
- **TypeScript**: For type safety
- **Package Manager**: pnpm

## 🎯 Features

- ✨ Create, read, update, and delete notes
- 🔍 Search notes by title/content
- 📊 Sort by date or title
- 📱 Responsive design
- 🌓 Dark mode with system preference detection

## 🤔 Trade-offs & Assumptions

1. **State Management**

   - Used local component state instead of a global store
   - Assumed notes list is small enough for client-side filtering/sorting
   - Trade-off: Might need refactoring for larger datasets

2. **API Integration**

   - Used MockAPI for simplicity
   - Assumed RESTful endpoints with standard CRUD operations
   - Trade-off: Real API might need different error handling/auth

3. **Pagination**

   - Client-side pagination for simplicity
   - Assumed 10 items per page is reasonable
   - Trade-off: Server-side pagination would be better for large datasets

4. **Error Handling**
   - Basic error messages with rollback on failure
   - Assumed most errors are temporary
   - Trade-off: More sophisticated error recovery might be needed

## 🔮 What i'd do in more time

1. **Performance**

   - Implement server-side pagination and filtering
   - Add request caching and optimistic updates
   - Lazy load components

2. **Features**

   - Add note categories/tags
   - Implement note sharing
   - Add rich text editing
   - Add note export/import
   - Add keyboard shortcuts

3. **UX Enhancements**

   - Add drag-and-drop reordering
   - Implement infinite scroll
   - Add note previews
   - Add undo/redo functionality
   - Add toast notifications

4. **Technical**
   - Add proper loading states
   - Add proper form validation
   - Add proper API error handling
   - Add proper logging
