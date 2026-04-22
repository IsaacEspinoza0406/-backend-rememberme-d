import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import prisma from './lib/prisma';

// Routes
import { authRouter } from './modules/auth/auth.router';
import { medicationsRouter } from './modules/medications/medications.router';
import { intakeLogsRouter } from './modules/intakeLogs/intakeLogs.router';
import { symptomsRouter } from './modules/symptoms/symptoms.router';
import { linksRouter } from './modules/links/links.router';
import { medicalProfilesRouter } from './modules/medicalProfiles/medicalProfiles.router';

const app = express();

app.use(cors());
app.use(express.json());

// Main health endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/intake-logs', intakeLogsRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/links', linksRouter);
app.use('/api/medical-profiles', medicalProfilesRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
