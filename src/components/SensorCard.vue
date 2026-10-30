<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'

const props = defineProps<{
  label: string
  unit: string
  value: number | null
  times: number[]
  values: number[]
  color: string
}>()

const chartData = computed(() => ({
  labels: props.times.map((t) => new Date(t).toLocaleTimeString()),
  datasets: [
    {
      data: props.values,
      borderColor: props.color,
      backgroundColor: props.color + '22',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
    },
  ],
}))

const chartOptions = {
  animation: false, // live data, animating every update looks jittery
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { ticks: { maxTicksLimit: 4 } } },
}
</script>

<template>
  <Card>
    <template #title>{{ label }}</template>
    <template #content>
      <div class="value">
        {{ value === null ? '--' : value.toFixed(1) }}<span class="unit">{{ unit }}</span>
      </div>
      <div class="chart">
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.value {
  font-size: 2.25rem;
  font-weight: 700;
}
.unit {
  font-size: 1rem;
  margin-left: 0.25rem;
  opacity: 0.6;
}
.chart {
  height: 160px;
  margin-top: 0.75rem;
}
</style>
