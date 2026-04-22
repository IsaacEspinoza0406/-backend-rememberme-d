import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '../../lib/jwt';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw { statusCode: 400, code: 'EMAIL_IN_USE', message: 'Email is already registered' };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const user = await prisma.users.create({
    data: {
      email: data.email,
      password_hash: hashedPassword,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null
    }
  });

  // Si es paciente, inicializar medical_profile vacío como indica 01_schema.sql (3.2)
  if (user.role === 'PATIENT') {
    await prisma.medical_profiles.create({
      data: { user_id: user.id }
    });
  }

  const token = signToken({ userId: user.id, role: user.role });
  
  return { user, token };
};

export const loginUser = async (data: any) => {
  const user = await prisma.users.findUnique({ where: { email: data.email } });
  
  if (!user) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
  if (!isPasswordValid) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  const token = signToken({ userId: user.id, role: user.role });
  
  return { user, token };
};
