import { Router } from 'express';
import { getAllSessionNotes, addSessionNotes } from '../Controllers/sessionNotesController';

const router = Router();

router.get('/session-notes', getAllSessionNotes);
router.post('/session-notes', addSessionNotes);

export default router;