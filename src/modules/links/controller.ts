import { Request, Response } from 'express';
import * as service from './service';

export const generate = async (req: Request, res: Response) => {
  try {
    const link = await service.createLink(req.user!.id);
    res.status(201).json(link);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate link' });
  }
};

export const claim = async (req: Request, res: Response) => {
  try {
    const link = await service.claimLink(req.user!.id, req.body.link_code);
    res.status(200).json(link);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Failed to claim link';
    res.status(statusCode).json({ error: errorMessage });
  }
};
