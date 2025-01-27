import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const characters = await prisma.character.findMany({
      include: {
        stats: true,
        mentalHealth: true,
        skills: true,
        equipment: true,
      },
    });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

router.post('/', async (req, res) => {
  try {
    const character = await prisma.character.create({
      data: {
        ...req.body,
        stats: { create: req.body.stats },
        mentalHealth: { create: req.body.mentalHealth },
        skills: { create: req.body.skills },
        equipment: { create: req.body.equipment },
      },
      include: {
        stats: true,
        mentalHealth: true,
        skills: true,
        equipment: true,
      },
    });
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const character = await prisma.character.update({
      where: { id: Number(id) },
      data: req.body,
      include: {
        stats: true,
        mentalHealth: true,
        skills: true,
        equipment: true,
      },
    });
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update character' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.character.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default router;