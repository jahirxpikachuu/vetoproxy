import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state";
import { compilePolicy } from "../api";
import PolicyForm from "../components/PolicyForm";

export default function Policy() {
  const { currentPolicy, setPolicy } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCompile(rawText) {
    setIsLoading(true);
    setError(null);
    try {
      const data = await compilePolicy(rawText);
      // Backend returns { compiled_rules: [...], raw_input: "..." }
      // Normalize into a shape the rest of the app can use
      setPolicy({
        rules: data.compiled_rules,
        raw_input: data.raw_input,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }}>
      {/* Hero */}
      <div style={{ marginBottom: 36, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase", color: "#374151", marginBottom: 14 }}>
          VetoProxy — Governance Engine
        </p>
        <h2 style={{ fontSize: 34, fontWeight: 700, color: "rgba(249,250,251,0.6)", letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0 }}>
          Turn principles into<br />enforceable votes.
        </h2>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "14px 18px", marginBottom: 24, color: "#fca5a5", fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      <PolicyForm
        onCompile={handleCompile}
        compiledRules={currentPolicy?.rules ?? null}
        isLoading={isLoading}
      />
    </div>
  );
}
