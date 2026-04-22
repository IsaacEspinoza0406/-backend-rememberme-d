import { Request, Response } from 'express';
import * as service from './service';

export const getMedications = async (req: Request, res: Response) => {
  try {
    const data = await service.getMedications(req.user!.id);
    res.status(200).json({ data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve medications' });
  }
};

export const createMedication = async (req: Request, res: Response) => {
  try {
    const patient_id = req.user!.id;
    const medication = await service.createMedication(patient_id, req.body);
    res.status(201).json(medication);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
};
