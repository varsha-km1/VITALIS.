'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Heart, Thermometer, Droplet, LogOut } from 'lucide-react';
import { VitalisButton } from '@/components/ui/VitalisButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { DiagnosticEngine } from '@/components/dashboard/DiagnosticEngine';
import { PatientSelector } from '@/components/dashboard/PatientSelector';
import { api } from '@/lib/api-client';

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

    // Fetch patients
    api.patients.getAll(token)
      .then(data => {
        setPatients(data);
        if (data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      })
      .catch(() => {
        localStorage.removeItem('vitalis_token');
        localStorage.removeItem('vitalis_user');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('vitalis_token');
    localStorage.removeItem('vitalis_user');
    router.push('/login');
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-sm flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          Loading Vitalis OS...
        </div>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Background Grid Mesh */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 p-12 grid grid-cols-12 gap-8 min-h-screen">
        
        {/* Sidebar / Nav */}
        <motion.aside 
          className="col-span-2 border-r border-white/10 pr-8 flex flex-col justify-between"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              VITALIS.
            </h1>
            <nav className="space-y-6 font-mono text-sm text-white/50">
              {['Live Triage', 'Patients', 'AI Diagnostics', 'Genome Seq', 'Settings'].map((item) => (
                <div key={item} className="hover:text-cyan-400 cursor-pointer transition-colors flex items-center gap-4">
                  <div className="w-1 h-1 bg-current rounded-full"/> {item}
                </div>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            {userData && (
              <div className="p-4 border border-white/5 rounded-lg bg-white/5">
                <p className="text-xs text-white/40 mb-2">LOGGED IN AS</p>
                <div className="text-xs font-mono text-white/80">
                  {userData.fullName}
                </div>
                <div className="text-xs font-mono text-cyan-400">
                  {userData.role}
                </div>
              </div>
            )}
            <div className="p-4 border border-white/5 rounded-lg bg-white/5">
              <p className="text-xs text-white/40 mb-2">SYSTEM STATUS</p>
              <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                OPERATIONAL
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-white/60 hover:text-white text-sm font-mono"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </motion.aside>

        {/* Main Content - Patient Selection */}
        <section className="col-span-3 flex flex-col gap-8">
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-lg font-mono mb-4 text-cyan-400">PATIENT REGISTRY</h3>
            <PatientSelector
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={setSelectedPatientId}
            />
          </GlassCard>
        </section>

        {/* Right Section - Active Patient & Diagnostics */}
        <section className="col-span-6 flex flex-col gap-8">
          {/* Active Patient Card */}
          {selectedPatient && (
            <GlassCard className="p-8" hover={false}>
              <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400 animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                ACTIVE
              </div>
              <h2 className="text-2xl font-light mb-2">
                Patient: <span className="font-bold text-cyan-400">{selectedPatient.name}</span>
              </h2>
              <p className="text-white/60 max-w-md mb-6 text-sm">
                {selectedPatient.species} • {selectedPatient.breed || 'Unknown breed'} • Age: {selectedPatient.age || 'Unknown'}
                <br />
                Owner: {selectedPatient.ownerName}
              </p>

              {/* Vitals Grid */}
              <div className="grid grid-cols-4 gap-4">
                <MetricCard label="Heart Rate" value="120" unit="BPM" icon={Heart} color="text-life-green" />
                <MetricCard label="O2 Sat" value="98" unit="%" icon={Activity} color="text-cyan-400" />
                <MetricCard label="Temp" value="102.5" unit="°F" icon={Thermometer} color="text-yellow-400" />
                <MetricCard label="Hydration" value="85" unit="%" icon={Droplet} color="text-blue-400" />
              </div>
            </GlassCard>
          )}

          {/* AI Diagnostic Module */}
          <DiagnosticEngine selectedPatientId={selectedPatientId} />
        </section>

        {/* AI Sidebar - System Logs */}
        <aside className="col-span-3 border-l border-white/10 pl-8 flex flex-col gap-6">
          <div>
            <h3 className="font-mono text-xs text-cyan-400 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              AI INSIGHTS STREAM
            </h3>
            <div className="space-y-4">
              {[
                { time: '10:42:15', message: 'Neural network calibrated. Pattern recognition: 99.4% accuracy.' },
                { time: '10:42:18', message: 'Vitals stable. Predicting 99% recovery rate based on trajectory.' },
                { time: '10:42:22', message: 'Genetic markers analyzed. No hereditary risk factors detected.' },
                { time: '10:42:26', message: 'Medication interaction check: PASS. Safe to administer.' },
              ].map((log, i) => (
                <motion.div 
                  key={i}
                  className="p-4 rounded-lg bg-white/5 border border-white/5 text-xs text-white/70"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                >
                  <span className="text-cyan-500 block mb-1 font-mono">{log.time}</span>
                  {log.message}
                </motion.div>
              ))}
            </div>
          </div>

          <GlassCard className="p-6" hover={false}>
            <h3 className="text-xs font-mono text-white/40 mb-4 uppercase">Critical Alerts</h3>
            <div className="space-y-2">
              <div className="text-xs font-mono text-red-400 border-l-2 border-red-400 pl-3 py-1">
                ICU-2: Patient requires attention
              </div>
              <div className="text-xs font-mono text-yellow-400 border-l-2 border-yellow-400 pl-3 py-1">
                Lab results pending (3)
              </div>
            </div>
          </GlassCard>
        </aside>

      </div>
    </main>
  );
}

