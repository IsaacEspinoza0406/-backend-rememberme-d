import prisma from '../../lib/prisma';

export const getMedications = async (patientId: number) => {
  return prisma.medications.findMany({
    where: { patient_id: patientId, is_active: true }
  });
};

export const createMedication = async (patientId: number, data: any) => {
  const medication = await prisma.medications.create({
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

  // Generate intake logs for today and next 7 days (plus yesterday if relevant)
  await generateIntakeLogs(medication);

  return medication;
};

export async function generateIntakeLogs(med: any) {
  const startDate = new Date(med.start_date);
  const freq = med.frequency_hours;
  const logs = [];

  // Generate logs for 10 days starting from the earliest of (today, startDate, yesterday)
  const today = new Date();
  const startGenerating = new Date(Math.min(startDate.getTime(), today.getTime() - 86400000));
  
  for (let d = 0; d < 10; d++) {
    const currentDate = new Date(startGenerating.getTime() + d * 86400000);
    
    // If before start_date or after end_date, skip
    if (currentDate < startDate) continue;
    if (med.end_date && currentDate > new Date(med.end_date)) continue;

    // Daily slots based on frequency
    const slotsPerDay = Math.floor(24 / freq);
    for (let i = 0; i < slotsPerDay; i++) {
      const hour = i * freq;
      // We'll store the time as a 24h string for the Time() column
      const timeStr = `${hour.toString().padStart(2, '0')}:00:00`;
      
      // Slot time for comparison (to skip past slots of today if start date is today)
      const slotTime = new Date(currentDate);
      slotTime.setHours(hour, 0, 0, 0);

      logs.push({
        medication_id: med.id,
        scheduled_date: currentDate,
        scheduled_time: slotTime, // Prisma will handle the conversion
        status: 'pending' as any
      });
    }
  }

  if (logs.length > 0) {
    await prisma.intake_logs.createMany({
      data: logs,
      skipDuplicates: true
    });
  }
}

export const getMedicationById = async (id: number, patientId: number) => {
  return prisma.medications.findFirstOrThrow({
    where: { id, patient_id: patientId }
  });
};

export const updateMedication = async (id: number, patientId: number, data: any) => {
  return prisma.medications.updateMany({
    where: { id, patient_id: patientId },
    data
  });
};

export const deleteMedication = async (id: number, patientId: number) => {
  return prisma.medications.updateMany({
    where: { id, patient_id: patientId },
    data: { is_active: false }
  });
};