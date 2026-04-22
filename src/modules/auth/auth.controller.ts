import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'An unexpected error occurred';
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'An unexpected error occurred';
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    // We could make an explicit service function, or just use prisma here if it's super simple
    const prisma = (await import('../../lib/prisma')).default;
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, full_name: true, phone: true, role: true, date_of_birth: true, created_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
