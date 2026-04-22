import prisma from '../../lib/prisma';
import crypto from 'crypto';

const generateCode = () => crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 8);

export const createLink = async (doctorId: number) => {
  const code = generateCode();
  return prisma.doctor_patient_links.create({
    data: {
      doctor_id: doctorId,
      link_code: code,
      status: 'pending'
    }
  });
};

export const claimLink = async (patientId: number, code: string) => {
  const link = await prisma.doctor_patient_links.findUnique({
    where: { link_code: code }
  });

  if (!link || link.status !== 'pending') {
    throw { statusCode: 400, message: 'Invalid or expired code' };
  }

  return prisma.doctor_patient_links.update({
    where: { id: link.id },
    data: { patient_id: patientId, status: 'active' }
  });
};
