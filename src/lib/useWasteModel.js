import { useEffect, useRef, useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { classifyPredictions } from './wasteMapping'

export function useWasteModel() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const modelRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await tf.ready()
        const model = await mobilenet.load({ version: 2, alpha: 1.0 })
        if (!cancelled) {
          modelRef.current = model
          setStatus('ready')
        }
      } catch (err) {
        console.error('Model load failed', err)
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const classify = useCallback(async (imgElement) => {
    if (!modelRef.current) throw new Error('Model not ready')
    const predictions = await modelRef.current.classify(imgElement, 5)
    const result = classifyPredictions(predictions)
    return { predictions, result }
  }, [])

  return { status, classify }
}
