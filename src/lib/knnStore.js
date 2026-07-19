import * as tf from '@tensorflow/tfjs'
import * as knnClassifier from '@tensorflow-models/knn-classifier'

const STORAGE_KEY = 'sortwise:knn-dataset:v1'

let classifier = null

function getClassifier() {
  if (!classifier) classifier = knnClassifier.create()
  return classifier
}

/** Restore any corrections the user has taught the model in previous sessions. */
export async function loadPersistedKnn() {
  const c = getClassifier()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return exampleCount()
    const parsed = JSON.parse(raw) // { [label]: { data: number[][], shape: [n, d] } }
    const dataset = {}
    for (const [label, { data, shape }] of Object.entries(parsed)) {
      dataset[label] = tf.tensor2d(data.flat(), shape)
    }
    c.setClassifierDataset(dataset)
  } catch (err) {
    console.warn('Could not restore learned corrections', err)
  }
  return exampleCount()
}

async function persist() {
  const c = getClassifier()
  const dataset = c.getClassifierDataset()
  const serializable = {}
  for (const [label, tensor] of Object.entries(dataset)) {
    const data = await tensor.array()
    serializable[label] = { data, shape: tensor.shape }
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
  } catch (err) {
    console.warn('Could not save learned corrections (storage full?)', err)
  }
}

/** Teach the model: this embedding is definitely `categoryKey`. */
export async function teachCorrection(embedding, categoryKey) {
  const c = getClassifier()
  c.addExample(embedding, categoryKey)
  await persist()
  return exampleCount()
}

/**
 * Ask the personalization layer for an opinion, if it has learned enough to have one.
 * Returns null if there isn't at least `minExamples` total examples yet.
 */
export async function predictFromMemory(embedding, minExamples = 3) {
  const c = getClassifier()
  if (c.getNumClasses() === 0) return null
  const total = Object.values(c.getClassExampleCount()).reduce((a, b) => a + b, 0)
  if (total < minExamples) return null
  const res = await c.predictClass(embedding, Math.min(10, total))
  return { categoryKey: res.label, confidence: res.confidences[res.label] }
}

export function exampleCount() {
  const c = getClassifier()
  return Object.values(c.getClassExampleCount()).reduce((a, b) => a + b, 0)
}

export function clearLearning() {
  classifier?.clearAllClasses()
  localStorage.removeItem(STORAGE_KEY)
}
