import { Request, Response, NextFunction } from 'express';

export type Role = 'PATIENT' | 'DOCTOR';

export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
        details: {}
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: `Requires ${role} role`,
        details: {}
      });
    }

    next();
  };
};
