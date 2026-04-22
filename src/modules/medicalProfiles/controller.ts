import { Request, Response, NextFunction } from 'express';
import * as profileService from './service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.getMedicalProfile(req.user!.userId);
    res.json({ code: 'SUCCESS', data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await profileService.updateMedicalProfile(req.user!.userId, req.body);
    res.json({ code: 'SUCCESS', message: 'Profile updated', data: profile });
  } catch (error) {
    next(error);
  }
};
