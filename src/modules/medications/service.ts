import prisma from '../../lib/prisma';

export const getMedications = async (patientId: number) => {
  return prisma.medications.findMany({
    where: { patient_id: patientId, is_active: true }
  });
};

export const createMedication = async (patientId: number, data: any) => {
  return prisma.medications.create({
    data: {
      patient_id: patientId,
      name: data.name,
      dosage: data.dosage,
      frequency_hours: Number(data.frequency_hours),
      start_date: new Date(data.start_date),
      end_date: data.end_date ? new Date(data.end_date) : null,
      instructions: data.instructions || null,
      is_active: true
    }
  });
};
export const getMedicationByIdService = async (id: number, patientId: number) => {
  return prisma.medications.findFirstOrThrow({
    where: { id, patient_id: patientId }
  });
};

export const updateMedicationService = async (id: number, patientId: number, data: any) => {
  return prisma.medications.update({
    where: { id },
    data
  });
};

export const deleteMedicationService = async (id: number, patientId: number) => {
  return prisma.medications.delete({
    where: { id }
  });
};

export const getMedicationById = async (id: number, patientId: number) => {
  return prisma.medications.findFirstOrThrow({
    where: { id, patient_id: patientId }
  });
};

export const updateMedication = async (id: number, patientId: number, data: any) => {
  return prisma.medications.update({
    where: { id },
    data
  });
};

export const deleteMedication = async (id: number, patientId: number) => {
  return prisma.medications.delete({
    where: { id }
  });
};