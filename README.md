# AB Testing Simulator

A web-based AB-testing simulator for HCI courses where first-year computer science students learn about AB-testing by customizing a simulated shopping website and receiving analytical feedback on their design choices.

## Features

### For Students
- **Login System**: Students enter their unique student ID to access the simulator
- **Shopping Website Simulator**: A realistic e-commerce website with customizable elements
- **Real-time Preview**: See changes instantly as you customize the website
- **Design Customization**: Modify elements like buttons, images, navigation, and more
- **Reasoning Documentation**: Explain your hypotheses for each design change
- **AI-Generated Reports**: Receive detailed analytical feedback from Claude AI
- **Submission History**: View all previous submissions and their results

### For Instructors
- **Admin Dashboard**: View all students and their submissions
- **Student Management**: Add and remove students
- **Submission Analytics**: Review metrics and AI reports for each submission

## Getting Started

### Option 1: Docker (Recommended)

The easiest way to run this project is using Docker. See **[DOCKER.md](DOCKER.md)** for detailed instructions.

#### Quick Start with Docker

1. Clone the repository:
```bash
cd AB-testing
```

2. Create a `.env` file with your API key:
```bash
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

3. Run the startup script:
```bash
./docker-start.sh
```

4. Access the application at [http://localhost:3000](http://localhost:3000)

For more Docker options and troubleshooting, see **[DOCKER.md](DOCKER.md)**.

### Option 2: Local Development

#### Prerequisites
- Node.js 18+
- npm or yarn
- An Anthropic API key (for AI report generation)

#### Installation

1. Clone the repository:
```bash
cd AB-testing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# DATABASE_URL="file:./dev.db"
# OPENAI_API_KEY="your-openai-api-key-here"
```

4. Initialize the database:
```bash
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Test Accounts

### Students
- `student001` - Alice Johnson
- `student002` - Bob Smith
- `student003` - Charlie Brown
- `cs101-001`, `cs101-002`, `cs101-003` - Generic test accounts

### Admin
- Username: `admin`
- Password: `admin123`
- Access at: [http://localhost:3000/admin](http://localhost:3000/admin)

## Usage Guide

### For Students

1. **Login**: Enter your student ID on the homepage
2. **Add Design Changes**: Click "Add Change" to start customizing the website
3. **Select Element**: Choose which element to modify (e.g., Checkout Button, Hero Banner)
4. **Choose Action**: Select what property to change (e.g., Change Color, Change Size)
5. **Pick Value**: Select the specific value for your change
6. **Explain Reasoning**: Write your hypothesis for why this change will improve metrics
7. **Preview**: Watch the website update in real-time
8. **Submit**: Click "Submit Experiment" to get your results
9. **Review Results**: See your calculated metrics and AI-generated analysis

### Customizable Elements

| Element | Available Actions |
|---------|------------------|
| Checkout Button | Change Color, Size, Text, Position |
| Add to Cart Button | Change Color, Size, Text, Position |
| Product Title | Change Size, Color, Font, Position |
| Product Price | Change Size, Color, Show Discount, Position |
| Hero Banner | Change Size, Style, CTA, Position |
| Navigation | Change Style, Position, Color, Show Search |
| Product Image | Change Size, Style, Add Badge, Border |
| Trust Badges | Change Visibility, Position, Type, Style |

### Metrics Explained

- **Conversion Rate**: Percentage of visitors who complete a purchase (higher is better)
- **Bounce Rate**: Percentage of visitors who leave without interaction (lower is better)
- **Click-Through Rate (CTR)**: Percentage of users who click primary CTAs (higher is better)
- **Average Time on Page**: How long users spend on the page in seconds (context-dependent)
- **Cart Abandonment Rate**: Percentage of users who add items but don't checkout (lower is better)

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM (migrated from SQLite)
- **AI**: Any OpenAI API compatible 
- **Screenshots**: Puppeteer (server-side)
- **Icons**: Lucide React

## Project Structure

```
AB-testing/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding script
├── public/
│   └── screenshots/     # Generated screenshots
├── src/
│   ├── app/
│   │   ├── admin/       # Admin dashboard
│   │   ├── api/         # API routes
│   │   ├── simulator/   # Main simulator page
│   │   └── page.tsx     # Login page
│   ├── components/
│   │   ├── CustomizationPanel.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── ShoppingWebsite.tsx
│   │   └── SubmissionHistory.tsx
│   └── lib/
│       ├── ai.ts        # Claude AI integration
│       ├── metrics.ts   # Metrics calculation engine
│       └── prisma.ts    # Database client
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Student login

### Submissions
- `GET /api/submissions?studentId=xxx` - Get student's submissions
- `POST /api/submissions` - Create new submission

### Screenshots
- `POST /api/screenshot` - Generate screenshot for submission

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/students` - List all students
- `POST /api/admin/students` - Add new student
- `DELETE /api/admin/students?studentId=xxx` - Delete student
- `GET /api/admin/submissions` - List all submissions

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `POSTGRES_USER` | PostgreSQL username (for Docker) | Yes |
| `POSTGRES_PASSWORD` | PostgreSQL password (for Docker) | Yes |
| `POSTGRES_DB` | PostgreSQL database name (for Docker) | Yes |

### Metrics Calculation

The metrics calculation engine in `src/lib/metrics.ts` contains weighted values for each design choice combination. Each choice affects metrics differently:

- Some choices improve certain metrics while worsening others
- The weights are designed to be educational and realistic
- Final metrics are clamped to reasonable ranges

## Database Migration

This project has been migrated from SQLite to PostgreSQL for better production deployment and remote database management.

### Migrating from SQLite to PostgreSQL

If you're upgrading from an older version that used SQLite:

1. See **[POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)** for detailed migration instructions
2. Run the automated migration script:
   ```bash
   ./migrate-to-postgresql.sh
   ```

### Connecting with DBeaver or Database Management Tools

With PostgreSQL, you can now easily connect using tools like DBeaver:

- **Host**: your-server-ip
- **Port**: 5432
- **Database**: abtesting
- **Username**: abtesting
- **Password**: abtesting_password (⚠️ change in production!)

For detailed instructions, see **[POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)**.

## Deployment

### Docker (Recommended)

The easiest way to deploy is using Docker. See **[DOCKER.md](DOCKER.md)** for complete deployment instructions.

Quick deployment:
```bash
docker-compose up -d
```

The Docker setup now includes:
- PostgreSQL 16 database service
- Automatic database migrations
- Persistent data volumes
- Health checks

### Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

Note: For Puppeteer screenshot generation on Vercel, you may need to configure serverless function memory limits.

### Self-hosted

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

This project is designed for educational purposes. Feel free to:
- Add new customizable elements
- Expand the metrics calculation weights
- Improve the AI prompts for better reports
- Add new features for instructors

## License

MIT License - feel free to use for educational purposes.
