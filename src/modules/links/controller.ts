import { Request, Response, NextFunction } from 'express';
import * as linkService from './service';

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await linkService.createLink(req.user!.userId);
    res.status(201).json({ code: 'SUCCESS', message: 'Link created', data: link });
  } catch (error) { next(error); }
};

export const claim = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await linkService.claimLink(req.user!.userId, req.body.link_code);
    res.json({ code: 'SUCCESS', message: 'Link claimed', data: link });
  } catch (error) { next(error); }
};

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dash = await linkService.getDoctorDashboard(req.user!.userId);
    res.json({ code: 'SUCCESS', data: dash });
  } catch (error) { next(error); }
};

export const getMyLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role === 'DOCTOR') {
      const links = await linkService.getDoctorLinks(req.user!.userId);
      res.json({ code: 'SUCCESS', data: links });
    } else {
      const links = await linkService.getPatientLink(req.user!.userId);
      res.json({ code: 'SUCCESS', data: links });
    }
  } catch (error) { next(error); }
};
