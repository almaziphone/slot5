<template>
  <div id="viewport">
    <div id="container">
      <div id="header">
        <h1>Slots Machine</h1>
        <h3>Play and Win</h3>
      </div>
      <div id="reels">
        <canvas ref="canvas1" width="70" height="300"></canvas>
        <canvas ref="canvas2" width="70" height="300"></canvas>
        <canvas ref="canvas3" width="70" height="300"></canvas>
        <div id="overlay">
          <div id="winline"></div>
        </div>
        <div id="results" v-show="showResult">
          <div id="score">
            <span id="multiplier">{{ matches }}</span> x
            <img src="img/reel-icon-4.png" />
          </div>
          <div id="status">{{ statusText }}</div>
        </div>
        <div id="loading" v-if="loading">
          <p>Loading..</p>
          <div id="progressbar">
            <div id="progress" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div id="buttons">
        <button id="play" class="button button-default" @click="start">Play</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';

interface Item {
  path: string;
  id: string;
  img?: HTMLImageElement;
}

const items: Item[] = [
  { path: 'reel-icon-1', id: 'reel1' },
  { path: 'reel-icon-2', id: 'reel2' },
  { path: 'reel-icon-3', id: 'reel3' },
  { path: 'reel-icon-4', id: 'reel4' },
  { path: 'reel-icon-5', id: 'reel5' },
  { path: 'reel-icon-6', id: 'reel6' }
];

const BLURB_TBL = ['No win!', 'Good!', 'Excellent!', 'JACKPOT!'];

const canvas1 = ref<HTMLCanvasElement | null>(null);
const canvas2 = ref<HTMLCanvasElement | null>(null);
const canvas3 = ref<HTMLCanvasElement | null>(null);

const loading = ref(true);
const progress = ref(0);
const showResult = ref(false);
const matches = ref(0);
const statusText = ref('');

interface ReelState {
  index: number;
  timer?: number;
}

const reels = reactive<ReelState[]>([
  { index: 0 },
  { index: 0 },
  { index: 0 }
]);

function draw(canvas: HTMLCanvasElement, item: Item) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(item.img!, 3, 5);
}

async function preloadImages() {
  let loaded = 0;
  for (const item of items) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.src = `img/${item.path}.png`;
      img.onload = () => {
        item.img = img;
        loaded++;
        progress.value = (loaded / items.length) * 100;
        resolve();
      };
    });
  }
}

function stopReel(i: number) {
  const reel = reels[i];
  if (reel.timer) {
    clearInterval(reel.timer);
    reel.timer = undefined;
  }
  if (!reels.some(r => r.timer)) {
    // all stopped
    showResult.value = true;
    const ids = reels.map(r => r.index);
    if (ids[0] === ids[1] && ids[1] === ids[2]) {
      matches.value = 3;
    } else if (ids[0] === ids[1] || ids[1] === ids[2] || ids[0] === ids[2]) {
      matches.value = 2;
    } else {
      matches.value = 0;
    }
    statusText.value = BLURB_TBL[matches.value];
  }
}

function start() {
  showResult.value = false;
  matches.value = 0;
  statusText.value = '';

  [canvas1, canvas2, canvas3].forEach((c, i) => {
    const canvas = c.value!;
    const reel = reels[i];
    if (reel.timer) clearInterval(reel.timer);
    reel.timer = window.setInterval(() => {
      reel.index = (reel.index + 1) % items.length;
      draw(canvas, items[reel.index]);
    }, 50);
  });

  setTimeout(() => stopReel(0), 2000);
  setTimeout(() => stopReel(1), 3000);
  setTimeout(() => stopReel(2), 4000);
}

onMounted(async () => {
  await preloadImages();
  loading.value = false;
  draw(canvas1.value!, items[0]);
  draw(canvas2.value!, items[1]);
  draw(canvas3.value!, items[2]);
});
</script>
