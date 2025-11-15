import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trixtech')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Service Model
const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  availability: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' },
  date: Date,
  quantity: Number,
  totalPrice: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Payment Model
const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  method: String,
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Role Authorization Middleware
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role: role || 'customer' });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET);
    res.json({ token, user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Service Routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/services', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.json(newService);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/services/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/services/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Booking Routes
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'customer') {
      bookings = await Booking.find({ userId: req.user.id }).populate('serviceId');
    } else {
      bookings = await Booking.find().populate('userId').populate('serviceId');
    }
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.user.id });
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment Routes
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/admin/reports', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const bookingsByStatus = await Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    res.json({ totalBookings, totalRevenue: totalRevenue[0]?.total || 0, bookingsByStatus });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
