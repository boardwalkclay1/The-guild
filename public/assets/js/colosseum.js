// ------------------------------
// SCENE DATA
// ------------------------------
const scenes = [

  {
    image: "colosseum-1.jpg",
    rumble: false,
    text: `
      <p>Life outside the <span class="glow">Door</span> is not dramatic. It is not heroic. It is something far more suffocating — <strong>small</strong>.</p>
      <p>People wake up tired and go to sleep worried. They stretch paychecks like thin cloth over a wound that never heals. They ration hope the way the poor ration food — carefully, quietly, ashamed to admit how hungry they really are.</p>
      <p>Children learn early that wanting too much is dangerous. Dreams are treated like luxuries, not necessities. And every adult carries the same quiet ache: the ache of a life that never had room for them.</p>
      <p>In this world of scarcity and shrinking horizons, there is one rumor that refuses to die. A rumor about a <span class="glow">Door</span>. A Door that does not belong here. A Door that leads somewhere else — somewhere no one can describe, only fear.</p>
      <p>They say that behind that Door is screaming. They say that anyone who enters never returns. They say that whatever is on the other side is worse than the poverty we know.</p>
      <p>And yet… in the same breath, with the same trembling voice, they whisper something else: that behind that Door, there might be a life of riches, wealth, and <span class="glow">freedom</span> so vast that no one out here even has the language to describe it.</p>
    `
  },

  {
    image: "colosseum-1.jpg",
    rumble: false,
    text: `
      <p>The <span class="glow">Door</span> stands at the edge of our world like a wound in the stone. No signs. No guards. No instructions. Just a silent challenge.</p>
      <p>People come close enough to hear, but never close enough to touch. They press their ears to the cold wall beside it, and what they hear sends them stumbling back.</p>
      <p>The roar of something ancient. The clash of steel. The sound of bones breaking. The long, raw scream of someone realizing too late that they were not ready.</p>
      <p>Parents point to the Door and say, “Stay away. No one who goes in there ever comes back.” Fear becomes tradition. Tradition becomes truth. Truth becomes a cage.</p>
      <p>And the Door waits.</p>
    `
  },

  {
    image: "colosseum-1.jpg",
    rumble: false,
    text: `
      <p>But fear is never the whole story. It is just the loudest one.</p>
      <p>In the same breath that they warn you, some people lean in closer, eyes darting, and whisper the forbidden part:</p>
      <p>That beyond the screams, beyond the fire, beyond the <span class="glow">Dragons</span> — there is a place where the poor are no longer poor. Where the chains of this small life fall off. Where <span class="glow">freedom</span> is not a fantasy, but a landscape.</p>
      <p>They say some people never return not because they died — but because they found something worth staying for.</p>
      <p>Once you hear that part of the story, you cannot unhear it. Once you know the Door might be a grave or a gateway, you cannot go back to pretending it’s just a wall.</p>
    `
  },

  {
    image: "colosseum-2.jpg",
    rumble: false,
    text: `
      <p>I heard the same stories as everyone else. The screams. The warnings. The wise men shaking their heads.</p>
      <p>For years, I let their fear become my logic. I told myself survival was enough. I told myself wanting more was reckless.</p>
      <p>But the rumor of riches would not leave me alone. It followed me like a shadow. It whispered to me in the quiet moments. It asked me questions I could not ignore.</p>
      <p>One day, the question changed. It stopped being: <strong>“What if I die if I go through that Door?”</strong> and became: <strong>“What if I die having never tried?”</strong></p>
      <p>That was nine years ago — the day I decided I would rather face the <span class="glow">Dragons</span> than live the rest of my life staring at a Door I was too afraid to open.</p>
    `
  },

  {
    image: "colosseum-2.jpg",
    rumble: true,
    text: `
      <p>When I finally walked toward the <span class="glow">Door</span>, no one walked with me.</p>
      <p>They watched from a distance, eyes wide, hands half‑raised as if they wanted to stop me but knew they couldn’t. Some shook their heads. Some whispered prayers. Some looked away.</p>
      <p>A few tried to pull me back. They said, “You don’t know what’s in there.” I said, “You don’t know what’s out here either.”</p>
      <p>I put my hand on the Door. It was cold. Heavy. Alive.</p>
      <p>Fear is not a reason to stay poor. Fear is not a reason to live small.</p>
      <p>So I pushed the Door open and stepped through, alone.</p>
    `
  },

  {
    image: "colosseum-2.jpg",
    rumble: true,
    text: `
      <p>On the other side of the Door, the world changed.</p>
      <p>The air was hotter. Thicker. Charged with something that felt like danger and destiny mixed together.</p>
      <p>I stood in a vast <span class="glow">Arena</span>. Walls rising into darkness. Torches bending in a wind I couldn’t feel. Sand stained with old battles.</p>
      <p>And in the center of the Arena, it waited: a <span class="glow">Dragon</span>. Massive. Coiled. Eyes burning like coals.</p>
      <p>Every story I had ever heard became real.</p>
      <p>I told myself, “If I defeat this Dragon, I will be free.” I was wrong. But I didn’t know that yet.</p>
    `
  },

  {
    image: "colosseum-3.jpg",
    rumble: true,
    text: `
      <p>I charged with everything I had — which, looking back, wasn’t much.</p>
      <p>My armor was thin. My weapon was dull. My courage was loud, but my understanding was small.</p>
      <p>The <span class="glow">Dragon</span> did not care about my intentions. It answered my ambition with fire.</p>
      <p>I was burned. Thrown back. Broken open.</p>
      <p>I retreated, barely alive. People saw my wounds and said, “See? No one comes back from there.”</p>
      <p>But they were wrong. I did come back. And I came back with something they didn’t have: scars that told me the Dragon was real — and so was the Arena.</p>
    `
  },

  {
    image: "colosseum-3.jpg",
    rumble: false,
    text: `
      <p>Pain is a brutal teacher, but it is honest.</p>
      <p>The Dragon showed me exactly where I was weak. Exactly where my armor failed. Exactly where my courage outran my preparation.</p>
      <p>So I went to the forge — not of metal, but of discipline, repetition, humility.</p>
      <p>I rebuilt myself piece by piece. I studied. I practiced. I learned.</p>
      <p>When I returned to the Arena, I did not come to prove I was fearless. I came to prove I was prepared.</p>
    `
  },

  {
    image: "colosseum-3.jpg",
    rumble: true,
    text: `
      <p>The second time I faced the <span class="glow">Dragon</span>, I was not the same person.</p>
      <p>The battle was not easier — but I was different.</p>
      <p>I moved with understanding. I struck with intention. I survived with purpose.</p>
      <p>When the Dragon fell, the Arena shifted. Not with applause — but with acknowledgment.</p>
      <p>I thought it was over. I thought I had “made it.”</p>
      <p>Then the ground trembled again.</p>
    `
  },

  {
    image: "colosseum-4.jpg",
    rumble: true,
    text: `
      <p>From the shadows, something bigger moved.</p>
      <p>A second <span class="glow">Dragon</span>. Heavier. Hotter. More intelligent. More cruel.</p>
      <p>The first Dragon had not been the final test. It had been the introduction.</p>
      <p>Every Dragon you defeat is not the end — it is the beginning of a new chapter.</p>
      <p>I fought. I was wounded. I retreated.</p>
      <p>This was not a one‑time battle. This was a path.</p>
    `
  },

  {
    image: "colosseum-4.jpg",
    rumble: false,
    text: `
      <p>That was nine years ago.</p>
      <p>Since then, I have walked through that Door more times than I can count. I have faced <span class="glow">Dragons</span> of every size and shape. Some I defeated. Some defeated me.</p>
      <p>My body carries the scars. My mind carries the lessons. My soul carries the weight of choosing this path again and again.</p>
      <p>People still say, “No one comes back from that Door.” And in a way, they’re right.</p>
      <p>Many die in the Arena. But some never return because they stay — living the life of riches they fought for.</p>
    `
  },

  {
    image: "colosseum-4.jpg",
    rumble: false,
    text: `
      <p>Every <span class="glow">Dragon</span> has a purse.</p>
      <p>Not just of coin — but of power, perspective, and <span class="glow">freedom</span>.</p>
      <p>The bigger the Dragon, the larger the purse.</p>
      <p>The rumors were true: there is a life of riches and wealth and freedom on the other side of that Door.</p>
      <p>But the rumors left something out: you do not get that life by walking around the Dragons. You get it by walking through them.</p>
      <p>The price is real. The scars are real. The risk is real. But so are the rewards.</p>
    `
  },

  {
    image: "colosseum-finale.jpg",
    rumble: true,
    finale: true,
    text: `
      <p>I am the only one many have seen come back alive from that <span class="glow">Door</span>.</p>
      <p>They look at my scars and think they are proof the Door is cursed. They don’t understand: my scars are proof that I am <span class="glow">forged</span>.</p>
      <p>I still walk through the Door because I know this: if the <span class="glow">Dragons</span> are real, then the riches are too. If the screams are real, then so is the freedom on the other side.</p>
      <p>I cannot walk through the Door for you. I cannot promise you will not bleed. I cannot promise you will not fall.</p>
      <p>But I can tell you this:</p>
      <p>I have been inside. I have seen the Arena. I have fought the Dragons. I have bled for the purses. I have lost and returned. I have won and advanced.</p>
      <p>And after nine years, I am still here — not because the Door is safe, but because the life on the other side is worth everything it cost me.</p>
    `
  }

];

