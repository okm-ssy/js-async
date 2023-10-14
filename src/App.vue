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

const colors = [
"#aa0000",
"#00aa00",
"#0000aa",
"#00aaaa",
"#aa00aa",
"#aaaa00",
"#aaaaaa",
]

const asyncFunctions = ref<Array<AsyncFunction>>([
  new AsyncFunction('1', colors[0]),
  new AsyncFunction('2', colors[1])
]);

const run = async () => {
  if (asyncType.value === 'parallel') await runParallel();
  else if (asyncType.value === 'vertical') await runVertical();
}

const runParallel = async () => {
  const functions: Array<Promise<void>> = [];
  asyncFunctions.value.forEach(f => {
    functions.push(f.invoke(now.value));
  });
  return await Promise.all(functions);
}

const runVertical = async () => {

  for (const f of asyncFunctions.value) {
    await f.invoke(now.value);
  }
}

const pushFunction = () => {
  const sz = asyncFunctions.value.length;
  const label = `function ${sz + 1}`;
  const color = colors[sz % colors.length];
  asyncFunctions.value.push(new AsyncFunction(label, color, [], 2000));
}

const reset = () => {
  now.value = 1;
  asyncFunctions.value.forEach(v => { v.reset(); });
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
    <div class="flex space-x-4">
      <button
        class="w-32 border rounded-lg py-4 bg-blue-900"
        @click="reset()"
      >
        リセット
      </button>
      <button
        class="w-32 border rounded-lg py-4 bg-yellow-600"
        @click="pushFunction()"
      >
        追加
      </button>
      <button
        class="w-32 border rounded-lg py-4 bg-red-900"
        @click="run()"
      >
        開始
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
