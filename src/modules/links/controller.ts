import { Request, Response } from 'express';
import * as service from './service';

export const generate = async (req: Request, res: Response) => {
  try {
    const link = await service.createLink(req.user!.id);
    res.status(201).json(link);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate link' });
  }
};

export const claim = async (req: Request, res: Response) => {
  try {
    const link = await service.claimLink(req.user!.id, req.body.link_code);
    res.status(200).json(link);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Failed to claim link';
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getMyDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await service.getMyDoctor(req.user!.id);
    if (!doctor) {
      return res.status(404).json({ error: 'No doctor linked' });
    }
    res.status(200).json(doctor);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get doctor' });
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await service.getPatients(req.user!.id);
    res.status(200).json(patients);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get patients' });
  }
};

export const getPatientMedications = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id);
    const medications = await service.getPatientMedications(req.user!.id, patientId);
    res.status(200).json(medications);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to get medications' });
  }
};

export const prescribeMedication = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id);
    const medication = await service.prescribeMedication(req.user!.id, patientId, req.body);
    res.status(201).json(medication);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to prescribe medication' });
  }
};

export const deletePatientMedication = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id);
    const medId = parseInt(req.params.medId);
    await service.deletePatientMedication(req.user!.id, patientId, medId);
    res.status(200).json({ message: 'Medication removed' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to remove medication' });
  }
};

export const getPatientSymptoms = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id);
    const symptoms = await service.getPatientSymptoms(req.user!.id, patientId);
    res.status(200).json(symptoms);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Failed to get symptoms' });
  }
};

export const unlink = async (req: Request, res: Response) => {
  try {
    await service.unlink(req.user!.id);
    res.status(200).json({ message: 'Successfully unlinked' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to unlink' });
  }
};
