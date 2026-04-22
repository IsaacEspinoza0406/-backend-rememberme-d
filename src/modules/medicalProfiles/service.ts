import prisma from '../../lib/prisma';

export const getProfile = async (userId: number) => {
  return prisma.medical_profiles.findUnique({
    where: { user_id: userId }
  });
};

export const updateProfile = async (userId: number, data: any) => {
  return prisma.medical_profiles.update({
    where: { user_id: userId },
    data
  });
};