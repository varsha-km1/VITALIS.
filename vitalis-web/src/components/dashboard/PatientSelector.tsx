'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  ownerName: string;
}

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  return (
    <div className="space-y-3">
      {patients.length === 0 ? (
        <div className="text-white/40 text-sm font-mono text-center py-8">
          No patients found
        </div>
      ) : (
        patients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectPatient(patient.id)}
            className={`
              p-4 rounded-lg cursor-pointer border transition-all
              ${
                selectedPatientId === patient.id
                  ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)]'
                  : 'border-white/10 hover:bg-white/5 hover:border-white/20'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                p-2 rounded-lg
                ${selectedPatientId === patient.id ? 'bg-cyan-500/20' : 'bg-white/5'}
              `}>
                <User className={`w-4 h-4 ${selectedPatientId === patient.id ? 'text-cyan-400' : 'text-white/50'}`} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white mb-1">{patient.name}</div>
                <div className="text-xs text-white/50 space-y-1">
                  <div>{patient.species} {patient.breed ? `• ${patient.breed}` : ''}</div>
                  <div>Age: {patient.age || 'Unknown'} • Owner: {patient.ownerName}</div>
                </div>
              </div>
              {selectedPatientId === patient.id && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

