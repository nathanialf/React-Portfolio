'use client';

import { useState } from 'react';
import { IconLock, IconExternalLink, IconBrandGithub, IconShield, IconRss } from '@tabler/icons-react';
import ToolPageLayout from '../../ui/ToolPageLayout';
import VerticalSidebar from '../../ui/VerticalSidebar';
import Copyright from '../../ui/Copyright';
import ScrambleText from '../../ui/ScrambleText';
import MarathonText from '../../ui/MarathonText';
import DitherImage from '../../ui/DitherImage';
import {
  DiamondGlyph,
  TargetGlyph,
  PlusGlyph,
  HexagonGlyph,
  CrosshairGlyph,
  CircleGlyph,
  XTipsGlyph,
  HexSplitGlyph,
  DiamondFilledGlyph,
} from '../../ui/MarathonGlyphs';
import styles from '../../styles/UI.module.css';
import form from '../../styles/FormControls.module.css';
import projectStyles from '../../styles/ProjectDetail.module.css';
import layoutStyles from '../../styles/MainLayout.module.css';
import blogStyles from '../../styles/Blog.module.css';


const SECTIONS = [
  'Typography & Text',
  'Tag-Specific Styles',
  'Sidebars',
  'Project Cards',
  'Form Controls & Inputs',
  'Content Components',
  'Color Tokens',
  'Animation Timing',
];

