import { Request, Response, NextFunction } from 'express';
import * as authService from './service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    // Exclude password hash
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(201).json({
      code: 'SUCCESS',
      message: 'User registered successfully',
      data: { user: userWithoutPassword, token }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    const { password_hash, ...userWithoutPassword } = user;
    
    res.status(200).json({
      code: 'SUCCESS',
      message: 'Logged in successfully',
      data: { user: userWithoutPassword, token }
    });
  } catch (error) {
    next(error);
  }
};
