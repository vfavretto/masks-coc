import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import characterRoutes from '../src/routes/characters';
import sessionRoutes from '../src/routes/session';
import investigationRoutes from '../src/routes/investigation';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/investigation', investigationRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { prisma };