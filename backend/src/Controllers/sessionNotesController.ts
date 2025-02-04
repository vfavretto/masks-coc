import { Request, Response } from 'express';
import { getSessionNotes, createSessionNotes } from '../Services/sessionNotesService';

export const getAllSessionNotes = async (req: Request, res: Response) => {
  try {
    const sessionNotes = await getSessionNotes();
    res.json(sessionNotes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar notas de sessão" });
  }
};

export const addSessionNotes = async (req: Request, res: Response) => {
  try {
    const newSessionNotes = await createSessionNotes(req.body);
    res.status(201).json(newSessionNotes);
  } catch (error) {
    res.status(400).json({ error: "Dados inválidos" });
  }
};