export default function UIPage() {
  const [scrambleKey, setScrambleKey] = useState(0);
  const [marathonKey, setMarathonKey] = useState(0);
  const [ditherKey, setDitherKey] = useState(0);

  return (
    <ToolPageLayout
      title="UI Reference"
      subtitle="DEFNF Design System &mdash; Component Specification"
      version="v1.0 / 2026"
      headerClassName={styles.header}
    >
          {/* Table of Contents */}
          <nav className={styles.toc}>
            <div className={styles.tocLabel}>Contents</div>
            <ol className={styles.tocList}>
              {SECTIONS.map((s, i) => (
                <li key={i} className={styles.tocItem}>{i + 1}. {s}</li>
              ))}
            </ol>
          </nav>

          {/* ============================================================ */}
          {/* 1. Typography & Text */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>Typography & Text</h2>
            </div>

            {/* ScrambleText */}
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>ScrambleText</span>
                <span className={styles.entryPath}>src/ui/ScrambleText.tsx</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Type</td><td>Text animation</td></tr>
                      <tr><td>Method</td><td>Character-by-character random reveal</td></tr>
                      <tr><td>Default Duration</td><td>1000ms</td></tr>
                      <tr><td>Charset</td><td>A-Z a-z 0-9 @#$%&*</td></tr>
                      <tr><td>Global Flag</td><td>SCRAMBLE_ENABLED = false</td></tr>
                      <tr><td>Re-triggers</td><td>On pathname change</td></tr>
                    </tbody>
                  </table>
                  <ul className={styles.propsList}>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>children</span>
                      <span className={styles.propType}>string</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>duration</span>
                      <span className={styles.propType}>number</span>
                      <span className={styles.propDefault}>= 1000</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>delay</span>
                      <span className={styles.propType}>number</span>
                      <span className={styles.propDefault}>= 0</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>as</span>
                      <span className={styles.propType}>keyof JSX.IntrinsicElements</span>
                      <span className={styles.propDefault}>= &apos;span&apos;</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>enabled</span>
                      <span className={styles.propType}>boolean</span>
                      <span className={styles.propDefault}>= SCRAMBLE_ENABLED</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>
                      <span>Live &mdash; <button
                        style={{ background: 'none', border: '1px solid #262626', color: '#525252', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.1rem 0.4rem', cursor: 'pointer', letterSpacing: '0.05em' }}
                        onClick={() => setScrambleKey(k => k + 1)}
                      >Replay</button></span>
                    </div>
                    <div className={styles.scrambleDemo} key={scrambleKey}>
                      <div className={styles.scrambleLine}>
                        <span className={styles.scrambleLabel}>600ms</span>
                        <span className={styles.scrambleOutput} style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                          <ScrambleText duration={600} enabled={true}>DEFNF COMPUTING</ScrambleText>
                        </span>
                      </div>
                      <div className={styles.scrambleLine}>
                        <span className={styles.scrambleLabel}>1200ms</span>
                        <span className={styles.scrambleOutput} style={{ fontSize: '0.85rem' }}>
                          <ScrambleText duration={1200} delay={200} enabled={true}>Character-by-character random reveal animation</ScrambleText>
                        </span>
                      </div>
                      <div className={styles.scrambleLine}>
                        <span className={styles.scrambleLabel}>2000ms</span>
                        <span className={styles.scrambleOutput} style={{ fontSize: '0.7rem', color: '#737373' }}>
                          <ScrambleText duration={2000} delay={400} enabled={true}>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%</ScrambleText>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Font Stack */}
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Font Stack</span>
                <span className={styles.entryPath}>src/app/layout.tsx / global.css</span>
              </div>
              <div className={styles.entryBodyFull}>
                <table className={styles.specTable}>
                  <tbody>
                    <tr><td>--font-body</td><td>Outfit 400</td></tr>
                    <tr><td>--font-serif</td><td>Playfair Display 700, 900</td></tr>
                    <tr><td>--font-mono</td><td>JetBrains Mono 400, 500</td></tr>
                    <tr><td>--font-zu</td><td>Zu Regular (custom @font-face)</td></tr>
                  </tbody>
                </table>
                <div className={styles.demo} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.demoLabel}>Rendered Specimens</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: '#e5e5e5', lineHeight: 1.3 }}>
                        Outfit Regular 400
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.5 }}>
                        The quick brown fox jumps over the lazy dog. Body text, UI elements, and general copy. ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#e5e5e5', fontWeight: 700, letterSpacing: '0.04em' }}>
                        Playfair Display 700
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#d4d4d4', fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                        SECTION HEADERS
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#737373', letterSpacing: '0.02em' }}>
                        JetBrains Mono 400 &mdash; Code, labels, metadata, technical content
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#525252', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        JetBrains Mono 500 &mdash; UPPERCASE LABELS AND TAGS
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-zu)', fontSize: '1.25rem', color: '#e5e5e5' }}>
                        Zu Regular &mdash; Custom typeface
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type Scale */}
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Type Scale</span>
                <span className={styles.tag}>Reference</span>
              </div>
              <div className={styles.entryBodyFull}>
                <div className={styles.demo}>
                  <div className={styles.demoLabel}>Rendered Scale</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {[
                      { size: '2.5rem', font: 'var(--font-serif)', weight: 700, color: '#e5e5e5', label: '2.5rem', text: 'Page Title' },
                      { size: '1.5rem', font: 'var(--font-serif)', weight: 700, color: '#d4d4d4', label: '1.5rem', text: 'Section Title' },
                      { size: '1.1rem', font: 'var(--font-serif)', weight: 700, color: '#d4d4d4', label: '1.1rem', text: 'Entry Title' },
                      { size: '0.95rem', font: 'var(--font-mono)', weight: 500, color: '#e5e5e5', label: '0.95rem', text: 'Component Name' },
                      { size: '0.85rem', font: 'var(--font-body)', weight: 400, color: '#a3a3a3', label: '0.85rem', text: 'Body text and general copy' },
                      { size: '0.75rem', font: 'var(--font-mono)', weight: 400, color: '#737373', label: '0.75rem', text: 'Labels and secondary information' },
                      { size: '0.65rem', font: 'var(--font-mono)', weight: 400, color: '#525252', label: '0.65rem', text: 'Metadata, file paths, timestamps' },
                    ].map(({ size, font, weight, color, label, text }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#333', minWidth: '3.5rem', textAlign: 'right', flexShrink: 0 }}>
                          {label}
                        </span>
                        <span style={{ fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: 1.3 }}>
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 2. Tag-Specific Styles */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>Tag-Specific Styles</h2>
            </div>
            <p className={styles.sectionDesc}>
              Blog posts tagged with specific keywords receive custom styling and animations.
              Currently supported: <span className={styles.marathonAccent}>marathon</span> &mdash; neon glyph system, text reveal animation, and dithered cover images.
            </p>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>MarathonGlyphs</span>
                <span className={styles.entryPath}>src/ui/MarathonGlyphs.tsx</span>
              </div>
              <div className={styles.entryBodyFull}>
                <div className={styles.glyphGrid}>
                  {[
                    { Comp: DiamondGlyph, name: 'Diamond' },
                    { Comp: CircleGlyph, name: 'Circle' },
                    { Comp: HexagonGlyph, name: 'Hexagon' },
                    { Comp: TargetGlyph, name: 'Target' },
                    { Comp: PlusGlyph, name: 'Plus' },
                    { Comp: CrosshairGlyph, name: 'Crosshair' },
                    { Comp: XTipsGlyph, name: 'X Tips' },
                    { Comp: DiamondFilledGlyph, name: 'DiamondFill' },
                    { Comp: HexSplitGlyph, name: 'HexSplit' },
                  ].map(({ Comp, name }) => (
                    <div key={name} className={styles.glyphCell}>
                      <Comp size={28} />
                      <span className={styles.glyphLabel}>{name}</span>
                    </div>
                  ))}
                </div>

                {/* Multi-size demo */}
                <div className={styles.demo} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.demoLabel}>Size Variants &mdash; 12px / 24px / 48px</div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      { Comp: DiamondGlyph, name: 'Diamond' },
                      { Comp: CrosshairGlyph, name: 'Crosshair' },
                      { Comp: TargetGlyph, name: 'Target' },
                      { Comp: CircleGlyph, name: 'Circle' },
                    ].map(({ Comp, name }) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Comp size={12} />
                        <Comp size={24} />
                        <Comp size={48} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: '#333', marginLeft: '0.25rem' }}>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color variants */}
                <div className={styles.demo} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.demoLabel}>Color Override</div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[
                      { color: '#bfff00', label: 'Default' },
                      { color: '#ffffff', label: 'White' },
                      { color: '#cc1818', label: 'IR Red' },
                      { color: '#1830dd', label: 'IR Blue' },
                      { color: '#8b5cf6', label: 'ENCOM' },
                      { color: '#22c55e', label: 'Grid' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <DiamondGlyph size={20} color={color} />
                        <CrosshairGlyph size={20} color={color} />
                        <PlusGlyph size={20} color={color} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#404040' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <table className={styles.specTable} style={{ marginTop: '0.5rem' }}>
                  <tbody>
                    <tr><td>Rendering</td><td>Inline SVG, mask-based cutouts</td></tr>
                    <tr><td>Mask IDs</td><td>Random per-instance (Math.random)</td></tr>
                    <tr><td>Phase 1 Set</td><td>Diamond, Circle, Hexagon</td></tr>
                    <tr><td>Phase 2 Set</td><td>Target, Plus, Crosshair</td></tr>
                    <tr><td>Export</td><td>Named + MARATHON_GLYPHS array + getRandomGlyph()</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>MarathonText</span>
                <span className={styles.entryPath}>src/ui/MarathonText.tsx</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Type</td><td>5-phase glyph text animation</td></tr>
                      <tr><td>Default Duration</td><td>1200ms</td></tr>
                      <tr><td>Stagger</td><td>30% across char positions</td></tr>
                      <tr><td>Re-triggers</td><td>On pathname change</td></tr>
                    </tbody>
                  </table>
                  <ul className={styles.propsList}>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>children</span>
                      <span className={styles.propType}>string</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>duration</span>
                      <span className={styles.propType}>number</span>
                      <span className={styles.propDefault}>= 1200</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>delay</span>
                      <span className={styles.propType}>number</span>
                      <span className={styles.propDefault}>= 0</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>enabled</span>
                      <span className={styles.propType}>boolean</span>
                      <span className={styles.propDefault}>= true</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>
                      <span>Live &mdash; <button
                        style={{ background: 'none', border: '1px solid #262626', color: '#525252', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.1rem 0.4rem', cursor: 'pointer', letterSpacing: '0.05em' }}
                        onClick={() => setMarathonKey(k => k + 1)}
                      >Replay</button></span>
                    </div>
                    <div className={styles.marathonDemo} key={marathonKey}>
                      <div className={styles.marathonLine}>
                        <span className={styles.marathonLabel}>3000ms</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.15em', color: '#e5e5e5' }}>
                          <MarathonText duration={3000}>MARATHON</MarathonText>
                        </span>
                      </div>
                      <div className={styles.marathonLine}>
                        <span className={styles.marathonLabel}>2000ms</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#a3a3a3' }}>
                          <MarathonText duration={2000} delay={500}>THIEF ICON XXII</MarathonText>
                        </span>
                      </div>
                      <div className={styles.marathonLine}>
                        <span className={styles.marathonLabel}>4000ms</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#737373' }}>
                          <MarathonText duration={4000} delay={800}>NEON TO GLYPHS TO TARGET TO REVEAL</MarathonText>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.entryBodyFull}>
                <div className={styles.phaseRow}>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>1</span>
                    <span className={styles.phaseName} style={{ color: '#bfff00' }}>Neon</span>
                    <span className={styles.phasePercent}>0–20%</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>2</span>
                    <span className={styles.phaseName}>Outline Glyphs</span>
                    <span className={styles.phasePercent}>20–40%</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>3</span>
                    <span className={styles.phaseName}>Target Glyphs</span>
                    <span className={styles.phasePercent}>40–55%</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>4</span>
                    <span className={styles.phaseName} style={{ color: '#bfff00' }}>Neon Blocks</span>
                    <span className={styles.phasePercent}>55–75%</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>5</span>
                    <span className={styles.phaseName}>Reveal</span>
                    <span className={styles.phasePercent}>75–100%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>DitherImage</span>
                <span className={styles.entryPath}>src/ui/DitherImage.tsx</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Type</td><td>Image loading effect</td></tr>
                      <tr><td>Algorithm</td><td>Floyd-Steinberg dithering</td></tr>
                      <tr><td>Block Size</td><td>6px (infrared phase)</td></tr>
                      <tr><td>Dither Color</td><td className={styles.marathonAccent}>#bfff00</td></tr>
                      <tr><td>Background</td><td>#0a0a0a</td></tr>
                      <tr><td>Image Fit</td><td>object-fit: cover (computed)</td></tr>
                    </tbody>
                  </table>
                  <ul className={styles.propsList}>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>src</span>
                      <span className={styles.propType}>string</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>alt</span>
                      <span className={styles.propType}>string</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>fill</span>
                      <span className={styles.propType}>boolean</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>sizes</span>
                      <span className={styles.propType}>string</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td colSpan={2} style={{ color: '#525252', paddingBottom: '0.25rem' }}>Infrared Palette</td></tr>
                      <tr><td>IR Red</td><td>#cc1818</td></tr>
                      <tr><td>IR Green Light</td><td>#20ff40</td></tr>
                      <tr><td>IR Green Dark</td><td>#0a6618</td></tr>
                      <tr><td>IR Blue</td><td>#1830dd</td></tr>
                    </tbody>
                  </table>
                  <div className={styles.swatchRow} style={{ marginTop: '0.35rem' }}>
                    <div className={styles.swatch}>
                      <div className={styles.swatchBox} style={{ background: '#cc1818' }} />
                      <span className={styles.swatchLabel}>Red</span>
                    </div>
                    <div className={styles.swatch}>
                      <div className={styles.swatchBox} style={{ background: '#1830dd' }} />
                      <span className={styles.swatchLabel}>Blue</span>
                    </div>
                    <div className={styles.swatch}>
                      <div className={styles.swatchBox} style={{ background: '#20ff40' }} />
                      <span className={styles.swatchLabel}>Green</span>
                    </div>
                    <div className={styles.swatch}>
                      <div className={styles.swatchBox} style={{ background: '#0a6618' }} />
                      <span className={styles.swatchLabel}>Dark</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live dither demo */}
              <div className={styles.entryBodyFull}>
                <div className={styles.demo}>
                  <div className={styles.demoLabel}>
                    <span>Live &mdash; Infrared → Scan → Dither → Reveal &mdash; <button
                      style={{ background: 'none', border: '1px solid #262626', color: '#525252', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.1rem 0.4rem', cursor: 'pointer', letterSpacing: '0.05em' }}
                      onClick={() => setDitherKey(k => k + 1)}
                    >Replay</button></span>
                  </div>
                  <div className={styles.ditherDemo} key={ditherKey}>
                    <div className={styles.ditherFrame}>
                      <DitherImage
                        src="/images/projects/encom-background.png"
                        alt="ENCOM background"
                        fill
                        sizes="50vw"
                      />
                      <div className={styles.ditherFrameLabel}>encom-background.png</div>
                    </div>
                    <div className={styles.ditherFrame}>
                      <DitherImage
                        src="/images/blog/marathon-assassin-6.png"
                        alt="Marathon Assassin"
                        fill
                        sizes="50vw"
                      />
                      <div className={styles.ditherFrameLabel}>marathon-assassin-6.png</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.entryBodyFull}>
                <div className={styles.phaseRow}>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>1</span>
                    <span className={styles.phaseName}>Infrared</span>
                    <span className={styles.phasePercent}>500ms</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>2</span>
                    <span className={styles.phaseName}>Scan Line</span>
                    <span className={styles.phasePercent}>150ms</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>3</span>
                    <span className={styles.phaseName}>Dither Hold</span>
                    <span className={styles.phasePercent}>800ms</span>
                  </div>
                  <div className={styles.phaseBlock}>
                    <span className={styles.phaseNumber}>4</span>
                    <span className={styles.phaseName}>Quadrant Reveal</span>
                    <span className={styles.phasePercent}>4 &times; 80ms</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 3. Sidebars */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>03</span>
              <h2 className={styles.sectionTitle}>Sidebars</h2>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>VerticalSidebar / RSS Sidebar</span>
                <span className={styles.entryPath}>src/ui/VerticalSidebar.tsx &middot; src/styles/Blog.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td colSpan={2} style={{ color: '#525252', paddingBottom: '0.25rem' }}>Shared Pattern</td></tr>
                      <tr><td>Layout</td><td>Fixed, full height, vertical content</td></tr>
                      <tr><td>Border</td><td>1px solid #262626</td></tr>
                      <tr><td>Label Font</td><td>0.6rem mono 500, vertical-rl, #525252</td></tr>
                      <tr><td>Hover</td><td>border #404040, text/icon #a3a3a3</td></tr>
                      <tr><td colSpan={2} style={{ color: '#525252', paddingTop: '0.5rem', paddingBottom: '0.25rem' }}>Left &mdash; VerticalSidebar</td></tr>
                      <tr><td>Position</td><td>Fixed left</td></tr>
                      <tr><td>Contains</td><td>Logo, brand text, contribution graph</td></tr>
                      <tr><td>Graph</td><td>Honeycomb dot grid, 3px dots, 3px gap</td></tr>
                      <tr><td>Data</td><td>/api/contributions, localStorage cache</td></tr>
                      <tr><td colSpan={2} style={{ color: '#525252', paddingTop: '0.5rem', paddingBottom: '0.25rem' }}>Right &mdash; RSS Sidebar</td></tr>
                      <tr><td>Position</td><td>Fixed right</td></tr>
                      <tr><td>Width</td><td>2.5rem (2rem mobile)</td></tr>
                      <tr><td>Icon</td><td>Tabler IconRss, 12px, rotated 90deg</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live &mdash; Left + Right</div>
                    <div className={styles.sidebarDualDemo}>
                      <div className={styles.sidebarMini}>
                        <VerticalSidebar disableLink />
                      </div>
                      <div className={styles.rssDemoMini}>
                        <a className={blogStyles.rssSidebar} style={{ position: 'relative', inset: 'auto', height: '100%' }}>
                          <IconRss className={blogStyles.rssIcon} stroke={1.5} size={18} />
                          <span className={blogStyles.rssLink}>RSS FEED</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className={styles.demo} style={{ marginTop: '0.5rem' }}>
                    <div className={styles.demoLabel}>Contribution Levels</div>
                    <div className={styles.levelBar}>
                      {[
                        { opacity: 0, label: 'L0' },
                        { opacity: 0.3, label: 'L1' },
                        { opacity: 0.5, label: 'L2' },
                        { opacity: 0.7, label: 'L3' },
                        { opacity: 0.9, label: 'L4' },
                      ].map(({ opacity, label }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                          <div
                            className={styles.levelDot}
                            style={{ background: opacity === 0 ? 'transparent' : `rgba(255,255,255,${opacity})` }}
                          />
                          <span className={styles.levelDotLabel}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 4. Project Cards */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>04</span>
              <h2 className={styles.sectionTitle}>Project Cards</h2>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Nav Button</span>
                <span className={styles.entryPath}>src/ui/MainLayout.tsx</span>
              </div>
              <div className={styles.entryBodyFull}>
                <table className={styles.specTable}>
                  <tbody>
                    <tr><td>Type</td><td>Project navigation tile</td></tr>
                    <tr><td>Layout</td><td>Vertical stack (always 1-column)</td></tr>
                    <tr><td>Border</td><td>1px solid var(--project-color)</td></tr>
                    <tr><td>Hover / Active</td><td>Background fill with project color</td></tr>
                    <tr><td>Desktop BG</td><td>transparent</td></tr>
                    <tr><td>Mobile BG</td><td>gradient → 25% project-color (color-mix)</td></tr>
                    <tr><td>Hidden State</td><td>Lock icon overlay</td></tr>
                    <tr><td>Bracket (Desktop)</td><td>Right side, vertical line + caps, label vertical-rl</td></tr>
                    <tr><td>Bracket (Mobile)</td><td>Left side, vertical line + caps, label rotated 180deg</td></tr>
                    <tr><td>Category Order</td><td>SaaS → Apps → Games</td></tr>
                  </tbody>
                </table>

                <div className={styles.cardDemoPair}>
                  {/* Desktop variant */}
                  <div className={styles.demo} style={{ flex: 1 }}>
                    <div className={styles.demoLabel}>Desktop &mdash; Transparent, Bracket Right</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {['SaaS', 'Games'].map(label => (
                        <div key={label} className={styles.desktopCategoryDemo}>
                          <div className={styles.desktopCardStack}>
                            {(label === 'SaaS'
                              ? [{ name: 'MYSEATMAP', tagline: 'Real-time flight intelligence.', color: '#00bba7' }, { name: 'CARTOGRAPH', tagline: 'Docs that write themselves.', color: '#1e3a5f' }]
                              : [{ name: 'ENCOM', tagline: 'Hexagon map service.', color: '#8b5cf6' }, { name: 'GROOVY PICTURE BOOK', tagline: 'Global Game Jam 2026.', color: '#8B5E3C' }]
                            ).map(p => (
                              <div key={p.name} className={styles.demoCard} style={{ '--project-color': p.color } as React.CSSProperties}>
                                <span className={styles.demoCardName}>{p.name}</span>
                                <span className={styles.demoCardTagline}>{p.tagline}</span>
                              </div>
                            ))}
                          </div>
                          <div className={styles.desktopBracket}>
                            <div className={styles.desktopBracketLine}>
                              <span className={styles.desktopBracketLabel}>{label}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile variant */}
                  <div className={styles.demo} style={{ flex: 1 }}>
                    <div className={styles.demoLabel}>Mobile &mdash; Gradient Background, Bracket Left</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundImage: `linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%), url('/images/darkmode/background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '1rem', border: '1px solid #1a1a1a', height: '100%', boxSizing: 'border-box' }}>
                      {['SaaS', 'Games'].map(label => (
                        <div key={label} className={styles.mobileCategoryDemo}>
                          <div className={styles.mobileBracketDemo}>
                            <div className={styles.mobileBracketLine}>
                              <span className={styles.mobileBracketLabel}>{label}</span>
                            </div>
                          </div>
                          <div className={styles.mobileCardDemoGrid}>
                            {(label === 'SaaS'
                              ? [{ name: 'MYSEATMAP', tagline: 'Real-time flight intelligence.', color: '#00bba7' }, { name: 'CARTOGRAPH', tagline: 'Docs that write themselves.', color: '#1e3a5f' }]
                              : [{ name: 'ENCOM', tagline: 'Hexagon map service.', color: '#8b5cf6' }, { name: 'GROOVY PICTURE BOOK', tagline: 'Global Game Jam 2026.', color: '#8B5E3C' }]
                            ).map(p => (
                              <button key={p.name} className={styles.mobileCardDemo} style={{ '--project-color': p.color } as React.CSSProperties}>
                                <span className={styles.demoCardName}>{p.name}</span>
                                <span className={styles.demoCardTagline}>{p.tagline}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Project Detail Link</span>
                <span className={styles.entryPath}>src/styles/ProjectDetail.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Type</td><td>Project external link tile</td></tr>
                      <tr><td>Layout</td><td>Grid, auto-fit minmax(200px, 1fr)</td></tr>
                      <tr><td>Background</td><td>#171717</td></tr>
                      <tr><td>Border</td><td>1px solid #262626, no radius</td></tr>
                      <tr><td>Color</td><td>#d4d4d4</td></tr>
                      <tr><td>Hover</td><td>bg #262626, border #404040, color #f5f5f5</td></tr>
                      <tr><td>Disabled</td><td>opacity 0.5, no hover effects</td></tr>
                      <tr><td>Icon Types</td><td>External, GitHub, Play Store, Privacy, Hexagon, Plane</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div className={projectStyles.linkGrid}>
                      <a className={projectStyles.link}>
                        <IconExternalLink stroke={2} width="1em" height="1em" />
                        <span>Live Site</span>
                      </a>
                      <a className={projectStyles.link}>
                        <IconBrandGithub stroke={2} width="1em" height="1em" />
                        <span>Source Code</span>
                      </a>
                      <a className={projectStyles.link}>
                        <IconShield stroke={2} width="1em" height="1em" />
                        <span>Privacy Policy</span>
                      </a>
                      <span className={`${projectStyles.link} ${projectStyles.disabled}`}>
                        <IconExternalLink stroke={2} width="1em" height="1em" />
                        <span>Disabled Link</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Hidden / Lock Variant</span>
                <span className={styles.entryPath}>src/styles/MainLayout.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Lock Icon</td><td>7rem &times; 7rem (desktop), 4rem (mobile)</td></tr>
                      <tr><td>Icon Color</td><td>#111111 (idle)</td></tr>
                      <tr><td>Hover Color</td><td>color-mix(project-color 30%, #0a0a0a)</td></tr>
                      <tr><td>Position</td><td>absolute, right: -0.75rem, centered vertically</td></tr>
                      <tr><td>Overflow</td><td>hidden (clipped to card bounds)</td></tr>
                      <tr><td>Text z-index</td><td>1 (above lock icon at z-index 0)</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live &mdash; Project + Link</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        className={`${layoutStyles.navButton} ${layoutStyles.hiddenProject}`}
                        style={{ '--project-color': '#8b1a3a' } as React.CSSProperties}
                      >
                        <IconLock className={layoutStyles.navLockIcon} stroke={1.5} />
                        <span className={layoutStyles.navButtonName}>GLASS HOUSE</span>
                        <span className={layoutStyles.navButtonTagline}>First-person horror.</span>
                      </button>
                      <a className={`${projectStyles.link} ${projectStyles.hiddenLink}`}>
                        <IconLock className={projectStyles.lockIcon} stroke={1.5} />
                        <IconBrandGithub stroke={2} width="1em" height="1em" />
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 5. Form Controls & Inputs */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>05</span>
              <h2 className={styles.sectionTitle}>Form Controls & Inputs</h2>
            </div>
            <p className={styles.sectionDesc}>
              Shared form element styling from <code>FormControls.module.css</code>, used across /qr, /markdown, and other tool pages.
            </p>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Text Input</span>
                <span className={styles.entryPath}>src/styles/FormControls.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Font</td><td>0.8rem mono</td></tr>
                      <tr><td>Padding</td><td>0.6rem</td></tr>
                      <tr><td>Background</td><td>#171717</td></tr>
                      <tr><td>Border</td><td>1px solid #262626</td></tr>
                      <tr><td>Focus</td><td>border-color: #404040, no outline</td></tr>
                      <tr><td>Color</td><td>#e5e5e5</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input
                        type="text"
                        defaultValue="https://defnf.com"
                        readOnly
                        className={form.textInput}
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Select / Dropdown</span>
                <span className={styles.entryPath}>src/styles/FormControls.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Font</td><td>0.8rem mono</td></tr>
                      <tr><td>Padding</td><td>0.6rem</td></tr>
                      <tr><td>Background</td><td>#171717</td></tr>
                      <tr><td>Border</td><td>1px solid #262626</td></tr>
                      <tr><td>Focus</td><td>border-color: #404040</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <select
                      defaultValue="square"
                      className={form.select}
                      style={{ width: '100%' }}
                    >
                      <option value="square">Square</option>
                      <option value="dots">Dots</option>
                      <option value="rounded">Rounded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Range Slider</span>
                <span className={styles.entryPath}>src/styles/FormControls.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Track</td><td>4px height, #262626, rounded</td></tr>
                      <tr><td>Thumb</td><td>14px circle, #525252</td></tr>
                      <tr><td>Thumb Hover</td><td>#737373</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      defaultValue="256"
                      className={form.rangeSlider}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Control Button</span>
                <span className={styles.entryPath}>src/styles/FormControls.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Font</td><td>0.7rem mono 500</td></tr>
                      <tr><td>Height</td><td>1.75rem</td></tr>
                      <tr><td>Border</td><td>1px solid #262626</td></tr>
                      <tr><td>Background</td><td>none</td></tr>
                      <tr><td>Color</td><td>#525252</td></tr>
                      <tr><td>Hover</td><td>color #a3a3a3, border #404040</td></tr>
                      <tr><td>Active State</td><td>Same as hover</td></tr>
                      <tr><td>Used In</td><td>/markdown, /qr</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Preview', 'Edit', 'Download'].map(label => (
                        <button
                          key={label}
                          className={form.controlButton}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Download Button</span>
                <span className={styles.entryPath}>src/styles/FormControls.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Font</td><td>0.75rem mono uppercase</td></tr>
                      <tr><td>Padding</td><td>0.75rem 1.5rem</td></tr>
                      <tr><td>Background</td><td>#171717</td></tr>
                      <tr><td>Border</td><td>1px solid #262626</td></tr>
                      <tr><td>Color</td><td>#a3a3a3</td></tr>
                      <tr><td>Hover</td><td>bg #262626, color #e5e5e5</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <button className={form.downloadButton}>
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Warning Banner</span>
                <span className={styles.entryPath}>src/styles/FormControls.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Font</td><td>0.7rem mono</td></tr>
                      <tr><td>Background</td><td>#2d2000</td></tr>
                      <tr><td>Color</td><td>#d4a000</td></tr>
                      <tr><td>Border</td><td>1px solid #4d3800</td></tr>
                      <tr><td>Padding</td><td>0.6rem</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div className={form.warning}>
                      Low contrast may cause scanning issues
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Form Label / Section Title</span>
                <span className={styles.tag}>Pattern</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Label</td><td>0.7rem mono 500 #737373 uppercase</td></tr>
                      <tr><td>Small Hint</td><td>0.65rem mono #525252</td></tr>
                      <tr><td>Section Title</td><td>0.65rem mono 600 #525252 uppercase, border-bottom</td></tr>
                      <tr><td>Spacing</td><td>0.4rem gap within control groups</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div className={form.sectionTitle}>Colors</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className={form.controlLabel}>Dot Color</span>
                        <span className={form.controlHint}>Download will have transparent background</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 6. Content Components */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>06</span>
              <h2 className={styles.sectionTitle}>Content Components</h2>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Post Card</span>
                <span className={styles.entryPath}>src/ui/BlogPostList.tsx</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Type</td><td>Blog post link card</td></tr>
                      <tr><td>Title</td><td>1.25rem serif 700 #a3a3a3</td></tr>
                      <tr><td>Date</td><td>0.7rem mono #404040</td></tr>
                      <tr><td>Description</td><td>0.75rem mono #525252</td></tr>
                      <tr><td>Divider</td><td>1px solid #1a1a1a</td></tr>
                      <tr><td>Hover</td><td>padding-left: 0.5rem, title → #f5f5f5</td></tr>
                      <tr><td>Cover Variant</td><td>Rounded, 180px min-height, grayscale → color on hover</td></tr>
                      <tr><td>Cover Text</td><td>Dark/light toggle via coverImageDark</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div>
                      {[
                        { title: 'Marathon 2026 Review', date: 'Jan 15, 2026', desc: 'A review of the upcoming Marathon game.' },
                        { title: 'Amazon and the Games Industry', date: 'Dec 2, 2025', desc: 'On GameSparks, AWS, and game backends.' },
                      ].map((post, i) => (
                        <div key={i} className={blogStyles.postCard}>
                          <div className={blogStyles.postTitle}>{post.title}</div>
                          <div className={blogStyles.postDate}>{post.date}</div>
                          <div className={blogStyles.postDescription}>{post.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Tag</span>
                <span className={styles.entryPath}>src/styles/Blog.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Font</td><td>0.6rem mono uppercase</td></tr>
                      <tr><td>Background</td><td>#171717</td></tr>
                      <tr><td>Color</td><td>#525252</td></tr>
                      <tr><td>Border</td><td>1px solid #262626</td></tr>
                      <tr><td>Padding</td><td>0.25rem 0.5rem</td></tr>
                      <tr><td>Spacing</td><td>letter-spacing 0.1em</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div className={blogStyles.postTags}>
                      {['Marathon', 'Review', 'Games', 'AWS'].map(tag => (
                        <span key={tag} className={blogStyles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>ToolPageLayout</span>
                <span className={styles.entryPath}>src/ui/ToolPageLayout.tsx &middot; src/styles/ToolPage.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Type</td><td>Shared tool page shell</td></tr>
                      <tr><td>Wraps</td><td>VerticalSidebar + header + children + Copyright</td></tr>
                      <tr><td>Inner Max-Width</td><td>640px (default)</td></tr>
                      <tr><td>Header</td><td>flex, baseline, space-between, border-bottom</td></tr>
                      <tr><td>Title Block</td><td>flex-wrap, baseline, nowrap items</td></tr>
                      <tr><td>Mobile</td><td>Header stacks to column at 768px</td></tr>
                      <tr><td>Footer</td><td>Inline or fixed (fixedFooter prop)</td></tr>
                    </tbody>
                  </table>
                  <ul className={styles.propsList}>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>title</span>
                      <span className={styles.propType}>ReactNode</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>subtitle</span>
                      <span className={styles.propType}>ReactNode</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>version</span>
                      <span className={styles.propType}>string</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>headerRight</span>
                      <span className={styles.propType}>ReactNode</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>fixedFooter</span>
                      <span className={styles.propType}>boolean</span>
                    </li>
                    <li className={styles.propItem}>
                      <span className={styles.propName}>*ClassName</span>
                      <span className={styles.propType}>string</span>
                      <span className={styles.propDefault}>wrapper, container, inner, header</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td colSpan={2} style={{ color: '#525252', paddingBottom: '0.25rem' }}>Page Values</td></tr>
                      <tr><td>Games</td><td>Favorite Video Games &middot; Personal Catalogue &middot; Ranked Jan 2026</td></tr>
                      <tr><td>QR</td><td>QR Generator &middot; Styled QR Code Tool</td></tr>
                      <tr><td>Markdown</td><td>Markdown &middot; Local Editor</td></tr>
                      <tr><td>MIDI</td><td>MIDI &middot; Tenor Saxophone</td></tr>
                      <tr><td>UI</td><td>UI Reference &middot; DEFNF Design System &middot; v1.0 / 2026</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Copyright</span>
                <span className={styles.entryPath}>src/ui/Copyright.tsx</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Variants</td><td>Static (inline, padding 3rem) / Fixed (position: fixed, bottom: 0)</td></tr>
                      <tr><td>Pattern</td><td>Desktop: fixed. Mobile: static inside scroll container.</td></tr>
                      <tr><td>Font</td><td>0.7rem mono #404040, letter-spacing 0.05em</td></tr>
                      <tr><td>Prop</td><td>fixed?: boolean</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live &mdash; Static Variant</div>
                    <Copyright />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Info Tooltip</span>
                <span className={styles.entryPath}>src/styles/Midi.module.css</span>
              </div>
              <div className={styles.entryBody}>
                <div>
                  <table className={styles.specTable}>
                    <tbody>
                      <tr><td>Trigger</td><td>16px circle, 1px solid #333, serif &quot;i&quot;</td></tr>
                      <tr><td>Tooltip</td><td>bg #0a0a0a, border #262626</td></tr>
                      <tr><td>Font</td><td>0.6rem mono #525252</td></tr>
                      <tr><td>Animation</td><td>opacity 0.15s ease</td></tr>
                      <tr><td>Links</td><td>#525252, underline #333, hover #737373</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className={styles.demo}>
                    <div className={styles.demoLabel}>Live</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 16, height: 16,
                        border: '1px solid #333',
                        borderRadius: '50%',
                        fontFamily: 'var(--font-serif)',
                        fontSize: 10, fontWeight: 700,
                        lineHeight: '16px',
                        textAlign: 'center' as const,
                        color: '#333',
                        cursor: 'pointer',
                        boxSizing: 'border-box' as const,
                      }}>i</div>
                      <div style={{
                        background: '#0a0a0a',
                        border: '1px solid #262626',
                        padding: '8px 10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        color: '#525252',
                        letterSpacing: '0.05em',
                        lineHeight: 1.6,
                      }}>
                        Tooltip content appears here
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 7. Color Tokens */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>07</span>
              <h2 className={styles.sectionTitle}>Color Tokens</h2>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Core Palette</span>
                <span className={styles.tag}>System</span>
              </div>
              <div className={styles.entryBodyFull}>
                <div className={styles.demo}>
                  <div className={styles.demoLabel}>Background Scale</div>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {[
                      { color: '#0a0a0a', label: 'BG' },
                      { color: '#0d0d0d', label: 'Card' },
                      { color: '#111111', label: 'Srf' },
                      { color: '#171717', label: 'Elev' },
                      { color: '#1a1a1a', label: 'Bdr-' },
                      { color: '#262626', label: 'Bdr' },
                      { color: '#333333', label: 'Bdr+' },
                      { color: '#525252', label: 'Brkt' },
                    ].map(({ color, label }) => (
                      <div key={color} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: 32, background: color, border: '1px solid #1a1a1a' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.4rem', color: '#404040', marginTop: '0.2rem' }}>{color}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.4rem', color: '#333' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.demo} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.demoLabel}>Text Hierarchy</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {[
                      { color: '#f9fafb', label: '#f9fafb  Bright — Strong emphasis, active states' },
                      { color: '#e5e5e5', label: '#e5e5e5  Heading — Page & section titles' },
                      { color: '#d4d4d4', label: '#d4d4d4  Primary — Main body text' },
                      { color: '#a3a3a3', label: '#a3a3a3  Tertiary — Secondary body, descriptions' },
                      { color: '#737373', label: '#737373  Secondary — Supporting info, taglines' },
                      { color: '#525252', label: '#525252  Muted — Metadata, timestamps' },
                      { color: '#404040', label: '#404040  Faint — Labels, subtle markers' },
                      { color: '#333333', label: '#333333  Ghost — Decorative, nearly invisible' },
                    ].map(({ color, label }) => (
                      <span key={color} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color, lineHeight: 1.4 }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Project Colors</span>
                <span className={styles.tag}>CSS Custom Properties</span>
              </div>
              <div className={styles.entryBodyFull}>
                <div className={styles.demo}>
                  <div className={styles.demoLabel}>Rendered Swatches</div>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {[
                      { color: '#00bba7', label: 'SeatMap' },
                      { color: '#1e3a5f', label: 'Cartograph' },
                      { color: '#22c55e', label: 'Grid' },
                      { color: '#8b5cf6', label: 'ENCOM' },
                      { color: '#8B5E3C', label: 'Groovy' },
                      { color: '#8b1a3a', label: 'Glass House' },
                      { color: '#bfff00', label: 'Marathon' },
                      { color: '#9fc2c2', label: 'Theme' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: 24, background: color }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.4rem', color: '#404040', marginTop: '0.2rem', textAlign: 'center' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.35rem', color: '#333' }}>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* ============================================================ */}
          {/* 8. Animation Timing */}
          {/* ============================================================ */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>08</span>
              <h2 className={styles.sectionTitle}>Animation Timing</h2>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Transition Defaults</span>
                <span className={styles.tag}>Reference</span>
              </div>
              <div className={styles.entryBodyFull}>
                <table className={styles.specTable}>
                  <tbody>
                    <tr><td>Micro-interaction</td><td>0.15s ease</td></tr>
                    <tr><td>Panel transition</td><td>0.3s ease</td></tr>
                    <tr><td>Page fade</td><td>0.4–0.6s ease</td></tr>
                    <tr><td>Background crossfade</td><td>0.6s ease</td></tr>
                    <tr><td>ScrambleText</td><td>1000ms (rAF loop)</td></tr>
                    <tr><td>MarathonText</td><td>1200ms (rAF loop, 4-phase)</td></tr>
                    <tr><td>DitherImage total</td><td>~1530ms (500+150+800+80&times;4)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryName}>Layout Constants</span>
                <span className={styles.tag}>Reference</span>
              </div>
              <div className={styles.entryBodyFull}>
                <table className={styles.specTable}>
                  <tbody>
                    <tr><td>App Position</td><td>position: fixed; inset: 0</td></tr>
                    <tr><td>Document Scroll</td><td>Disabled (overflow: hidden on html/body)</td></tr>
                    <tr><td>Content Max-Width</td><td>640px (pages), 900px (this page)</td></tr>
                    <tr><td>Page Padding</td><td>3rem 4rem desktop, 1.5rem 3.5rem mobile</td></tr>
                    <tr><td>Breakpoint</td><td>768px</td></tr>
                    <tr><td>Sidebar Width</td><td>Auto (logo + contribution graph)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
    </ToolPageLayout>
  );
}
