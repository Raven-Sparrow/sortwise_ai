import { useEffect, useRef, useState, useCallback } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'
import { lookupMaterial } from './materialMap'

export function useLiveDetector() {
  const [ready, setReady] = useState(false)
  const modelRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' })
        if (!cancelled) {
          modelRef.current = model
          setReady(true)
        }
      } catch (err) {
        console.error('Live detector failed to load', err)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const detect = useCallback(async (videoEl) => {
    if (!modelRef.current || !videoEl || videoEl.readyState < 2) return []
    const raw = await modelRef.current.detect(videoEl, 8, 0.55)
    return raw.map((d) => {
      const { material, categoryKey } = lookupMaterial(d.class)
      return { ...d, material, categoryKey }
    })
  }, [])

  return { ready, detect }
}
