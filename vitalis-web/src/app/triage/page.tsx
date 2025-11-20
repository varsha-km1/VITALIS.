'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Heart, Activity, ArrowLeft, User } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

// Mock triage data (in production, this would come from API)
const initialTriageQueue = [
  {
    id: '1',
    patientName: 'Bella',
    species: 'Canine',
    breed: 'Labrador',
    ownerName: 'Sarah Johnson',
    priority: 'CRITICAL',
    reason: 'Severe bleeding, hit by car',
    vitalSigns: { hr: 145, temp: 99.8, resp: 35 },
    waitTime: 2,
    arrivalTime: '10:45 AM',
  },
  {
    id: '2',
    patientName: 'Whiskers',
    species: 'Feline',
    breed: 'Persian',
    ownerName: 'Michael Chen',
    priority: 'URGENT',
    reason: 'Difficulty breathing, coughing',
    vitalSigns: { hr: 180, temp: 103.2, resp: 45 },
    waitTime: 8,
    arrivalTime: '10:39 AM',
  },
  {
    id: '3',
    patientName: 'Max',
    species: 'Canine',
    breed: 'Golden Retriever',
    ownerName: 'Emily Rodriguez',
    priority: 'URGENT',
    reason: 'Vomiting, lethargy',
    vitalSigns: { hr: 110, temp: 102.5, resp: 28 },
    waitTime: 15,
    arrivalTime: '10:32 AM',
  },
  {
    id: '4',
    patientName: 'Luna',
    species: 'Feline',
    breed: 'Siamese',
    ownerName: 'David Kim',
    priority: 'STANDARD',
    reason: 'Annual checkup, vaccinations',
    vitalSigns: { hr: 140, temp: 101.5, resp: 25 },
    waitTime: 22,
    arrivalTime: '10:25 AM',
  },
  {
    id: '5',
    patientName: 'Rocky',
    species: 'Canine',
    breed: 'German Shepherd',
    ownerName: 'Jennifer Lee',
    priority: 'STANDARD',
    reason: 'Limping, possible sprain',
    vitalSigns: { hr: 95, temp: 101.8, resp: 22 },
    waitTime: 30,
    arrivalTime: '10:17 AM',
  },
];

export default function TriagePage() {
  const router = useRouter();
  const [triageQueue, setTriageQueue] = useState(initialTriageQueue);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('vitalis_token');
    const user = localStorage.getItem('vitalis_user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (user) {
      setUserData(JSON.parse(user));
    }

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      setTriageQueue((prev) =>
        prev.map((patient) => ({
          ...patient,
          waitTime: patient.waitTime + 1,
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-400 border-red-400 bg-red-500/10';
      case 'URGENT':
        return 'text-orange-400 border-orange-400 bg-orange-500/10';
      case 'STANDARD':
        return 'text-green-400 border-green-400 bg-green-500/10';
      default:
        return 'text-gray-400 border-gray-400 bg-gray-500/10';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return '🚨';
      case 'URGENT':
        return '⚠️';
      default:
        return '✅';
    }
  };

  const handleAdmit = (patientId: string) => {
    setTriageQueue((prev) => prev.filter((p) => p.id !== patientId));
    alert('Patient admitted to treatment room! 🏥');
  };

  const stats = {
    total: triageQueue.length,
    critical: triageQueue.filter((p) => p.priority === 'CRITICAL').length,
    urgent: triageQueue.filter((p) => p.priority === 'URGENT').length,
    avgWaitTime: Math.round(
      triageQueue.reduce((acc, p) => acc + p.waitTime, 0) / triageQueue.length
    ),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Background Grid */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                LIVE TRIAGE
              </h1>
              <p className="text-sm text-white/50 font-mono mt-1">
                Real-time emergency queue management
              </p>
            </div>
          </div>
          {userData && (
            <div className="text-right text-sm font-mono">
              <div className="text-white/60">{userData.fullName}</div>
              <div className="text-cyan-400">{userData.role}</div>
            </div>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/40 uppercase mb-1">Total Queue</div>
                <div className="text-3xl font-bold text-cyan-400">{stats.total}</div>
              </div>
              <User className="w-8 h-8 text-cyan-400/50" />
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/40 uppercase mb-1">Critical Cases</div>
                <div className="text-3xl font-bold text-red-400">{stats.critical}</div>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400/50" />
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/40 uppercase mb-1">Urgent Cases</div>
                <div className="text-3xl font-bold text-orange-400">{stats.urgent}</div>
              </div>
              <Activity className="w-8 h-8 text-orange-400/50" />
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/40 uppercase mb-1">Avg Wait Time</div>
                <div className="text-3xl font-bold text-white">
                  {stats.avgWaitTime}
                  <span className="text-sm text-white/50 ml-1">min</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-white/50" />
            </div>
          </GlassCard>
        </div>

        {/* Triage Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-mono text-cyan-400">PATIENT QUEUE</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              LIVE
            </div>
          </div>

          {triageQueue.length === 0 ? (
            <GlassCard className="p-12 text-center" hover={false}>
              <div className="text-white/40 text-lg">
                ✅ No patients in queue - All clear!
              </div>
            </GlassCard>
          ) : (
            triageQueue.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 hover:bg-white/10 transition-all" hover>
                  <div className="flex items-start gap-6">
                    {/* Priority Badge */}
                    <div className="flex-shrink-0">
                      <div
                        className={`px-4 py-2 rounded-lg border-2 font-mono text-sm font-bold ${getPriorityColor(
                          patient.priority
                        )}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{getPriorityIcon(patient.priority)}</span>
                          {patient.priority}
                        </div>
                      </div>
                      <div className="text-center mt-2 text-xs text-white/40 font-mono">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-cyan-400">
                            {patient.patientName}
                          </h3>
                          <p className="text-sm text-white/60">
                            {patient.species} • {patient.breed} • Owner: {patient.ownerName}
                          </p>
                        </div>
                        <div className="text-right text-xs font-mono">
                          <div className="text-white/40">Arrived</div>
                          <div className="text-white/80">{patient.arrivalTime}</div>
                          <div className="text-orange-400 mt-1">
                            Waiting: {patient.waitTime} min
                          </div>
                        </div>
                      </div>

                      {/* Chief Complaint */}
                      <div className="mb-4 p-3 bg-black/30 rounded-lg border-l-2 border-cyan-400">
                        <div className="text-xs text-white/40 uppercase mb-1">
                          Chief Complaint
                        </div>
                        <div className="text-sm text-white/90">{patient.reason}</div>
                      </div>

                      {/* Vital Signs */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-white/60">HR:</span>
                          <span className="font-mono text-white">
                            {patient.vitalSigns.hr} bpm
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="w-4 h-4 text-blue-400" />
                          <span className="text-white/60">Resp:</span>
                          <span className="font-mono text-white">
                            {patient.vitalSigns.resp}/min
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">Temp:</span>
                          <span className="font-mono text-white">
                            {patient.vitalSigns.temp}°F
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAdmit(patient.id)}
                          className="px-6 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm font-mono text-cyan-400"
                        >
                          ADMIT TO TREATMENT
                        </button>
                        <button
                          onClick={() => setSelectedPatient(patient.id)}
                          className="px-6 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm font-mono text-white/80"
                        >
                          VIEW DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>

        {/* System Status */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3 text-sm font-mono">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-green-400">TRIAGE SYSTEM OPERATIONAL</span>
            <span className="text-white/40 ml-auto">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

