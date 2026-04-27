<template>
  <TimeLine
    :data="singersOverTime"
    :options="singersOverTimeOptions"
    style="height: 90vh; width: 100%"
  />
</template>
<script setup lang="ts">
import { createTypedChart } from 'vue-chartjs';
import { getSongs } from 'src/util/load-table';
import { install } from 'resize-observer';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
if (!window.ResizeObserver) install();

const colors = [
  '#CC6677',
  '#332288',
  '#DDCC77',
  '#117733',
  '#88CCEE',
  '#882255',
  '#44AA99',
  '#999933',
  '#AA4499',
];

const TimeLine = createTypedChart<'line', { x: Date; y: number }[]>(
  'line',
  LineController,
);

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const { songs } = await getSongs();
const singersOverTimeData = [];
let singerCount = 0;
let counter = 0;
const data = songs
  .map((s) => s.date)
  .sort((a, b) => a.getTime() - b.getTime())
  .map((d) => {
    counter += 1;
    return { x: d, y: counter };
  });
data.push({ x: new Date(Date.now()), y: counter });
singersOverTimeData.push({
  label: 'Songs',
  data: data,
  fill: false,
  borderColor:
    singerCount < colors.length
      ? colors[singerCount]
      : '#' + Math.random().toString(16).slice(-6),
  tension: 0.1,
});
singerCount += 1;
const singersOverTime: ChartData<'line', { x: Date; y: number }[]> = {
  labels: ['Songs'],
  datasets: singersOverTimeData,
};
const singersOverTimeOptions: ChartOptions<'line'> = {
  scales: {
    x: { type: 'time', ticks: { source: 'data' }, bounds: 'ticks' },
    y: {
      title: {
        display: true,
        text: 'Songs Recorded',
        color: '#ffffff',
        align: 'center',
      },
    },
  },
  plugins: {
    legend: {
      labels: { color: 'white' },
    },
    title: {
      text: 'Songs Entered Over Time',
      display: true,
      color: '#fff',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};
</script>
