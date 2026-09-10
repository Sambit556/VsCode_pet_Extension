import { Router, Request, Response } from 'express';
import { PetManager } from '../pets/PetManager';
import { PET_DEFINITIONS } from '../utils/Constants';
import { WebviewSecurity } from '../security/WebviewSecurity';
import { IApiResponse } from '../pets/PetTypes';

export function createPetRouter(): Router {
  const router = Router();
  const petManager = PetManager.getInstance();

  const sendSuccess = <T>(res: Response, data: T, status = 200): void => {
    const body: IApiResponse<T> = {
      success: true,
      data,
      timestamp: Date.now()
    };
    res.status(status).json(body);
  };

  const sendError = (res: Response, error: string, status = 400): void => {
    const body: IApiResponse = {
      success: false,
      error,
      timestamp: Date.now()
    };
    res.status(status).json(body);
  };

  router.get('/health', (_req: Request, res: Response) => {
    sendSuccess(res, { status: 'healthy', version: '1.0.1' });
  });

  router.get('/pets', (_req: Request, res: Response) => {
    sendSuccess(res, { pets: petManager.getAllPets(), ball: petManager.getActiveBall() });
  });

  router.get('/species', (_req: Request, res: Response) => {
    sendSuccess(res, { species: Object.values(PET_DEFINITIONS) });
  });

  router.post('/pets', (req: Request, res: Response) => {
    const { name, species, color } = req.body || {};
    const sanitizedName = WebviewSecurity.sanitizeString(name, 25);
    const pet = petManager.createPet({
      name: sanitizedName,
      species,
      color
    });

    if (!pet) {
      return sendError(res, 'Failed to create pet');
    }
    sendSuccess(res, pet.getData(), 201);
  });

  router.delete('/pets/:id', (req: Request, res: Response) => {
    const success = petManager.removePet(req.params.id);
    if (!success) {
      return sendError(res, 'Pet not found', 404);
    }
    sendSuccess(res, { removed: true });
  });

  router.post('/pets/:id/action', (req: Request, res: Response) => {
    const pet = petManager.getPet(req.params.id);
    if (!pet) {
      return sendError(res, 'Pet not found', 404);
    }

    const { action } = req.body || {};
    let result: { message?: string } = {};

    if (action === 'feed') {
      result = pet.feed();
    } else if (action === 'pet') {
      result = pet.pet();
    }

    sendSuccess(res, { pet: pet.getData(), result });
  });

  router.post('/ball/throw', (req: Request, res: Response) => {
    const origin = req.body?.origin;
    const result = petManager.throwBall(origin);
    if (!result.success) {
      return sendError(res, result.message || 'Cannot throw ball');
    }
    sendSuccess(res, { ball: petManager.getActiveBall() });
  });

  router.post('/ball/catch', (req: Request, res: Response) => {
    const { petId } = req.body || {};
    if (petId) {
      petManager.catchBall(petId);
    }
    sendSuccess(res, { caught: true });
  });

  return router;
}
