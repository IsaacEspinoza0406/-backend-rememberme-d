import prisma from '../../lib/prisma';

export const createSymptom = async (patientId: number, data: any) => {
  return prisma.symptom_entries.create({
    data: {
      patient_id: patientId,
      symptom_name: data.symptom_name,
      severity: Number(data.severity),
      notes: data.notes || null,
      entry_date: new Date(data.entry_date)
    }
  });
};

export const getSymptoms = async (patientId: number) => {
  return prisma.symptom_entries.findMany({
    where: { patient_id: patientId },
    orderBy: { entry_date: 'desc' }
  });
};
