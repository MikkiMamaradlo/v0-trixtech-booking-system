# TRIXTECH - Booking & Reservation System

A complete full-stack web application for managing events, supplies, and services with customer and admin interfaces.

## Tech Stack

- **Frontend**: Next.js 16 + React + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Authorization**: Role-Based Access Control (RBAC)

## Project Structure

\`\`\`
trixtech-booking-system/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── customer/
│   │   │   ├── home/
│   │   │   ├── booking/
│   │   │   ├── bookings/
│   │   │   └── payment/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── services/
│   │   │   ├── bookings/
│   │   │   └── customers/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   │   ├── auth-context.tsx
│   │   └── protected-route.tsx
│   ├── package.json
│   └── README.md
└── backend/                  # Express.js API server
    ├── server.js
    ├── models/              # MongoDB schemas
    ├── routes/              # API routes
    ├── middleware/          # Authentication & RBAC middleware
    ├── package.json
    └── README.md
\`\`\`

## Features

### Customer Interface
- User authentication (signup/login)
- Browse available services
- Make bookings with date and quantity
- View booking history and status
- Cancel pending bookings
- Payment processing

### Admin Interface
- Admin authentication
- Manage services (create, read, update, delete)
- Review and approve/decline bookings
- View customer list
- Analytics dashboard with reports
- Revenue tracking

### Security
- JWT-based authentication
- Role-based access control (customer vs admin)
- Protected API routes with middleware
- Secure password handling

## Installation & Setup

### Backend Setup
\`\`\`bash
cd backend
npm install
# Configure MongoDB connection in .env
npm run dev
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Environment Variables

Backend (.env):
\`\`\`
MONGODB_URI=mongodb://localhost:27017/trixtech
JWT_SECRET=your-secret-key
PORT=5000
\`\`\`

Frontend (.env.local):
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Services (Public Read, Admin Write)
- GET /api/services
- GET /api/services/:id
- POST /api/services (admin)
- PUT /api/services/:id (admin)
- DELETE /api/services/:id (admin)

### Bookings
- GET /api/bookings (all user bookings)
- POST /api/bookings (create)
- PUT /api/bookings/:id (admin)
- DELETE /api/bookings/:id

### Admin Routes
- GET /api/admin/users (all customers)
- GET /api/admin/reports (dashboard stats)

### Payments
- POST /api/payments

## Demo Credentials

Customer:
- Email: customer@email.com
- Password: (create new account)

Admin:
- Email: admin@email.com
- Password: (create new account)

## Getting Started

1. Install dependencies for both frontend and backend:
   - `cd frontend && npm install`
   - `cd backend && npm install`
2. Start MongoDB service
3. Run backend: `npm run dev` (from backend folder on port 5000)
4. Run frontend: `npm run dev` (from frontend folder on port 3000)
5. Access the app at http://localhost:3000

## Features by User Role

### Customer
- View all available services
- Create bookings with flexible dates
- Track booking status (pending, approved, completed, cancelled)
- Manage payment information
- View booking history

### Admin
- Full service management
- Booking approval workflow
- Customer management and analytics
- Revenue reports
- System statistics

## Security Features

- JWT token-based authentication
- Role-based middleware for API protection
- Client-side route protection
- Input validation
- Protected sensitive endpoints

## Future Enhancements

- Email notifications for booking status
- Real Stripe payment integration
- Service reviews and ratings
- Calendar view for bookings
- Advanced filtering and search
- Export reports to PDF
- Multi-language support
