import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import {
  GetAllSessions,
  GetSessionById,
  FilterSessionsByTag,
  SearchSession,
  CreateSessionUseCase,
  UpdateSessionUseCase,
  DeleteSessionUseCase
} from '../../../application/useCases/session';
import { MongoSessionRepository } from '../../database/repositories/MongoSessionRepository';

const router = Router();
const sessionRepository = new MongoSessionRepository();

const getAllSessionsUseCase = new GetAllSessions(sessionRepository);
const getSessionByIdUseCase = new GetSessionById(sessionRepository);
const filterSessionsByTagUseCase = new FilterSessionsByTag(sessionRepository);
const searchSessionUseCase = new SearchSession(sessionRepository);
const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
const updateSessionUseCase = new UpdateSessionUseCase(sessionRepository);
const deleteSessionUseCase = new DeleteSessionUseCase(sessionRepository);

const sessionController = new SessionController(
  getAllSessionsUseCase,
  getSessionByIdUseCase,
  filterSessionsByTagUseCase,
  searchSessionUseCase,
  createSessionUseCase,
  updateSessionUseCase,
  deleteSessionUseCase
);

router.get('/', (req, res) => sessionController.getAllSessions(req, res));
router.get('/search', (req, res) => sessionController.searchSessions(req, res));
router.get('/tags', (req, res) => sessionController.getSessionsByTags(req, res));
router.get('/:id', (req, res) => sessionController.getSessionById(req, res));
router.post('/', (req, res) => sessionController.createSession(req, res));
router.put('/:id', (req, res) => sessionController.updateSession(req, res));
router.delete('/:id', (req, res) => sessionController.deleteCharacter(req, res));

export { router as sessionRoutes };