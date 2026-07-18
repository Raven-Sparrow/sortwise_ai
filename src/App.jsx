import { useState, useCallback } from 'react'
import Header from './components/Header'
import ScanStage from './components/ScanStage'
import ConveyorBelt from './components/ConveyorBelt'
import ResultCard from './components/ResultCard'
import StatsBar from './components/StatsBar'
import HistoryRail from './components/HistoryRail'
import Footer from './components/Footer'
import { useWasteModel } from './lib/useWasteModel'
import { CATEGORIES } from './lib/wasteMapping'

export default function App() {
  const { status: modelStatus, classify } = useWasteModel()
  const [previewSrc, setPreviewSrc] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [history, setHistory] = useState([])
  const [scanToken, setScanToken] = useState(0)

  const handleImageCaptured = useCallback(
    async (imgElement, url) => {
      setPreviewSrc(url)
      setResult(null)
      setPredictions(null)
      setScanning(true)
      try {
        const { predictions, result } = await classify(imgElement)
        setResult(result)
        setPredictions(predictions)
        setScanToken((t) => t + 1)
        setHistory((h) => [
          ...h,
          { id: Date.now(), previewSrc: url, categoryKey: result.categoryKey, matchedLabel: result.matchedLabel },
        ])
      } catch (err) {
        console.error(err)
      } finally {
        setScanning(false)
      }
    },
    [classify]
  )

  const reset = () => {
    setPreviewSrc(null)
    setResult(null)
    setPredictions(null)
  }

  return (
    <div className="min-h-screen pb-16">
      <Header modelStatus={modelStatus} />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 mt-8 sm:mt-10">
        <div className="mb-7 sm:mb-9 max-w-2xl">
          <h1 className="font-display font-semibold text-3xl sm:text-[2.75rem] leading-[1.08] tracking-tight">
            Point. Scan. <span className="text-compost">Sort.</span>
          </h1>
          <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed">
            Most waste ends up in the wrong bin because sorting rules are inconsistent and easy to forget.
            Sortwise runs a MobileNetV2 convolutional network directly in your browser to read what an item
            actually is, then routes it to the correct stream — recyclable, compost, landfill, or hazardous —
            with the reasoning shown, not hidden.
          </p>
        </div>

        {modelStatus === 'error' && (
          <div className="rounded-xl border border-hazard/40 bg-hazard/10 text-hazard text-sm px-4 py-3 mb-5">
            The vision model couldn't load — check your connection and refresh. (WebGL is required; try a different browser if this persists.)
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
            <ConveyorBelt result={result} previewSrc={previewSrc} scanToken={scanToken} />
            <ResultCard result={result} predictions={predictions} />
            {result && !scanning && (
              <button
                onClick={reset}
                className="mt-5 w-full sm:w-auto rounded-full border border-pine-600 bg-pine-800 hover:bg-pine-700 transition-colors text-sm font-medium px-5 py-2.5"
              >
                Scan another item
              </button>
            )}
          </>
        )}

        <StatsBar history={history} />
        <HistoryRail
          history={history}
          onSelect={(h) => {
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
  )
}
