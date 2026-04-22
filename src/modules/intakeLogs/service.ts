import prisma from '../../lib/prisma';

export const getTodayIntakes = async (patientId: number) => {
  return prisma.$queryRaw`
    SELECT * FROM rememberme.v_today_intake
    WHERE patient_id = ${patientId}
  `;
};

export const confirmIntake = async (intakeId: number) => {
  return prisma.intake_logs.update({
    where: { id: intakeId },
    data: { 
      status: 'taken',
      taken_at: new Date()
    }
  });
};
