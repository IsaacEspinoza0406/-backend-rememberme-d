import prisma from '../../lib/prisma';

export const logSymptom = async (patientId: number, data: any) => {
  return prisma.symptom_entries.create({
    data: {
      patient_id: patientId,
      symptom_name: data.symptom_name,
      severity: data.severity,
      notes: data.notes
    }
  });
};

export const getHistory = async (patientId: number) => {
  return prisma.$queryRaw`
    SELECT * FROM rememberme.v_symptom_history
    WHERE patient_id = ${patientId}
    ORDER BY entry_date DESC
  `;
};

export const getHighSeverityAlerts = async (patientId: number) => {
  return prisma.$queryRaw`
    SELECT * FROM rememberme.v_high_severity_alerts
    WHERE patient_id = ${patientId}
    AND entry_date >= CURRENT_DATE - INTERVAL '7 days'
  `;
};
