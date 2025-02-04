import { Router } from 'express';
import { getAllCharacters, addCharacter } from '../Controllers/characterController';

const router = Router();

router.get('/characters', getAllCharacters);
router.post('/characters', addCharacter);

export default router;