import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// NOTE: Razorpay backend integration has been removed for security
// Payment processing is now done in demo/simulation mode

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Payment backend integration has been removed');
  console.log('Endpoints:');
  console.log('  GET  /api/health - Health check');
});
