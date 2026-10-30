import { ref, onMounted, onUnmounted } from 'vue'
import type { Reading } from '../types'

const MAX_POINTS = 30

// Mock version. Later we swap the guts for MQTT, the return shape stays the same,
// so App.vue never needs to change.
export function useDashboard() {
  const online = ref(false)
  const history = ref<Reading[]>([])
  const manualMode = ref(false) // confirmed state (what the ESP32 reports)
  const pumpOn = ref(false) // confirmed state
  const busy = ref(false) // waiting for the ESP32 to confirm a command

  let timer: number | undefined

  function fakeReading(prev?: Reading): Reading {
    const drift = (v: number, step: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v + (Math.random() - 0.5) * step))
    return {
      time: Date.now(),
      temperature: drift(prev?.temperature ?? 24, 1, 10, 40),
      soilMoisture: drift(prev?.soilMoisture ?? 55, 3, 0, 100),
      humidity: drift(prev?.humidity ?? 45, 2, 10, 95),
    }
  }

  onMounted(() => {
    online.value = true
    history.value = [fakeReading()]
    timer = window.setInterval(() => {
      const next = fakeReading(history.value.at(-1))
      history.value = [...history.value, next].slice(-MAX_POINTS)
    }, 2000)
  })

  onUnmounted(() => clearInterval(timer))

  // Pretend the ESP32 takes 400ms to confirm.
  function confirmAfterDelay(apply: () => void) {
    busy.value = true
    setTimeout(() => {
      apply()
      busy.value = false
    }, 400)
  }

  function setManual(value: boolean) {
    confirmAfterDelay(() => {
      manualMode.value = value
      if (!value) pumpOn.value = false // leaving manual mode stops the pump
    })
  }

  function setPump(value: boolean) {
    if (!manualMode.value) return // same rule the ESP32 will enforce
    confirmAfterDelay(() => (pumpOn.value = value))
  }

  return { online, history, manualMode, pumpOn, busy, setManual, setPump }
}
