<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import ToggleSwitch from 'primevue/toggleswitch'
import SensorCard from './components/SensorCard.vue'
import { useDashboard } from './composables/useDashboard'

const { online, history, manualMode, pumpOn, busy, setManual, setPump } = useDashboard()

const times = computed(() => history.value.map((r) => r.time))
const latest = computed(() => history.value.at(-1) ?? null)
</script>

<template>
  <main class="page">
    <header class="header">
      <h1>Farm Dashboard</h1>
      <Tag :value="online ? 'ESP32 online' : 'ESP32 offline'" :severity="online ? 'success' : 'danger'" />
    </header>

    <section class="sensors">
      <SensorCard
        label="Temperature"
        unit="°C"
        color="#ef4444"
        :value="latest?.temperature ?? null"
        :times="times"
        :values="history.map((r) => r.temperature)"
      />
      <SensorCard
        label="Soil moisture"
        unit="%"
        color="#16a34a"
        :value="latest?.soilMoisture ?? null"
        :times="times"
        :values="history.map((r) => r.soilMoisture)"
      />
      <SensorCard
        label="Air humidity"
        unit="%"
        color="#3b82f6"
        :value="latest?.humidity ?? null"
        :times="times"
        :values="history.map((r) => r.humidity)"
      />
    </section>

    <Card>
      <template #title>Controls</template>
      <template #content>
        <div class="control">
          <label for="manual">Manual mode</label>
          <ToggleSwitch
            inputId="manual"
            :modelValue="manualMode"
            :disabled="!online || busy"
            @update:modelValue="setManual"
          />
        </div>
        <div class="control">
          <label for="pump">Water pump</label>
          <ToggleSwitch
            inputId="pump"
            :modelValue="pumpOn"
            :disabled="!online || busy || !manualMode"
            @update:modelValue="setPump"
          />
        </div>
        <small v-if="!manualMode">Turn on manual mode to control the pump.</small>
      </template>
    </Card>
  </main>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  margin: 0;
  font-size: 1.5rem;
}
.sensors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
}
</style>
