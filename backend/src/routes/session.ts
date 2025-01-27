import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        clues: true,
        items: true,
      },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const session = await prisma.session.create({
      data: {
        ...req.body,
        clues: { create: req.body.clues },
        items: { create: req.body.items },
      },
      include: {
        clues: true,
        items: true,
      },
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

export default router;