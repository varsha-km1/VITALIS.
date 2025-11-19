'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Thermometer, Droplet, LogOut, Activity } from 'lucide-react';
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
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 flex min-h-screen">
        
        {/* Sidebar Navigation */}
        <motion.aside 
          className="w-64 border-r border-white/10 p-6 flex flex-col justify-between"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              VITALIS.
            </h1>
            <nav className="space-y-2 font-mono text-sm">
              {[
                { name: 'Live Triage', active: false },
                { name: 'Patients', active: true },
                { name: 'AI Diagnostics', active: false },
                { name: 'Genome Seq', active: false },
                { name: 'Settings', active: false }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.active) return;
                    alert(`${item.name} - Coming soon! 🚀\n\nThis feature will be available in the next release.`);
                  }}
                  className={`w-full text-left hover:text-cyan-400 transition-colors flex items-center gap-3 px-3 py-2.5 rounded ${
                    item.active ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20' : 'text-white/50 border border-transparent'
                  }`}
                >
                  <div className="w-1.5 h-1.5 bg-current rounded-full"/> {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            {userData && (
              <div className="p-4 border border-white/5 rounded-lg bg-white/5">
                <p className="text-xs text-white/40 mb-2 uppercase font-mono">Logged In As</p>
                <div className="text-sm font-mono text-white/80">
                  {userData.fullName}
                </div>
                <div className="text-xs font-mono text-cyan-400 mt-1">
                  {userData.role}
                </div>
              </div>
            )}
            <div className="p-4 border border-white/5 rounded-lg bg-white/5">
              <p className="text-xs text-white/40 mb-2 uppercase font-mono">System Status</p>
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-auto">
          
          {/* Patient List Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-lg font-mono mb-4 text-cyan-400">PATIENT REGISTRY</h3>
              <PatientSelector
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={setSelectedPatientId}
              />
            </GlassCard>
            
            {/* AI Insights Stream */}
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"/>
                <h3 className="text-sm font-mono text-cyan-400">AI INSIGHTS STREAM</h3>
              </div>
              <div className="space-y-3 text-xs font-mono max-h-64 overflow-y-auto">
                {[
                  { time: '10:42:15', msg: 'Neural network calibrated. Pattern recognition: 99.4% accuracy.' },
                  { time: '10:42:18', msg: 'Vitals stable. Predicting 99% recovery rate based on trajectory.' },
                  { time: '10:42:22', msg: 'Genetic markers analyzed. No hereditary risk factors detected.' },
                  { time: '10:42:26', msg: 'Medication interaction check: PASS. Safe to administer.' }
                ].map((log, i) => (
                  <div key={i} className="p-3 bg-black/30 rounded border-l-2 border-cyan-400/50">
                    <div className="text-cyan-400 mb-1">{log.time}</div>
                    <div className="text-white/70">{log.msg}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-red-500/10 border-l-2 border-red-500 rounded text-xs space-y-2">
                <div className="text-red-400 font-bold uppercase">Critical Alerts</div>
                <div className="text-red-300">ICU-2: Patient requires attention</div>
                <div className="text-yellow-300">Lab results pending (3)</div>
              </div>
            </GlassCard>
          </aside>

          {/* Main Content - Patient Details & Diagnostics */}
          <main className="flex-1 space-y-6 min-w-0">
            {/* Active Patient Card */}
            {selectedPatient && (
              <GlassCard className="p-6" hover={false}>
                <div className="absolute top-4 right-4 text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  ACTIVE
                </div>
                <h2 className="text-xl font-light mb-2">
                  Patient: <span className="font-bold text-cyan-400">{selectedPatient.name}</span>
                </h2>
                <p className="text-sm text-white/50 mb-6">
                  {selectedPatient.species} • {selectedPatient.breed} • Age: {selectedPatient.age} • Owner: {selectedPatient.ownerName}
                </p>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    icon={Heart}
                    label="Heart Rate"
                    value="120"
                    unit="BPM"
                    color="text-green-400"
                  />
                  <MetricCard
                    icon={Activity}
                    label="O2 SAT"
                    value="98"
                    unit="%"
                    color="text-blue-400"
                  />
                  <MetricCard
                    icon={Thermometer}
                    label="Temp"
                    value="102.5"
                    unit="°F"
                    color="text-yellow-400"
                  />
                  <MetricCard
                    icon={Droplet}
                    label="Hydration"
                    value="85"
                    unit="%"
                    color="text-cyan-400"
                  />
                </div>
              </GlassCard>
            )}

            {/* AI Diagnostic Engine */}
            <DiagnosticEngine selectedPatientId={selectedPatientId} />
          </main>
        </div>
      </div>
    </main>
  );
}
