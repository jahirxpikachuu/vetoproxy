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
