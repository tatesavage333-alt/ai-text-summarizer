# AI Text Summarizer

A modern web application that transforms long text into concise, intelligent summaries using OpenAI's GPT-3.5 Turbo. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **Text Summarization**: Paste long text and get AI-generated summaries
- **Multiple Summary Styles**: Choose from concise, detailed, or bullet-point formats
- **Persistent Storage**: All summaries are saved to a SQLite database
- **Summary History**: View and manage all past summaries

### Bonus Features
- **Adjustable Summary Styles**: Three different summary formats to choose from
- **Rate Limiting**: Basic abuse protection (10 requests per 15 minutes per IP)
- **Search & Filter**: Find summaries by content or filter by style
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-text-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL="file:./dev.db"

# Next.js Configuration (optional)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## API Endpoints

### POST /api/summaries
Create a new summary

**Request Body:**
```json
{
  "originalText": "Your long text here...",
  "summaryStyle": "concise" // "concise" | "detailed" | "bullet-points"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "summary-id",
    "originalText": "...",
    "summaryText": "...",
    "summaryStyle": "concise",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/summaries
Retrieve all summaries with optional search and filtering

**Query Parameters:**
- `search`: Search term to filter summaries
- `style`: Filter by summary style

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "summary-id",
      "originalText": "...",
      "summaryText": "...",
      "summaryStyle": "concise",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/summaries/[id]
Retrieve a specific summary

### DELETE /api/summaries/[id]
Delete a specific summary

## Design Notes

### Architecture Decisions

1. **Next.js Full-Stack Approach**: Chose Next.js for both frontend and backend to simplify deployment and maintain consistency across the stack.

2. **SQLite with Prisma**: Used SQLite for simplicity and Prisma for type-safe database operations. Easy to set up and perfect for this use case.

3. **Component-Based Architecture**: Separated concerns with dedicated components:
   - `SummaryForm`: Handles text input and summary creation
   - `SummaryCard`: Displays individual summaries with expand/collapse
   - `SummariesList`: Manages the list of summaries with search/filter

4. **Rate Limiting**: Implemented simple in-memory rate limiting to prevent abuse. In production, this should use Redis or similar.

5. **Error Handling**: Comprehensive error handling at both API and UI levels with user-friendly messages.

### UI/UX Decisions

1. **Clean, Modern Design**: Used Tailwind CSS for a clean, professional appearance
2. **Responsive Layout**: Mobile-first design that works on all screen sizes
3. **Progressive Disclosure**: Original text is hidden by default but can be expanded
4. **Real-time Feedback**: Loading states, character counts, and immediate validation
5. **Intuitive Icons**: Used Lucide React icons for better visual communication

### Performance Considerations

1. **Client-Side Filtering**: Search and filter operations happen client-side for instant feedback
2. **Optimistic Updates**: UI updates immediately while API calls happen in background
3. **Pagination Ready**: Limited to 50 summaries per request, ready for pagination if needed

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── summaries/
│   │       ├── route.ts          # Main summaries API
│   │       └── [id]/route.ts     # Individual summary operations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── SummaryForm.tsx           # Text input and summary creation
│   ├── SummaryCard.tsx           # Individual summary display
│   └── SummariesList.tsx         # Summary list with search/filter
├── lib/
│   ├── db.ts                     # Prisma client setup
│   └── openai.ts                 # OpenAI integration
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` then run `npx prisma db push`
2. **Type Generation**: Prisma automatically generates types after schema changes
3. **API Testing**: Use tools like Postman or curl to test API endpoints
4. **Frontend Development**: Components auto-reload with Next.js hot reload

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Ensure environment variables are set in production

## Limitations & Future Improvements

### Current Limitations
- In-memory rate limiting (resets on server restart)
- No user authentication
- Single OpenAI model (GPT-3.5 Turbo)
- No summary editing capabilities

### Potential Improvements
- User authentication and personal summary libraries
- Multiple AI model support (GPT-4, Claude, etc.)
- Summary editing and regeneration
- Export summaries to PDF/Word
- Team collaboration features
- Advanced analytics and usage tracking
- Redis-based rate limiting
- Summary templates and custom prompts

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT-3.5 Turbo API
- Vercel for the Next.js framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
