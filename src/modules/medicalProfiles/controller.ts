import { Request, Response } from 'express';
import * as service from './service';

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const profile = await service.getProfile(req.user!.id);
    if (!profile) {
      return res.status(404).json({ error: 'Medical profile not found' });
    }
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};
