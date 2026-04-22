import prisma from '../../lib/prisma';

export const getMedicalProfile = async (userId: number) => {
  const profile = await prisma.medical_profiles.findUnique({
    where: { user_id: userId }
  });
  if (!profile) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Medical profile not found' };
  }
  return profile;
};

export const updateMedicalProfile = async (userId: number, data: any) => {
  return prisma.medical_profiles.update({
    where: { user_id: userId },
    data
  });
};
