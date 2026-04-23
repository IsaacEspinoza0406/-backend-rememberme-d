import { Request, Response } from 'express';
import * as service from './service';

export const createSymptom = async (req: Request, res: Response) => {
  try {
    const patient_id = req.user!.id;
    const symptom = await service.createSymptom(patient_id, req.body);
    res.status(201).json(symptom);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Symptom already logged for this date' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create symptom' });
  }
};

export const getSymptoms = async (req: Request, res: Response) => {
  try {
    const symptoms = await service.getSymptoms(req.user!.id);
    res.status(200).json(symptoms);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve symptoms' });
  }
};
