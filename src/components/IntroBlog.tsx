import React, { useState } from "react";
import { GENOME_TARGETS } from "../lib/genomePack";
import type { TissueTarget } from "../lib/genomePack"; // Fixed type import

interface IntroBlogProps {
  onSequenceSelect: (seq: string) => void;
}

export default function IntroBlog({ onSequenceSelect }: IntroBlogProps) {
  const [selectedTarget, setSelectedTarget] = useState<TissueTarget | null>(null);

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = GENOME_TARGETS.find((t) => t.id === e.target.value);
    setSelectedTarget(target || null);
    
    if (target && target.isEditable) {
      onSequenceSelect(target.sequence);
    }
  };

  return (
    <div className="intro-blog-flow">
      {/* SECTION 1: THE "WHAT" - Visual Hook */}
      <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #368cff' }}>
        <div className="card-header">
          <div className="kicker" style={{ color: '#368cff', fontWeight: 'bold', fontSize: '0.7rem' }}>CRISPR 101</div>
          <h2 style={{ marginTop: '0.2rem', fontSize: '1.4rem' }}>The Molecular Stapler</h2>
        </div>
        <div className="card-body">
          <p className="muted" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            Imagine your DNA is a giant book of instructions. Sometimes, a page has a typo that causes disease. 
            <strong> CRISPR-Cas9</strong> is a biological tool that can find that specific page and cut it out.
          </p>
          
          <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1.5rem', textAlign: 'center' }}>
            <div className="step">
              <div style={{ fontSize: '1.2rem' }}>🔍</div>
              <div className="small bold">1. Search</div>
              <p className="extra-small muted">gRNA finds the exact DNA "address."</p>
            </div>
            <div className="step">
              <div style={{ fontSize: '1.2rem' }}>✂️</div>
              <div className="small bold">2. Cut</div>
              <p className="extra-small muted">Cas9 scissors make two precise breaks.</p>
            </div>
            <div className="step">
              <div style={{ fontSize: '1.2rem' }}>🧬</div>
              <div className="small bold">3. Delete</div>
              <p className="extra-small muted">The cell repairs the gap, removing the segment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE TARGET SELECTOR */}
      <div className="card target-panel" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)' }}>
        <div className="card-header">
          <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', opacity: 0.8 }}>
            Interactive Lab: Select a Disease
          </h3>
        </div>

        <div className="card-body">
          <select 
            className="dna-input" 
            style={{ height: 'auto', padding: '12px', marginBottom: '1.5rem', cursor: 'pointer', width: '100%', background: '#1a1b23', border: '1px solid #333', color: 'white' }}
            onChange={handleTargetChange}
            value={selectedTarget?.id || ""}
          >
            <option value="">-- Start by choosing a target --</option>
            {GENOME_TARGETS.map(t => (
              <option key={t.id} value={t.id}>{t.organ} — {t.geneName}</option>
            ))}
          </select>

          {selectedTarget ? (
            <div className="target-details animate-in">
              {/* Clinical Card */}
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedTarget.organ}</h3>
                  <span style={{ fontSize: '0.7rem', color: selectedTarget.isEditable ? '#28d2be' : '#ef4444' }}>
                    ● {selectedTarget.difficulty} FEASIBILITY
                  </span>
                </div>
                
                {/* Description added here */}
                <p className="small muted" style={{ marginTop: '10px', lineHeight: '1.4' }}>
                  {selectedTarget.description || "Loading target specifications..."}
                </p>

                {selectedTarget.warning && (
                  <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '2px solid #ef4444', fontSize: '0.75rem', color: '#ff8080' }}>
                    ⚠️ {selectedTarget.warning}
                  </div>
                )}
              </div>

              {/* Technical Stats */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="stat-card" style={{ padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                  <span className="muted small uppercase" style={{ fontSize: '0.6rem', display: 'block' }}>Delivery Method</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{selectedTarget.deliveryMethod}</span>
                </div>
                {/* Strategy added here */}
                <div className="stat-card" style={{ padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                  <span className="muted small uppercase" style={{ fontSize: '0.6rem', display: 'block' }}>Scientific Strategy</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#368cff' }}>{selectedTarget.strategy || "N/A"}</span>
                </div>
                <div className="stat-card" style={{ padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                  <span className="muted small uppercase" style={{ fontSize: '0.6rem', display: 'block' }}>Gene Name</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{selectedTarget.geneName}</span>
                </div>
                <div className="stat-card" style={{ padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                  <span className="muted small uppercase" style={{ fontSize: '0.6rem', display: 'block' }}>Target Status</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{selectedTarget.isEditable ? 'Valid' : 'Blocked'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-text" style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
              <p className="small">Please select a clinical model to view genomic strategy...</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: MINI GLOSSARY */}
      <div style={{ marginTop: '1.5rem', padding: '0 10px' }}>
        <h4 className="small muted" style={{ borderBottom: '1px solid #333', paddingBottom: '5px' }}>Quick Definitions</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          <div className="tag-alt" title="Guide RNA"><strong>gRNA:</strong> The GPS</div>
          <div className="tag-alt" title="The Protein Scissors"><strong>Cas9:</strong> The Scissors</div>
          <div className="tag-alt" title="Protospacer Adjacent Motif"><strong>PAM:</strong> The "Start" Signal</div>
        </div>
      </div>
    </div>
  );
}