// ------------------------------
// ELEMENTS
// ------------------------------
let currentScene = 0;

const bg = document.getElementById("scene-bg");
const overlay = document.getElementById("scene-overlay");
const text = document.getElementById("scene-text");
const nextBtn = document.getElementById("scene-next");
const emberLayer = document.getElementById("ember-layer");

const audioAmbience = document.getElementById("audio-ambience");
const audioRumble = document.getElementById("audio-rumble");
const audioDoor = document.getElementById("audio-door");

// ------------------------------
// EMBERS
// ------------------------------
function spawnEmber() {
  const ember = document.createElement("div");
  ember.className = "ember";
  ember.style.left = Math.random() * 100 + "vw";
  ember.style.bottom = "-10vh";
  ember.style.animationDuration = 5 + Math.random() * 4 + "s";
  emberLayer.appendChild(ember);

  setTimeout(() => {
    ember.remove();
  }, 9000);
}

setInterval(spawnEmber, 450);

// ------------------------------
// SCENE LOADER
// ------------------------------
function loadScene(index) {
  const scene = scenes[index];

  text.classList.remove("show");
  nextBtn.classList.remove("show");
  bg.style.opacity = 0;
  overlay.style.opacity = 0;

  setTimeout(() => {
    bg.style.backgroundImage = `url('image/${scene.image}')`;
    bg.style.transform = "scale(1.05)";
    text.innerHTML = scene.text;

    setTimeout(() => {
      bg.style.opacity = 1;
      overlay.style.opacity = 1;
      bg.style.transform = "scale(1.0)";
      text.classList.add("show");
      nextBtn.classList.add("show");

      if (scene.rumble) {
        audioRumble.currentTime = 0;
        audioRumble.play().catch(() => {});
      }

      if (scene.finale) {
        audioDoor.currentTime = 0;
        audioDoor.play().catch(() => {});
      }

    }, 200);

  }, 600);
}

// ------------------------------
// BUTTON HANDLER
// ------------------------------
nextBtn.addEventListener("click", () => {
  currentScene++;
  if (currentScene < scenes.length) {
    loadScene(currentScene);
  } else {
    text.innerHTML = "<h2><span class='glow'>The Door is waiting.</span></h2>";
    nextBtn.style.display = "none";
  }
});

// ------------------------------
// START
// ------------------------------
window.onload = () => {
  audioAmbience.volume = 0.6;
  audioAmbience.play().catch(() => {});
  loadScene(0);
};
