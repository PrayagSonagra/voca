📚 Voca - AI-Powered Book Library
Voca transforms static PDFs into interactive, AI-powered conversations. Upload your books, organize your library, and ask questions directly to your documents.

🚀 Key Features
PDF Intelligence: Automatic text extraction and intelligent segmentation with context overlap to ensure the AI never loses the thread of the conversation.

Library Management: Seamlessly organize your personal collection with custom slugs, metadata tracking, and real-time status updates.

Secure Authentication: Fully integrated with Clerk for protected user sessions and private library access.

Performance Driven: Optimized database queries using Mongoose .lean() for high-speed data retrieval.

Modern UX/UI: Built with a sleek, responsive interface using Tailwind CSS, Shadcn/UI, and Sonner for non-blocking notifications.

Theme Continuity: Native Light and Dark mode support that respects system preferences without hydration flashes.

🛠️ Tech Stack
Frontend & Core
Framework: Next.js 15+ (App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn/UI

State & Providers: next-themes, Clerk

Backend & Database
Database: MongoDB Atlas

ORM: Mongoose

PDF Processing: pdfjs-dist

📖 Core Logic: Context-Aware Segmentation
To ensure AI models can process large books accurately, Voca utilizes a Sliding Window algorithm for text extraction. This process prevents context loss at the edges of text chunks.

Extraction: Raw text is pulled from PDF layers using pdfjs-dist.

Tokenization: Content is split into word arrays to prevent mid-word cutting.

Chunking: Text is divided into segments (Default: 500 words).

Overlapping: Each segment carries an "Overlap" (Default: 50 words) from the previous chunk, ensuring semantic continuity during AI vectorization.

📁 Project Architecture
app/: Next.js App Router (Pages, Layouts, and API endpoints)

components/: Modular React components (Navbar, UploadForm, UI kit)

models/: Mongoose schemas for Book and BookSegment

lib/: Core utilities including the PDF processing engine and database configuration

hooks/: Custom React hooks for application logic