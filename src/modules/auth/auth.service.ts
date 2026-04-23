import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client'; // 1. Agrega esta importación
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw { statusCode: 400, message: 'Email already in use' };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const dateOfBirth = data.date_of_birth ? new Date(data.date_of_birth) : null;

  let user;

  if (data.role === 'PATIENT') {
    // Transaction creates User and MedicalProfile concurrently
    // 2. Asígnale el tipo Prisma.TransactionClient a 'tx'
    user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.users.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
          date_of_birth: dateOfBirth
        }
      });

      await tx.medical_profiles.create({
        data: { user_id: newUser.id }
      });

      return newUser;
    });
  } else {
    // DOCTOR only creates the user directly
    user = await prisma.users.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        date_of_birth: dateOfBirth
      }
    });
  }

  const { password_hash: _, ...safeUser } = user;
  const tokenPayload = { id: safeUser.id, email: safeUser.email, role: safeUser.role };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

  return { user: safeUser, token };
};

export const loginUser = async (data: any) => {
  const user = await prisma.users.findUnique({ where: { email: data.email } });

  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
  if (!isPasswordValid) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const { password_hash: _, ...safeUser } = user;
  const tokenPayload = { id: safeUser.id, email: safeUser.email, role: safeUser.role };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

  return { user: safeUser, token };
};  