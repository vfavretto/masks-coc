import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [nodes, connections] = await Promise.all([
      prisma.node.findMany(),
      prisma.connection.findMany(),
    ]);
    res.json({ nodes, connections });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investigation board' });
  }
});

// Create node
router.post('/nodes', async (req, res) => {
  try {
    const node = await prisma.node.create({
      data: req.body,
    });
    res.json(node);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create node' });
  }
});

// Create connection
router.post('/connections', async (req, res) => {
  try {
    const connection = await prisma.connection.create({
      data: req.body,
    });
    res.json(connection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

export default router;