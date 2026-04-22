import { Request, Response, NextFunction } from 'express';
import * as symptomService from './service';

export const logSymptom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entry = await symptomService.logSymptom(req.user!.userId, req.body);
    res.status(201).json({ code: 'SUCCESS', message: 'Symptom logged', data: entry });
  } catch (error: any) { 
    if (error.code === 'P2002') {
      next({ statusCode: 400, code: 'DUPLICATE_ENTRY', message: 'You already logged this symptom today' });
    } else {
      next(error); 
    }
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.user!.role === 'PATIENT' ? req.user!.userId : parseInt(req.params.patientId);
    if (isNaN(patientId)) throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid patient ID' };
    
    const history = await symptomService.getHistory(patientId);
    res.json({ code: 'SUCCESS', data: history });
  } catch (error) { next(error); }
};

export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = req.user!.role === 'PATIENT' ? req.user!.userId : parseInt(req.params.patientId);
    if (isNaN(patientId)) throw { statusCode: 400, code: 'INVALID_ID', message: 'Invalid patient ID' };
    
    const alerts = await symptomService.getHighSeverityAlerts(patientId);
    res.json({ code: 'SUCCESS', data: alerts });
  } catch (error) { next(error); }
};
