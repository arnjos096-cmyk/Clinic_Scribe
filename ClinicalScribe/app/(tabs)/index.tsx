import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';

interface SoapSection {
  title: string;
  delay: number;
  content: string;
  confidence?: {
    migraine: number;
    hypertension: number;
  };
}

interface ConfidenceProps {
  label: string;
  value: number;
}

interface CardProps {
  title: string;
  children: React.ReactNode;
}

import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

/* ------------------ FAKE AI DATA ------------------ */

const SOAP_SECTIONS = [
  {
    title: 'SUBJECTIVE',
    delay: 1000,
    content:
      'Patient is a 45-year-old male with throbbing left-sided headache for 3 days. Associated nausea and photophobia. Minimal relief with OTC Ibuprofen.',
  },
  {
    title: 'OBJECTIVE',
    delay: 1200,
    content:
      'BP 130/85 mmHg, HR 78 bpm. Cranial nerves II–XII intact. No neck stiffness. PERRLA.',
  },
  {
    title: 'ASSESSMENT',
    delay: 1500,
    content:
      '1. Acute Migraine without aura.\n2. Mild hypertension likely secondary to pain.',
    confidence: {
      migraine: 0.82,
      hypertension: 0.61,
    },
  },
  {
    title: 'PLAN',
    delay: 1300,
    content:
      'Sumatriptan 50mg PO PRN. Rest in dark room. Hydration. Follow-up if symptoms persist.',
  },
];

const DIFFERENTIALS = [
  { name: 'Migraine', status: 'Likely' },
  { name: 'Tension Headache', status: 'Ruled Out' },
  { name: 'Stroke', status: 'Ruled Out' },
  { name: 'Sinusitis', status: 'Unlikely' },
];

const TIMELINE = [
  '00:00 – Headache onset described',
  '00:22 – Nausea reported',
  '00:45 – Photophobia mentioned',
  '01:10 – OTC medication ineffective',
];

const SAFETY_CHECKS = [
  '✓ No contraindicated medications detected',
  '⚠ Allergies not mentioned – verify',
  '✓ Neurological red flags absent',
];

/* ------------------ APP ------------------ */

export default function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [sections, setSections] = useState<SoapSection[]>([]);
  const [currentStep, setCurrentStep] = useState('');

  async function pickAudio() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.canceled) return;

      simulateAI();
    } catch (e) {
      Alert.alert('Error', 'File selection failed');
    }
  }

  async function simulateAI() {
    setLoading(true);
    setSections([]);
    setStatus('Uploading audio...');
    setCurrentStep('');

    await wait(1000);
    setStatus('Transcribing speech...');
    await wait(1200);

    for (let section of SOAP_SECTIONS) {
      setCurrentStep(`Analyzing ${section.title.toLowerCase()}...`);
      await wait(section.delay);
      setSections((prev) => [...prev, section]);
    }

    setStatus('Completed');
    setCurrentStep('');
    setLoading(false);
  }

  return (
    <LinearGradient
      colors={['#e0f2ff', '#f9fbff', '#eef6ff']}
      style={styles.container}
    >
      <Text style={styles.title}>ClinAI Assistant</Text>
      <Text style={styles.subtitle}>Ambient Clinical Intelligence</Text>

      <Text style={styles.status}>{status}</Text>
      {currentStep ? <Text style={styles.step}>{currentStep}</Text> : null}

      <Button title="Select Patient Audio" onPress={pickAudio} disabled={loading} />

      {loading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

      <ScrollView style={{ marginTop: 20 }}>
        {sections.map((s, i) => (
          <View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor:
                  s.title === 'ASSESSMENT'
                    ? '#fff7ed'
                    : s.title === 'PLAN'
                    ? '#ecfeff'
                    : '#ffffff',
                borderLeftWidth: 5,
                borderLeftColor:
                  s.title === 'ASSESSMENT'
                    ? '#fb923c'
                    : s.title === 'PLAN'
                    ? '#06b6d4'
                    : '#007AFF',
              },
            ]}
          >
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardText}>{s.content}</Text>

            {s.confidence && (
              <View style={{ marginTop: 10 }}>
                <Text>Diagnostic Confidence</Text>
                <Confidence label="Migraine" value={s.confidence.migraine} />
                <Confidence label="Hypertension" value={s.confidence.hypertension} />
              </View>
            )}
          </View>
        ))}

        {sections.length === SOAP_SECTIONS.length && (
          <>
            <Card title="Differential Diagnosis">
              {DIFFERENTIALS.map((d, i) => (
                <Text key={i}>
                  {d.status === 'Likely' ? '✓' : '✗'} {d.name} — {d.status}
                </Text>
              ))}
            </Card>

            <Card title="Encounter Timeline">
              {TIMELINE.map((t, i) => (
                <Text key={i}>{t}</Text>
              ))}
            </Card>

            <Card title="Clinical Safety Check">
              {SAFETY_CHECKS.map((c, i) => (
                <Text key={i}>{c}</Text>
              ))}
            </Card>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

/* ------------------ COMPONENTS ------------------ */

function Confidence({ label, value }: ConfidenceProps) {
  return (
    <View style={{ marginVertical: 4 }}>
      <Text>{label}: {(value * 100).toFixed(0)}%</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${value * 100}%` }]} />
      </View>
    </View>
  );
}

function Card({ title, children }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#ffffff',
          borderLeftWidth: 5,
          borderLeftColor: '#6366f1',
        },
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  subtitle: { fontSize: 16, marginBottom: 10 },
  status: { fontStyle: 'italic', color: '#666' },
  step: { color: '#007AFF', marginBottom: 14 },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardText: { fontSize: 15, lineHeight: 22 },
  barBg: {
    height: 14,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: '#007AFF',
  },
});