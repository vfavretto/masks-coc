import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import characterRoutes from '../src/Routes/characterRoute';
import sessionNotesRoutes from '../src/Routes/sessionNotesRoute';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/session-notes', sessionNotesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});