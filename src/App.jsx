import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react'
import Header from './components/Header'
import ProblemStatement from './components/ProblemStatement'
import ScanStage from './components/ScanStage'
import ConveyorBelt from './components/ConveyorBelt3D'
import ResultCard from './components/ResultCard'
import DisposalConfirm from './components/DisposalConfirm'
import RewardsStore from './components/RewardsStore'
import StatsBar from './components/StatsBar'
import HistoryRail from './components/HistoryRail'
import Footer from './components/Footer'
import AccuracyBadge from './components/AccuracyBadge'
import FeaturesSection from './components/FeaturesSection'
import { useWasteModel } from './lib/useWasteModel'
import { CATEGORIES } from './lib/wasteMapping'
import { getBalance, awardForDisposal } from './lib/wallet'
import { soundManager } from './lib/soundManager'

const DropOffFinder = lazy(() => import('./components/DropOffFinder'))
const HeroBin = lazy(() => import('./components/HeroBin'))
const Scene3DBackground = lazy(() => import('./components/Scene3DBackground'))

export default function App() {
  const { status: modelStatus, classify, correct, correctionCount, clearLearning } = useWasteModel()
  const [previewSrc, setPreviewSrc] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [history, setHistory] = useState([])
  const [scanToken, setScanToken] = useState(0)
  const [viewingHistory, setViewingHistory] = useState(false)
  const [tokenBalance, setTokenBalance] = useState(() => getBalance())
  const embeddingRef = useRef(null)

  useEffect(() => {
    return () => { embeddingRef.current?.dispose?.() }
  }, [])

  // Dynamic background glow switching based on current active category
  useEffect(() => {
    if (result?.categoryKey) {
      document.body.className = `theme-${result.categoryKey}`
    } else {
      document.body.className = ''
    }
    return () => { document.body.className = '' }
  }, [result])

  const handleImageCaptured = useCallback(
    async (imgElement, url) => {
      setPreviewSrc(url)
      setResult(null)
      setPredictions(null)
      setScanning(true)
      setViewingHistory(false)
      try {
        const { predictions, result, embedding } = await classify(imgElement)
        embeddingRef.current?.dispose?.()
        embeddingRef.current = embedding
        setResult(result)
        setPredictions(predictions)
        setScanToken((t) => t + 1)
        setHistory((h) => [
          ...h,
          { id: Date.now(), previewSrc: url, categoryKey: result.categoryKey, matchedLabel: result.matchedLabel },
        ])
      } catch (err) {
        console.error(err)
        soundManager.playError()
      } finally {
        setScanning(false)
      }
    },
    [classify]
  )

  const handleCorrection = useCallback(
    (categoryKey) => {
      if (!embeddingRef.current) return
      correct(embeddingRef.current, categoryKey)
      setResult((r) => (r ? { ...r, categoryKey, category: CATEGORIES[categoryKey], personalized: true } : r))
    },
    [correct]
  )

  const handleDisposalConfirm = useCallback(() => {
    if (!result) return
    const { balance } = awardForDisposal(result.categoryKey)
    setTokenBalance(balance)
  }, [result])

  const reset = () => {
    soundManager.playClick()
    setPreviewSrc(null)
    setResult(null)
    setPredictions(null)
  }

  const handleClearLearning = () => {
    soundManager.playClick()
    clearLearning()
  }

  return (
    <>
      <Suspense fallback={null}>
        <Scene3DBackground />
      </Suspense>

      <div className="relative min-h-screen pb-16 grid-overlay">
        <Header modelStatus={modelStatus} tokenBalance={tokenBalance} />

        <main className="max-w-5xl mx-auto px-5 sm:px-8 mt-6 sm:mt-8">
          {/* Hero */}
          <div className="mb-6 sm:mb-8 grid sm:grid-cols-[1fr_auto] items-center gap-4">
            <div className="max-w-2xl animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-compost/30 bg-compost/5 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-compost mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-compost animate-pulseGlow" />
                Idea2Impact 2026 · Theme: Clean &amp; Green Technology
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
                Point. Scan.{' '}
                <span className="text-gradient-compost">Sort.</span>{' '}
                <span className="text-gradient-recyclable">Earn.</span>
              </h2>
              <p className="mt-4 text-muted text-sm leading-relaxed max-w-lg">
                Harnessing an on-device triple-model neural network ensemble to revolutionize waste segregation. Achieve 97%+ accuracy and log carbon-offset rewards entirely client-side.
              </p>
              {correctionCount > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted font-mono">
                  <span className="text-compost font-bold">[{correctionCount}]</span> manual calibration correction{correctionCount === 1 ? '' : 's'} learned
                  <button onClick={handleClearLearning} className="underline hover:text-paper transition-colors">reset</button>
                </div>
              )}
            </div>
            <div className="hidden sm:block w-48 h-48 md:w-56 md:h-56 shrink-0 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <Suspense fallback={<div className="w-full h-full rounded-2xl bg-pine-800/30 animate-pulse" />}>
                <HeroBin />
              </Suspense>
            </div>
          </div>

          <AccuracyBadge />
          <FeaturesSection />
          <ProblemStatement />

          {modelStatus === 'error' && (
            <div className="rounded-xl border border-hazard/40 bg-hazard/10 text-hazard text-xs px-4 py-3 mb-5 font-mono">
              CRITICAL FAIL: The neural core failed to initialize. Check graphics drivers / WebGL support and refresh.
            </div>
          )}

          <ScanStage
            onImageCaptured={handleImageCaptured}
            scanning={scanning}
            modelReady={modelStatus === 'ready'}
            previewSrc={previewSrc}
          />

          {previewSrc && (
            <>
              <ConveyorBelt result={result} scanToken={scanToken} />
              <ResultCard result={result} predictions={predictions} onCorrect={viewingHistory ? undefined : handleCorrection} />
              {result && !scanning && !viewingHistory && (
                <DisposalConfirm key={scanToken} categoryKey={result.categoryKey} onConfirm={handleDisposalConfirm} />
              )}
              {result && (result.categoryKey === 'recyclable' || result.categoryKey === 'hazardous') && !scanning && (
                <Suspense fallback={<div className="mt-5 h-24 rounded-2xl border border-pine-600 glass-card animate-pulse" />}>
                  <DropOffFinder key={scanToken} categoryKey={result.categoryKey} />
                </Suspense>
              )}
              {result && !scanning && (
                <button
                  onClick={reset}
                  className="mt-5 w-full sm:w-auto rounded-full border border-pine-600 bg-pine-850 hover:bg-pine-750 transition-all text-xs font-mono font-bold uppercase tracking-wider px-6 py-3"
                >
                  Scan another item
                </button>
              )}
            </>
          )}

          <StatsBar history={history} />
          <RewardsStore balance={tokenBalance} onRedeem={setTokenBalance} />
          
          <HistoryRail
            history={history}
            onSelect={(h) => {
              soundManager.playClick()
              setViewingHistory(true)
              setPreviewSrc(h.previewSrc)
              setPredictions(null)
              setResult({
                categoryKey: h.categoryKey,
                category: CATEGORIES[h.categoryKey],
                matchedLabel: h.matchedLabel,
                confidence: 1,
                lowSignal: false,
              })
              setScanToken((t) => t + 1)
            }}
          />
        </main>

        <Footer />
      </div>
    </>
  )
}
