// Minimal interactivity for the birthday vault
(function(){
  // helpers
  const $ = sel=>document.querySelector(sel);

  // Entry portal
  const enterBtn = $('#enterBtn');
  const musicToggle = $('#musicToggle');
  const bgAudio = $('#bgAudio');
  const confettiCanvas = $('#confettiCanvas');

  if(enterBtn){
    enterBtn.addEventListener('click', ()=>{
      // simple fade and navigate
      document.body.style.transition = 'opacity .8s';
      document.body.style.opacity = 0;
      setTimeout(()=> location.href = 'giftroom.html', 800);
    });
  }

  if(musicToggle && bgAudio){
    musicToggle.addEventListener('click', ()=>{
      if(bgAudio.paused){bgAudio.play(); musicToggle.textContent='Pause music'}
      else{bgAudio.pause(); musicToggle.textContent='Play music'}
    });
  }

  // Giftroom interactions
  const gifts = document.querySelectorAll('.gift');
  const modal = $('#modal');
  const modalContent = $('#modalContent');
  const closeModal = $('#closeModal');
  const confettiCanvas2 = $('#confettiCanvas2');
  const musicUpload = document.getElementById('musicUpload');
  const progressFill = document.getElementById('progressFill');
  const maturityText = document.getElementById('maturity');
  let maturity = 18;

  function openModal(html){
    if(!modal) return;
    modalContent.innerHTML = html;
    modal.classList.remove('hidden');
    playPop();
  }
  function close(){ modal.classList.add('hidden'); modalContent.innerHTML=''; }
  if(closeModal) closeModal.addEventListener('click', close);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });

  // initial wiggle for gifts
  gifts.forEach((g,i)=>{ setTimeout(()=>g.classList.add('wiggle'), 300 + i*120); });

  gifts.forEach(g=>g.addEventListener('click', (e)=>{
    e.stopPropagation();
    g.classList.remove('wiggle');
    const kind = g.dataset.gift;
    triggerConfetti();
    bumpProgress(4);
    switch(kind){
      case 'playlist':
        openModal(`<h2>Playlist: 18 and still cooler than the rest</h2>
          <p>Open the playlist below:</p>
          <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          <p><a href="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" target="_blank" rel="noopener">Open Spotify</a> · <a href="https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj" target="_blank">Open YouTube</a></p>`);
        break;
      case 'wallpapers':
        openModal(`<h2>Wallpaper Pack</h2>
          <p>Phone wallpapers ready to download:</p>
          <ul>
            <li><a href="images/flower.jpg" download>Wallpaper 1 (flower)</a></li>
            <li><a href="images/happy_bday_dogs.jpg" download>Wallpaper 2 (dogs)</a></li>
            <li><a href="images/20250315_182545.jpg" download>Wallpaper 3</a></li>
          </ul>`);
        break;
      case 'slideshow': {
        // build a tape-like slideshow from images in images/ except profile
        const images = ['20250315_182545.jpg','20250316_093940.jpg','flower.jpg','happy_bday_dogs.jpg'];
        let idx = 0;
        const slides = images.map(src=>`<div class="tape-slide"><img src="images/${src}" alt="slide" style="max-width:100%;max-height:320px;border-radius:10px;box-shadow:0 2px 12px #0002;"></div>`).join('');
        openModal(`<h2>Memory Tape</h2>
          <div class="tape-player" id="tapePlayer">${slides}</div>
          <div style="text-align:center;margin-top:8px"><button id="tapePrev" class="btn">◀</button> <button id="tapeNext" class="btn">▶</button></div>`);
        setTimeout(()=>{
          const player = document.getElementById('tapePlayer');
          const slidesEl = player.querySelectorAll('.tape-slide');
          function show(i){ slidesEl.forEach((s,si)=> { s.style.display = si===i? 'block':'none'; }); }
          show(0);
          document.getElementById('tapePrev').addEventListener('click', ()=>{ idx = (idx-1+slidesEl.length)%slidesEl.length; show(idx); });
          document.getElementById('tapeNext').addEventListener('click', ()=>{ idx = (idx+1)%slidesEl.length; show(idx); });
        },60);
        break;
      }
      case 'quiz':
        openModal(`<h2>Which kind of adult are you?</h2>
          <p>Take this quick personality quiz:</p>
          <p><a href="https://uquiz.com/quiz/which-kind-of-adult-are-you" target="_blank">Open the quiz (uQuiz)</a></p>`);
        break;
      case 'candle':
        openModal(`<h2>Make a Wish 🕯️</h2>
          <p>Click the candle to blow it out and make a wish.</p>
          <div style="font-size:64px;cursor:pointer;display:flex;justify-content:center" id="candle">🕯️</div>
          <div id="wishText" style="margin-top:10px;font-size:18px;color:#ffd36b"></div>`);
        setTimeout(()=>{
          const candle = document.getElementById('candle');
          candle.addEventListener('click', ()=>{
            candle.textContent = '✨';
            document.getElementById('wishText').textContent = 'Wish made! 🎉';
            setTimeout(()=>{
              candle.textContent = '🕯️';
              document.getElementById('wishText').textContent = '';
            },1800);
          });
        },40);
        break;
      case 'drive':
        openModal(`<h2>Driving License — Virtual</h2>
          <p>Congrats! You can finally drive!! 🚗🎉</p>
          <p class="cute">Here's a tiny message: <strong>Drive safe, blast your playlist, own the road.</strong> ❤️🚦</p>
          <p>Emoji confetti: 🎉🚗✨</p>`);
        break;
      case 'mirror':
        const compliments = [
          "You’re literally the algorithm’s favorite.",
          "Flaw detected: none.",
          "Mirror’s broken, can’t handle this level of slay."
        ];
        openModal(`<h2>Virtual Mirror</h2><div id="mirrorText" class="mirror-text">Click for a compliment</div><div style="text-align:center;margin-top:8px"><button id="complimentBtn" class="btn">Gimme</button></div>`);
        setTimeout(()=>{ document.getElementById('complimentBtn').addEventListener('click', ()=>{ const t = compliments[Math.floor(Math.random()*compliments.length)]; document.getElementById('mirrorText').textContent = t; playPop();}); },50);
        break;
      case 'fortune':
        const fortunes = [
          'Your next snack will be life-changing.',
          'You’ll ace adulthood (after a few tries).',
          'Unexpected cake is coming your way.'
        ];
        openModal(`<h2>Digital Fortune Cookies</h2><div id="fortuneText" class="mirror-text">Click to crack a cookie</div><div style="text-align:center;margin-top:8px"><button id="fortuneBtn" class="btn">Crack it</button></div>`);
        setTimeout(()=>{ document.getElementById('fortuneBtn').addEventListener('click', ()=>{ const f = fortunes[Math.floor(Math.random()*fortunes.length)]; document.getElementById('fortuneText').textContent = f; triggerConfetti(); playPop(); }); },50);
        break;
      case 'pwd':
        openModal(`<h2>Adult Check</h2><p>Only real adults can open this. Password: <em>chaos</em></p>
          <input id="pwdInput" placeholder="enter password" style="padding:8px;border-radius:6px;border:1px solid #ccc"><button id="pwdOpen" class="btn">Open</button>
          <div id="pwdResult" style="margin-top:8px"></div>`);
        setTimeout(()=>{ document.getElementById('pwdOpen').addEventListener('click', ()=>{ const v=document.getElementById('pwdInput').value.trim(); if(v.toLowerCase()==='chaos'){ document.getElementById('pwdResult').innerHTML = '<strong>You passed. Barely.</strong> <br><a href="https://i.imgur.com/3G6vK7Z.gif" target="_blank">Secret Meme</a>'; triggerConfetti(); playPop(); } else { document.getElementById('pwdResult').textContent='Nope — try again.' } }); },40);
        break;
      case 'secret':
        openModal(`<h2>Secret Found 🎉</h2>
          <p>You cracked the mystery box. Here's a secret note:</p>
          <blockquote>Wouldn't this be better than a regular card? 😏</blockquote>
          <p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">Open the secret</a></p>`);
        break;
    }
  }));

  // confetti: falling confetti for 10 seconds
  function runTimedConfetti(durationMs = 10000){
    const canvas = confettiCanvas2 || confettiCanvas;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const colors = ['#ff7ab6','#7af2ff','#ffd36b','#9bffb3','#c7b3ff'];
    const pieces = [];

    function spawn(){
      const x = Math.random()*w;
      const size = 6 + Math.random()*10;
      pieces.push({x, y:-20 + Math.random()*-40, vx:(Math.random()-0.5)*1.5, vy:1+Math.random()*3, r:size, c:colors[Math.floor(Math.random()*colors.length)], rot:Math.random()*Math.PI});
    }

    let running = true;
    const start = performance.now();

    function frame(now){
      if(!running) return;
      ctx.clearRect(0,0,w,h);
      // spawn several pieces each frame for dense confetti
      for(let i=0;i<6;i++) spawn();
      for(let i=pieces.length-1;i>=0;i--){
        const p = pieces[i];
        p.vy += 0.03; p.x += p.vx; p.y += p.vy; p.rot += 0.05;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6);
        ctx.restore();
        if(p.y - p.r > h) pieces.splice(i,1);
      }
      if(now - start < durationMs) requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0,0,w,h); }
    }

    requestAnimationFrame(frame);
    // adjust canvas size on resize
    window.addEventListener('resize', ()=>{ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
  }

  // small sound effects
  function playPop(){ try{ const s=new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'); s.volume=0.6; s.play(); }catch(e){} }

  // bump maturity/progress
  function bumpProgress(amount=3){ maturity = Math.min(100, maturity + amount); if(progressFill) progressFill.style.width = maturity + '%'; if(maturityText) maturityText.textContent = maturity + '%'; if(maturity===100) { showAchievement('Achievement unlocked: adult-ish'); } }

  function showAchievement(text){ const ach = document.createElement('div'); ach.className='achievement'; ach.textContent = text; document.body.appendChild(ach); setTimeout(()=>ach.classList.add('visible'),60); setTimeout(()=>{ ach.classList.remove('visible'); setTimeout(()=>ach.remove(),600) },3000); }

  // show banner and start timed confetti on portal page load
  const banner = document.getElementById('birthdayBanner');
  if(banner){
    // show banner
    setTimeout(()=> banner.classList.add('show'), 80);
    // hide after 10s
    setTimeout(()=> banner.classList.remove('show'), 10000);
    // run confetti for 10s
    runTimedConfetti(10000);
  }

  // balloons on load
  function spawnBalloons(){
    for(let i=0;i<3;i++){ const b=document.createElement('div'); b.className='balloon'; b.style.left = (10 + i*22) + '%'; b.textContent='🎈'; document.body.appendChild(b); setTimeout(()=>b.remove(),11000); }
  }
  spawnBalloons();

  // cursor sparkles
  document.addEventListener('mousemove', (e)=>{
    const s = document.createElement('div'); s.className='sparkle'; s.style.left = (e.pageX - 6) + 'px'; s.style.top = (e.pageY - 6) + 'px'; s.textContent = ['🎈','✨','💫','🪩'][Math.floor(Math.random()*4)]; document.body.appendChild(s);
    setTimeout(()=>s.remove(),600);
  });

  // music upload handler
  if(musicUpload && bgAudio){
    musicUpload.addEventListener('change', (e)=>{
      const f = e.target.files[0]; if(!f) return; const url = URL.createObjectURL(f); bgAudio.src = url; bgAudio.play(); musicToggle.textContent='Pause music'; showAchievement('Now playing: custom track');
    });
  }

  // mute toggle on gift room header
  const muteBtn = $('#muteBtn');
  if(muteBtn){
    muteBtn.addEventListener('click', ()=>{
      const a = document.querySelector('#bgAudio');
      if(a){ if(a.paused){ a.play(); muteBtn.textContent='Mute' } else { a.pause(); muteBtn.textContent='Unmute' } }
    });
  }

})();
