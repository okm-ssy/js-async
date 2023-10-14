<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RunTimeViewer from './components/RunTimeViewer.vue'
import { AsyncFunction, AsyncType, sleep } from './models/AsyncFunction.ts'

const asyncType = ref<AsyncType>('vertical');
const toggleType = () => {
  initialize();
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

const running = ref(false);
const now = ref(0.1);
const rate = 100;
setInterval(() => {
  if (running.value) now.value += 0.001 * rate;
}, rate);

const colors = [
"#aa0000",
"#00aa00",
"#0000aa",
"#00ffff",
"#cc00cc",
"#ffff00",
"#aaaaaa",
]

const asyncFunctions = ref<Array<AsyncFunction>>([]);

const run = async () => {
  if (running.value) {
    return;
  }
  running.value = true;
  try {
    if (asyncType.value === 'parallel') await runParallel();
    else if (asyncType.value === 'vertical') await runVertical();
  } finally {
    console.info('finally');
    await sleep(rate);
    running.value = false;
  }
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
  const time_milliseconds = Math.random() * 3000;

  asyncFunctions.value.push(new AsyncFunction(label, color, time_milliseconds));
}

const initialize = () => {
  now.value = 0.05;
  asyncFunctions.value = [];
  pushFunction();
  pushFunction();
  pushFunction();
  asyncFunctions.value.forEach(v => { v.reset(); });
}

onMounted(() => initialize());
</script>

<template>
  <div class="m-3 flex flex-col ">
    <div class="w-full flex justify-center space-x-3 items-center">
      <button
        class="w-16 border rounded-md text-black font-bold"
        :class="toggleButtonColorCSS()"
        @click="toggleType()"
      >
        {{ asyncType }}
      </button>
      <div>{{ "<- 切り替えボタン" }}</div>
    </div>
    <div class="flex space-x-4">
      <button
        class="w-32 border rounded-lg py-4 bg-yellow-600"
        @click="initialize()"
      >
        リセット
      </button>
      <button
        class="w-32 border rounded-lg py-4 bg-blue-600"
        @click="run()"
      >
        開始
      </button>
      <button
        class="w-32 border rounded-lg py-4 bg-red-900"
        @click="pushFunction()"
      >
        追加
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
