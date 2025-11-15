# TRIXTECH Backend

Express.js + MongoDB backend server for the TRIXTECH booking and reservation system.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Create a `.env` file with:
   \`\`\`
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

3. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Structure

- `/api/auth` - Authentication endpoints (login, register)
- `/api/services` - Service management
- `/api/bookings` - Booking operations
- `/api/customers` - Customer management (admin)
- `/api/payments` - Payment processing
