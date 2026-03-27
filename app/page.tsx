'use client';

import { useState } from 'react';
import type { AppState, AnalyzeResponse } from '@/lib/types';
import { validateSituation } from '@/lib/utils';
import ResultCard from '@/components/ResultCard';
import LoadingSection from '@/components/LoadingSection';
import SupportBanner from '@/components/SupportBanner';

const BG      = "#0d0d0d";
const SURFACE = "#161616";
const BORDER  = "#2a2a2a";
const TEXT    = "#f0f0f0";
const MUTED   = "#666";
const ACCENT  = "#e03030";

export default function Home() {
  const [appState, setAppState] = useState<AppState>({ phase: 'form' });
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState<'Nice' | 'Honest' | 'Brutal'>('Honest');
  const [situationError, setSituationError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateSituation(situation).valid) { setSituationError(true); return; }
    setSituationError(false);
    setAppState({ phase: 'loading' });
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation, values: [], language: 'English', tone }),
      });
      if (res.status === 429) {
        const body = await res.json();
        setAppState({ phase: 'form', error: body.error ?? 'Too many requests. Try again later.' });
        return;
      }
      if (!res.ok) { setAppState({ phase: 'form', error: 'Something went wrong, please try again.' }); return; }
      const data: AnalyzeResponse = await res.json();
      setAppState({ phase: 'result', data });
    } catch {
      setAppState({ phase: 'form', error: 'Network error, please check your connection.' });
    }
  }

  if (appState.phase === 'loading') {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <LoadingSection />
      </main>
    );
  }

  if (appState.phase === 'result') {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>
          <ResultCard data={appState.data} situation={situation} />
          <button
            onClick={() => setAppState({ phase: 'form' })}
            style={{
              marginTop: "12px", width: "100%", padding: "13px",
              borderRadius: "12px", fontWeight: 600, color: MUTED,
              backgroundColor: "transparent", border: `1px solid ${BORDER}`,
              cursor: "pointer", fontSize: "14px",
            }}
          >
            ← Try Again
          </button>
        </div>
      </main>
    );
  }

  const error = appState.phase === 'form' ? appState.error : undefined;

  return (
    <main style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{
            display: "inline-block", padding: "4px 12px", borderRadius: "999px",
            backgroundColor: `${ACCENT}20`, border: `1px solid ${ACCENT}55`,
            color: ACCENT, fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px",
          }}>
            ⚠ AI Threat Assessment
          </div>
          <h1 style={{ color: TEXT, fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 10px" }}>
            How Replaceable<br />Are You?
          </h1>
          <p style={{ color: MUTED, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            Paste your job description. Find out exactly how long you have left.
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: "20px", padding: "12px 16px", borderRadius: "10px",
            backgroundColor: "#1f0000", border: `1px solid ${ACCENT}55`,
            color: "#ff8888", fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          <div>
            <label htmlFor="situation" style={{ display: "block", color: "#777", fontSize: "11px", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Your role &amp; daily tasks
            </label>
            <textarea
              id="situation"
              rows={6}
              value={situation}
              onChange={(e) => {
                setSituation(e.target.value);
                if (situationError && e.target.value.trim()) setSituationError(false);
              }}
              placeholder="I'm a UX designer at a startup. I run user interviews, create wireframes in Figma, write design specs, and present to stakeholders weekly..."
              style={{
                width: "100%", borderRadius: "12px", padding: "14px 16px",
                fontSize: "14px", lineHeight: 1.6, resize: "none", outline: "none",
                backgroundColor: SURFACE, color: TEXT,
                border: `1.5px solid ${situationError ? ACCENT : BORDER}`,
                boxSizing: "border-box",
              }}
            />
            {situationError && (
              <p style={{ marginTop: "6px", fontSize: "12px", color: ACCENT }}>This field is required.</p>
            )}
          </div>

          <div>
            <p style={{ color: "#777", fontSize: "11px", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Tone
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {(["Nice", "Honest", "Brutal"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  style={{
                    padding: "10px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: tone === t ? ACCENT : SURFACE,
                    color: tone === t ? "#fff" : MUTED,
                    border: `1.5px solid ${tone === t ? ACCENT : BORDER}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <p style={{ marginTop: "6px", fontSize: "12px", color: "#444" }}>
              {tone === "Nice" && "Encouraging — we'll find the silver lining."}
              {tone === "Honest" && "Balanced — the truth, no drama."}
              {tone === "Brutal" && "No mercy — maximum existential dread."}
            </p>
          </div>

          <button
            type="submit"
            style={{
              width: "100%", padding: "15px", borderRadius: "12px",
              fontWeight: 700, color: "#fff", fontSize: "15px",
              backgroundColor: ACCENT, border: "none", cursor: "pointer",
              boxShadow: `0 0 20px ${ACCENT}55`,
            }}
          >
            Calculate My Replaceability →
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", color: "#333", fontSize: "12px" }}>
          No data stored. Results are AI-generated and for entertainment purposes.
        </p>

        <div style={{ marginTop: "16px" }}>
          <SupportBanner />
        </div>
      </div>
    </main>
  );
}
