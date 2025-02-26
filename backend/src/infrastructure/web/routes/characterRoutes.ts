import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';
import { 
  GetAllCharactersUseCase, 
  GetCharacterByIdUseCase,
  CreateCharacterUseCase,
  UpdateCharacterUseCase,
  DeleteCharacterUseCase
} from '../../../application/useCases/character';
import { MongoCharacterRepository } from '../../database/repositories/MongoCharacterRepository';

const router = Router();
const characterRepository = new MongoCharacterRepository();

const getAllCharactersUseCase = new GetAllCharactersUseCase(characterRepository);
const getCharacterByIdUseCase = new GetCharacterByIdUseCase(characterRepository);
const createCharacterUseCase = new CreateCharacterUseCase(characterRepository);
const updateCharacterUseCase = new UpdateCharacterUseCase(characterRepository);
const deleteCharacterUseCase = new DeleteCharacterUseCase(characterRepository);

const characterController = new CharacterController(
  getAllCharactersUseCase,
  getCharacterByIdUseCase,
  createCharacterUseCase,
  updateCharacterUseCase,
  deleteCharacterUseCase
);

router.get('/', (req, res) => characterController.getAllCharacters(req, res));
router.get('/:id', (req, res) => characterController.getCharacterById(req, res));
router.post('/', (req, res) => characterController.createCharacter(req, res));
router.put('/:id', (req, res) => characterController.updateCharacter(req, res));
router.delete('/:id', (req, res) => characterController.deleteCharacter(req, res));

export { router as characterRoutes };