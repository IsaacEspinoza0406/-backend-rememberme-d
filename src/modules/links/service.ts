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

export const getMyDoctor = async (patientId: number) => {
  const link = await prisma.doctor_patient_links.findFirst({
    where: { patient_id: patientId, status: 'active' }
  });
  if (!link) return null;

  const doctor = await prisma.users.findUnique({
    where: { id: link.doctor_id }
  });
  if (!doctor) return null;

  return {
    link_id: link.id,
    doctor_id: link.doctor_id,
    full_name: doctor.full_name,
    email: doctor.email,
    linked_at: link.created_at,
    status: link.status
  };
};

export const getPatients = async (doctorId: number) => {
  const links = await prisma.doctor_patient_links.findMany({
    where: { doctor_id: doctorId, status: 'active' }
  });

  const results = [];
  for (const link of links) {
    if (!link.patient_id) continue;
    const patient = await prisma.users.findUnique({
      where: { id: link.patient_id }
    });
    if (!patient) continue;

    // Count active medications
    const medsCount = await prisma.medications.count({
      where: { patient_id: link.patient_id, is_active: true }
    });

    // Get medical profile for chronic conditions
    const profile = await prisma.medical_profiles.findUnique({
      where: { user_id: link.patient_id }
    });

    // Get last symptom date
    const lastSymptom = await prisma.symptom_entries.findFirst({
      where: { patient_id: link.patient_id },
      orderBy: { entry_date: 'desc' }
    });

    // Fetch adherence
    const adherenceResult = await prisma.$queryRaw<any[]>`
      SELECT adherence_pct FROM rememberme.v_patient_adherence WHERE patient_id = ${link.patient_id}
    `;
    const adherence_pct = adherenceResult.length > 0 ? Number(adherenceResult[0].adherence_pct) : 100;

    // Fetch streak
    const streakResult = await prisma.$queryRaw<any[]>`
      SELECT streak, is_active FROM rememberme.v_adherence_streak WHERE patient_id = ${link.patient_id}
    `;
    const streak = streakResult.length > 0 && streakResult[0].is_active ? Number(streakResult[0].streak) : 0;

    // Check for high severity symptoms in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const highSeverityCount = await prisma.symptom_entries.count({
      where: {
        patient_id: link.patient_id,
        severity: { gte: 8 },
        entry_date: { gte: sevenDaysAgo }
      }
    });

    results.push({
      link_id: link.id,
      patient_id: link.patient_id,
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      linked_at: link.created_at,
      adherence_pct: adherence_pct,
      streak: streak,
      chronic_conditions: profile?.chronic_conditions || 'Sin condiciones registradas',
      high_severity_alert: highSeverityCount > 0,
      active_meds_count: medsCount,
      last_symptom_date: lastSymptom?.entry_date?.toISOString()?.slice(0, 10) || null,
      allergies: profile?.allergies || null,
      emergency_contact_name: profile?.emergency_contact_name || null,
      emergency_contact_phone: profile?.emergency_contact_phone || null
    });
  }

  return results;
};

export const checkLink = async (doctorId: number, patientId: number) => {
  const link = await prisma.doctor_patient_links.findFirst({
    where: { doctor_id: doctorId, patient_id: patientId, status: 'active' }
  });
  if (!link) {
    throw { statusCode: 403, message: 'You are not linked to this patient' };
  }
  return link;
};

export const getPatientMedications = async (doctorId: number, patientId: number) => {
  await checkLink(doctorId, patientId);
  return prisma.medications.findMany({
    where: { patient_id: patientId, is_active: true },
    orderBy: { created_at: 'desc' }
  });
};

export const prescribeMedication = async (doctorId: number, patientId: number, data: any) => {
  await checkLink(doctorId, patientId);
  const medication = await prisma.medications.create({
    data: {
      patient_id: patientId,
      name: data.name,
      dosage: data.dosage,
      frequency_hours: data.frequency_hours,
      start_date: new Date(data.start_date),
      end_date: data.end_date ? new Date(data.end_date) : null,
      instructions: data.instructions,
      is_active: true
    }
  });

  const { generateIntakeLogs } = require('../medications/service');
  await generateIntakeLogs(medication);

  return medication;
};

export const deletePatientMedication = async (doctorId: number, patientId: number, medicationId: number) => {
  await checkLink(doctorId, patientId);
  return prisma.medications.updateMany({
    where: { id: medicationId, patient_id: patientId },
    data: { is_active: false }
  });
};

export const getPatientSymptoms = async (doctorId: number, patientId: number) => {
  await checkLink(doctorId, patientId);
  return prisma.symptom_entries.findMany({
    where: { patient_id: patientId },
    orderBy: { entry_date: 'desc' },
    take: 50
  });
};

export const unlink = async (patientId: number) => {
  return prisma.doctor_patient_links.updateMany({
    where: { patient_id: patientId, status: 'active' },
    data: { status: 'revoked' }
  });
};
