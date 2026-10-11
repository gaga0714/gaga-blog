<template>
  <div class="gm-ambient" aria-hidden="true">
    <div class="gm-daylight">
      <span class="gm-daylight-band gm-daylight-band-main" />
      <span class="gm-daylight-band gm-daylight-band-cross" />
    </div>
    <div class="gm-ambient-light" />
    <div class="gm-ambient-shadow" />
    <div class="gm-ambient-sheen" />
  </div>
</template>

<style scoped>
.gm-ambient {
  position:fixed;
  inset:0;
  z-index:-1;
  overflow:hidden;
  pointer-events:none;
  contain:strict;
}
.dark .gm-ambient {
  --ambient-light:rgb(225 231 236 / 22%);
  --ambient-light-edge:rgb(225 231 236 / 8%);
  --ambient-shade:rgb(0 0 0 / 55%);
  --ambient-shade-edge:rgb(0 0 0 / 18%);
  --ambient-beam:rgb(230 235 240 / 12%);
}
.gm-ambient > div { position:absolute; pointer-events:none; }
.gm-daylight { inset:0; }
.gm-daylight-band {
  position:absolute;
  top:-20vh;
  width:clamp(28px,9vw,144px);
  height:140vh;
}
.gm-daylight-band-main {
  left:0;
  background:radial-gradient(ellipse at 0% 36%,rgb(95 103 112 / 15%),transparent 72%);
  animation:gm-daylight-rise 16s ease-in-out -4s infinite alternate;
}
.gm-daylight-band-cross {
  right:0;
  background:radial-gradient(ellipse at 100% 64%,rgb(95 103 112 / 13%),transparent 72%);
  animation:gm-daylight-fall 20s ease-in-out -9s infinite alternate;
}
.dark .gm-daylight { display:none; }
.dark .gm-ambient > :not(.gm-daylight) { display:block; }
.gm-ambient-light {
  display:none;
  width:64vmax;
  height:64vmax;
  left:-10vmax;
  top:-18vmax;
  background:radial-gradient(circle,var(--ambient-light) 0%,var(--ambient-light-edge) 27%,transparent 64%);
  animation:gm-light-drift 12s ease-in-out infinite alternate;
}
.gm-ambient-shadow {
  display:none;
  width:70vmax;
  height:70vmax;
  right:-20vmax;
  top:-8vmax;
  background:radial-gradient(circle,var(--ambient-shade) 0%,var(--ambient-shade-edge) 30%,transparent 66%);
  animation:gm-shadow-drift 15s ease-in-out infinite alternate;
}
.gm-ambient-sheen {
  display:none;
  inset:-35%;
  opacity:.65;
  background:linear-gradient(115deg,transparent 40%,var(--ambient-beam) 50%,transparent 60%);
  animation:gm-sheen-drift 18s ease-in-out infinite alternate;
}
@keyframes gm-daylight-rise {
  from { transform:translate3d(0,8vh,0); opacity:.55; }
  to { transform:translate3d(0,-8vh,0); opacity:.85; }
}
@keyframes gm-daylight-fall {
  from { transform:translate3d(0,-10vh,0); opacity:.85; }
  to { transform:translate3d(0,10vh,0); opacity:.55; }
}
@keyframes gm-light-drift {
  from { transform:translate3d(0,0,0) scale(.95); opacity:.75; }
  to { transform:translate3d(40vw,20vh,0) scale(1.12); opacity:1; }
}
@keyframes gm-shadow-drift {
  from { transform:translate3d(0,0,0) scale(1); opacity:1; }
  to { transform:translate3d(-35vw,35vh,0) scale(1.1); opacity:.7; }
}
@keyframes gm-sheen-drift {
  from { transform:translate3d(-18%,0,0); }
  to { transform:translate3d(18%,6%,0); }
}
@media (max-width:640px) {
  .dark .gm-ambient > .gm-ambient-sheen { display:none; }
  .gm-ambient-light { width:90vmax; height:90vmax; left:-40vmax; top:-25vmax; }
  .gm-ambient-shadow { width:85vmax; height:85vmax; right:-42vmax; top:0; }
}
@media (prefers-reduced-motion:reduce) {
  .gm-ambient > div,.gm-daylight-band { animation:none; }
}
</style>
