'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, AlertTriangle, CheckCircle, Skull } from 'lucide-react';
import { VitalisButton } from '@/components/ui/VitalisButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { api } from '@/lib/api-client';

interface DiagnosticResult {
  severity: 'LOW' | 'MODERATE' | 'CRITICAL' | 'FATAL';
  aiAnalysis: string;
  confidence: number;
}

interface DiagnosticEngineProps {
  selectedPatientId: string | null;
}

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case 'FATAL':
      return {
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/50',
        icon: Skull,
      };
    case 'CRITICAL':
      return {
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/50',
        icon: ShieldAlert,
      };
    case 'MODERATE':
      return {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/50',
        icon: AlertTriangle,
      };
    default:
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/50',
        icon: CheckCircle,
      };
  }
};

export const DiagnosticEngine: React.FC<DiagnosticEngineProps> = ({ selectedPatientId }) => {
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');

  const runDiagnostics = async () => {
    if (!selectedPatientId) {
      setError('Please select a patient first');
      return;
    }

    if (!symptoms.trim()) {
      setError('Please enter clinical observations');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const token = localStorage.getItem('vitalis_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await api.diagnostics.analyze(selectedPatientId, symptoms, token);
      
      setResult({
        severity: response.data.severity,
        aiAnalysis: response.data.aiAnalysis,
        confidence: response.data.confidence * 100,
      });
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const config = result ? getSeverityConfig(result.severity) : null;
  const Icon = config?.icon;

  return (
    <GlassCard className="p-8 flex-1">
      <h3 className="text-lg font-mono mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-cyan-400" /> AI DIAGNOSTIC ENGINE
      </h3>

      {!result ? (
        <div className="space-y-4">
          <textarea
            className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-sm font-mono focus:border-cyan-400 outline-none transition-colors h-32 resize-none text-white placeholder-white/40"
            placeholder="Enter clinical observations... (e.g., 'Patient exhibits lethargy, pale gums, rapid breathing')"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={!selectedPatientId}
          />
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono">
              {error}
            </div>
          )}

          <VitalisButton 
            onClick={runDiagnostics} 
            variant="primary"
          >
            {analyzing ? 'NEURAL PROCESSING...' : 'INITIATE ANALYSIS'}
          </VitalisButton>
          
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-cyan-400 text-sm font-mono"
            >
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              Analyzing neural patterns...
            </motion.div>
          )}
        </div>
      ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border ${config?.borderColor} ${config?.bgColor} p-6 rounded-xl`}
              >
                <div className={`flex items-center gap-2 ${config?.color} font-bold mb-3 text-lg`}>
                  {Icon && <Icon className="w-5 h-5" />}
                  {result.severity}
                </div>
                <p className="font-mono text-sm mb-4 text-white/90">{result.aiAnalysis}</p>
          
          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/40">
              <span>CONFIDENCE LEVEL</span>
              <span>{result.confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${config?.color.replace('text', 'bg')}`}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <VitalisButton variant="primary" onClick={() => alert('Emergency protocol activated')}>
              ACTIVATE PROTOCOL
            </VitalisButton>
            <VitalisButton variant="ghost" onClick={() => { setResult(null); setSymptoms(''); }}>
              RESET
            </VitalisButton>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
};

