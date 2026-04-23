import { Request, Response } from 'express';
import * as service from './service';

export const getToday = async (req: Request, res: Response) => {
  try {
    const data = await service.getTodayIntakes(req.user!.id);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve intakes' });
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    const intakeId = parseInt(req.params.id);
    const updated = await service.confirmIntake(intakeId);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to confirm intake' });
  }
};
