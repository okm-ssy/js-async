<script setup lang="ts">
import { AsyncFunction } from '@/models/AsyncFunction.ts'
import { computed } from 'vue';

const props = defineProps<{
  asyncFunction: AsyncFunction,
  now: number,
}>();

const percents = computed(() => {
  const invokePoints = [0, ...props.asyncFunction.periods, props.now];
  const sz = invokePoints.length;

  const ret: number[] = [];
  // 白・色の順にする
  // [0, 1, 3, 5, 10] --> [10, 20, 20, 50]
  for (let i = 0; i < sz - 1; i++) {
    ret.push((invokePoints[i + 1] - invokePoints[i]) * 100 / props.now);
  }
  return ret;
});

const getColor = (num: number) => {
  if (num % 2 === 0) {
    return '#000000';
  }
  return props.asyncFunction.color;
}

const timeLabel = () => {
  const time = Math.floor(props.asyncFunction.wait_milliseconds) / 1000;
  return `(${time}s)`
}

const borderColorClass = () => {
  if (props.asyncFunction.state() === 'fulfilled') {
    return  'border-green-300';
  }
  
  if (props.asyncFunction.state() === 'pending') {
    return  'border-yellow-300';
  }

  if (props.asyncFunction.state() === 'reject') {
    return  'border-red-300';
  }

  return 'border-white'
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <div class="w-32 break-words flex-shrink-0">
      {{ asyncFunction.label }}
    </div>
    <div class="w-16">
      {{ timeLabel() }}
    </div>
    <div class="flex border-4 bg-slate-900 h-10 w-full"
      :class="borderColorClass()">
      <div 
        v-for="(percent, index) in percents"
        :key="index"
        class="h-full" :style="{ width: `${percent}%`, backgroundColor: getColor(index) }"></div>
    </div>
  </div>
</template>

<style scoped>
</style>