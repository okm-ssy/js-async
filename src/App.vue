<script setup lang="ts">
import { ref } from 'vue';
import RunTimeViewer from './components/RunTimeViewer.vue'
import { AsyncFunction, AsyncType } from './models/AsyncFunction.ts'

const asyncType = ref<AsyncType>('parallel');
const toggleType = () => {
  reset();
  if (asyncType.value === 'parallel') asyncType.value = 'vertical';
  else asyncType.value = 'parallel';
}
const toggleButtonColorCSS = () => {
  if (asyncType.value === 'parallel') {
    return 'bg-green-500';
  }

  if (asyncType.value === 'vertical') {
    return 'bg-yellow-500';
  }

  return 'bg-red-500';
}

const now = ref(10);
setInterval(() => {
  now.value += 0.10
}, 100);

const asyncFunctions = ref<Array<AsyncFunction>>([
  new AsyncFunction('function 1', "#aa0000", [2, 4, 8, 10]),
  new AsyncFunction('function 2', "#00aa00", [1, 5, 7]),
  new AsyncFunction('function 3', "#0000aa", [3, 5])  
]);


// const pushFunction = (label: string, color: string) => {
//   asyncFunctions.value.push(new AsyncFunction(label, color, [], 2000));
// }

const reset = () => {
  now.value = 1;
  asyncFunctions.value.forEach(v => { v.invoke(); v.reset(); });
}
</script>

<template>
  <div class="m-3 flex flex-col ">
    <div class="w-full flex justify-center space-x-3 items-center">
      <button
        class="w-16 border rounded-md"
        :class="toggleButtonColorCSS()"
        @click="toggleType()"
      >
        {{ asyncType }}
      </button>
      <div>{{ "<- 切り替えボタン" }}</div>
    </div>
    <div class="flex">
      <button
        class="ml-1 border rounded-lg px-1"
        @click="reset()">
        リセット
      </button>
    </div>
    <div class="flex flex-col space-y-3 mt-3">
      <RunTimeViewer
        v-for="(asyncFunction, index) in asyncFunctions"
        :key="index"
        :now="now"
        :async-function="asyncFunction"
      />
    </div>
  </div>
</template>
