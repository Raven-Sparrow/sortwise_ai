import { useEffect, useRef, useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { ensembleClassify } from './ensembleClassifier'
import { loadPersistedKnn, predictFromMemory, teachCorrection, clearLearning as clearKnn } from './knnStore'

export function useWasteModel() {
  const [status, setStatus] = useState('loading')
  const [correctionCount, setCorrectionCount] = useState(0)
  const modelRef = useRef(null)
  const cocoRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await tf.ready()
        const [model, coco] = await Promise.all([
          mobilenet.load({ version: 2, alpha: 1.0 }),
          cocoSsd.load({ base: 'lite_mobilenet_v2' }),
        ])
        const count = await loadPersistedKnn()
        if (!cancelled) {
          modelRef.current = model
          cocoRef.current = coco
          setCorrectionCount(count)
          setStatus('ready')
        }
      } catch (err) {
        console.error('Model load failed', err)
        if (!cancelled) setStatus('error')
      }
    })()
    return () => { cancelled = true }
  }, [])

  const classify = useCallback(async (imgElement) => {
    if (!modelRef.current) throw new Error('Model not ready')

    const [predictions, cocoDetections] = await Promise.all([
      modelRef.current.classify(imgElement, 10),
      cocoRef.current
        ? cocoRef.current.detect(imgElement, 8, 0.45).catch(() => [])
        : Promise.resolve([]),
    ])

    const embedding = modelRef.current.infer(imgElement, true)
    const learned = await predictFromMemory(embedding)

    const result = ensembleClassify({
      mobilenetPredictions: predictions,
      cocoDetections,
      knnResult: learned,
    })

    return { predictions, result, embedding, cocoDetections }
  }, [])

  const correct = useCallback(async (embedding, categoryKey) => {
    const count = await teachCorrection(embedding, categoryKey)
    setCorrectionCount(count)
  }, [])

  const clearLearning = useCallback(() => {
    clearKnn()
    setCorrectionCount(0)
  }, [])

  return { status, classify, correct, correctionCount, clearLearning }
}
