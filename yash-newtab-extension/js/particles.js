(function() {
  var canvas = document.getElementById('google-particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var width, height;
  var particles = [];
  var mouseX = -1000, mouseY = -1000;
  var influenceRadius = 100;
  var forceFactor = 300;
  var lastActivityTime = Date.now();
  var idleThreshold = 10000;
  var idleAmount = 0;
  var linkDistance = 35;
  var defaultPalette = [
    { r: 80, g: 80, b: 90 },
    { r: 100, g: 100, b: 110 },
    { r: 255, g: 140, b: 0 },
    { r: 60, g: 60, b: 70 },
    { r: 120, g: 120, b: 130 }
  ];
  var currentPalette = defaultPalette.slice();

  var PALETTES = {
    cyber: [
      { r: 0, g: 255, b: 204 },
      { r: 0, g: 255, b: 255 },
      { r: 0, g: 200, b: 170 },
      { r: 180, g: 100, b: 255 },
      { r: 138, g: 43, b: 226 }
    ],
    red: [
      { r: 220, g: 50, b: 50 },
      { r: 200, g: 40, b: 40 },
      { r: 255, g: 80, b: 80 },
      { r: 180, g: 30, b: 30 }
    ],
    blue: [
      { r: 50, g: 100, b: 220 },
      { r: 80, g: 120, b: 255 },
      { r: 30, g: 60, b: 180 },
      { r: 100, g: 150, b: 255 }
    ],
    fire: [
      { r: 255, g: 100, b: 0 },
      { r: 255, g: 180, b: 0 },
      { r: 255, g: 80, b: 40 },
      { r: 220, g: 50, b: 20 },
      { r: 255, g: 140, b: 20 }
    ],
    rainbow: [
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 127, b: 0 },
      { r: 255, g: 255, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 75, g: 0, b: 130 },
      { r: 148, g: 0, b: 211 }
    ],
    cool: [
      { r: 0, g: 255, b: 255 },
      { r: 0, g: 200, b: 220 },
      { r: 100, g: 200, b: 255 },
      { r: 80, g: 180, b: 220 },
      { r: 0, g: 230, b: 240 }
    ],
    forest: [
      { r: 34, g: 100, b: 50 },
      { r: 20, g: 80, b: 40 },
      { r: 60, g: 120, b: 60 },
      { r: 15, g: 60, b: 30 },
      { r: 45, g: 110, b: 55 }
    ],
    chocolate: [
      { r: 210, g: 105, b: 30 },
      { r: 139, g: 69, b: 19 },
      { r: 160, g: 82, b: 45 },
      { r: 101, g: 67, b: 33 },
      { r: 140, g: 90, b: 40 }
    ],
    ocean: [
      { r: 0, g: 105, b: 148 },
      { r: 0, g: 150, b: 200 },
      { r: 30, g: 144, b: 255 },
      { r: 0, g: 180, b: 200 },
      { r: 20, g: 120, b: 180 }
    ],
    mist: [
      { r: 180, g: 190, b: 200 },
      { r: 200, g: 205, b: 210 },
      { r: 160, g: 175, b: 185 },
      { r: 220, g: 225, b: 230 },
      { r: 190, g: 198, b: 205 }
    ],
    lavender: [
      { r: 230, g: 230, b: 250 },
      { r: 218, g: 112, b: 214 },
      { r: 147, g: 112, b: 219 },
      { r: 186, g: 85, b: 211 },
      { r: 200, g: 162, b: 200 }
    ],
    aussie: [
      { r: 255, g: 200, b: 0 },
      { r: 0, g: 150, b: 100 },
      { r: 255, g: 220, b: 80 },
      { r: 0, g: 120, b: 80 },
      { r: 255, g: 210, b: 50 }
    ],
    desert: [
      { r: 210, g: 180, b: 140 },
      { r: 194, g: 178, b: 128 },
      { r: 244, g: 164, b: 96 },
      { r: 205, g: 133, b: 63 },
      { r: 222, g: 184, b: 135 }
    ],
    dessert: [
      { r: 255, g: 182, b: 193 },
      { r: 255, g: 218, b: 185 },
      { r: 255, g: 228, b: 225 },
      { r: 221, g: 160, b: 221 },
      { r: 255, g: 192, b: 203 }
    ],
    confetti: [
      { r: 255, g: 0, b: 100 },
      { r: 255, g: 200, b: 0 },
      { r: 0, g: 255, b: 150 },
      { r: 100, g: 150, b: 255 },
      { r: 255, g: 100, b: 255 },
      { r: 0, g: 255, b: 255 },
      { r: 255, g: 100, b: 100 }
    ],
    royal: [
      { r: 138, g: 43, b: 226 },
      { r: 218, g: 165, b: 32 },
      { r: 75, g: 0, b: 130 },
      { r: 255, g: 215, b: 0 },
      { r: 160, g: 100, b: 255 }
    ],
    street: [
      { r: 80, g: 80, b: 90 },
      { r: 100, g: 100, b: 110 },
      { r: 255, g: 140, b: 0 },
      { r: 60, g: 60, b: 70 },
      { r: 120, g: 120, b: 130 }
    ],
    dark: [
      { r: 40, g: 40, b: 45 },
      { r: 25, g: 25, b: 30 },
      { r: 60, g: 60, b: 65 },
      { r: 35, g: 35, b: 42 }
    ],
    light: [
      { r: 240, g: 245, b: 255 },
      { r: 230, g: 235, b: 245 },
      { r: 255, g: 250, b: 250 },
      { r: 220, g: 230, b: 240 },
      { r: 250, g: 248, b: 255 }
    ],
    chaos: [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 255 },
      { r: 255, g: 128, b: 0 }
    ],
    code: [
      { r: 100, g: 180, b: 100 },
      { r: 230, g: 180, b: 80 },
      { r: 200, g: 200, b: 200 },
      { r: 150, g: 150, b: 255 },
      { r: 220, g: 140, b: 120 }
    ],
    candy: [
      { r: 255, g: 182, b: 193 },
      { r: 200, g: 255, b: 220 },
      { r: 255, g: 250, b: 180 },
      { r: 255, g: 200, b: 220 },
      { r: 200, g: 230, b: 255 },
      { r: 255, g: 220, b: 210 }
    ],
    panda: [
      { r: 40, g: 40, b: 40 },
      { r: 240, g: 240, b: 240 },
      { r: 120, g: 120, b: 120 },
      { r: 80, g: 80, b: 80 },
      { r: 200, g: 200, b: 200 }
    ],
    green: [
      { r: 50, g: 200, b: 80 },
      { r: 34, g: 160, b: 60 },
      { r: 100, g: 220, b: 120 },
      { r: 20, g: 140, b: 50 },
      { r: 70, g: 180, b: 90 }
    ],
    burntorange: [
      { r: 204, g: 85, b: 0 },
      { r: 230, g: 100, b: 30 },
      { r: 180, g: 70, b: 0 },
      { r: 255, g: 120, b: 40 },
      { r: 160, g: 60, b: 0 }
    ],
    gray: [
      { r: 128, g: 128, b: 128 },
      { r: 160, g: 160, b: 160 },
      { r: 100, g: 100, b: 100 },
      { r: 180, g: 180, b: 180 },
      { r: 90, g: 90, b: 90 }
    ],
    grey: [
      { r: 128, g: 128, b: 128 },
      { r: 160, g: 160, b: 160 },
      { r: 100, g: 100, b: 100 },
      { r: 180, g: 180, b: 180 },
      { r: 90, g: 90, b: 90 }
    ],
    cyber2: [
      { r: 100, g: 50, b: 255 },
      { r: 138, g: 43, b: 226 },
      { r: 80, g: 80, b: 255 },
      { r: 180, g: 100, b: 255 },
      { r: 60, g: 60, b: 220 },
      { r: 160, g: 80, b: 255 }
    ]
  };
  window.PARTICLE_PALETTE_NAMES = Object.keys(PALETTES);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    var cols = Math.max(2, Math.floor(width / 28));
    var rows = Math.max(2, Math.floor(height / 28));
    particles = [];
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        particles.push({
          x: (j + 0.5) * (width / cols),
          y: (i + 0.5) * (height / rows),
          baseX: (j + 0.5) * (width / cols),
          baseY: (i + 0.5) * (height / rows),
          colorIndex: Math.floor(Math.random() * currentPalette.length),
          baseRadius: 1.2 + Math.random() * 2.8,
          colorPhase: Math.random() * Math.PI * 2,
          colorSpeed: 0.6 + Math.random() * 1.4,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.1 + Math.random() * 1.6,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftSpeed: 0.10 + Math.random() * 0.30,
          driftAmp: 3 + Math.random() * 7
        });
      }
    }
  }

  function anim() {
    if (!ctx || !width || !height) return requestAnimationFrame(anim);
    var now = Date.now();
    if (now - lastActivityTime > idleThreshold) {
      idleAmount = Math.min(1, idleAmount + 0.012);
    } else {
      idleAmount = Math.max(0, idleAmount - 0.08);
    }
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    var springStrength = 0.15;
    var centerX = width / 2;
    var centerY = height / 2;
    var time = now * 0.0008;
    var drawState = [];
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var targetX = p.baseX + Math.sin(time * p.driftSpeed + p.driftPhaseX) * p.driftAmp;
      var targetY = p.baseY + Math.cos(time * p.driftSpeed * 0.9 + p.driftPhaseY) * p.driftAmp;
      if (idleAmount > 0) {
        var px = p.x - centerX;
        var py = p.y - centerY;
        var len = Math.sqrt(px * px + py * py) || 1;
        var tx = -py / len;
        var ty = px / len;
        var swirl = Math.sin(time + i * 0.15) * 0.5 * idleAmount;
        p.x += tx * swirl + (Math.random() - 0.5) * 1.0 * idleAmount;
        p.y += ty * swirl + (Math.random() - 0.5) * 1.0 * idleAmount;
        targetX += Math.sin(time * 1.4 + p.driftPhaseX) * 10 * idleAmount;
        targetY += Math.cos(time * 1.2 + p.driftPhaseY) * 10 * idleAmount;
      }
      var dx = mouseX - p.x;
      var dy = mouseY - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var fx = (targetX - p.x) * springStrength;
      var fy = (targetY - p.y) * springStrength;
      if (dist < influenceRadius && dist > 0) {
        var f = (1 - dist / influenceRadius) * forceFactor / 100;
        fx -= (dx / dist) * f;
        fy -= (dy / dist) * f;
      }
      p.x += fx;
      p.y += fy;
      var paletteLen = Math.max(1, currentPalette.length);
      var colorMix = (Math.sin(time * p.colorSpeed + p.colorPhase) + 1) * 0.5;
      var c0 = currentPalette[p.colorIndex % paletteLen];
      var c1 = currentPalette[(p.colorIndex + 1) % paletteLen];
      var cr = Math.round(c0.r + (c1.r - c0.r) * colorMix);
      var cg = Math.round(c0.g + (c1.g - c0.g) * colorMix);
      var cb = Math.round(c0.b + (c1.b - c0.b) * colorMix);
      var brightness = 0.82 + 0.18 * Math.sin(time * p.pulseSpeed * 1.3 + p.pulsePhase);
      cr = Math.min(255, Math.round(cr * brightness));
      cg = Math.min(255, Math.round(cg * brightness));
      cb = Math.min(255, Math.round(cb * brightness));
      var radius = p.baseRadius * (0.8 + 0.5 * Math.sin(time * p.pulseSpeed + p.pulsePhase));
      var alpha = 0.72 + 0.28 * colorMix;
      drawState.push({ x: p.x, y: p.y, cr: cr, cg: cg, cb: cb, radius: radius, alpha: alpha });
    }

    for (var li = 0; li < drawState.length; li++) {
      for (var lj = li + 1; lj < drawState.length; lj++) {
        var a = drawState[li];
        var b = drawState[lj];
        var ldx = a.x - b.x;
        var ldy = a.y - b.y;
        var linkDist = Math.sqrt(ldx * ldx + ldy * ldy);
        if (linkDist < linkDistance) {
          var linkAlpha = (1 - linkDist / linkDistance) * 0.32;
          var lr = Math.round((a.cr + b.cr) / 2);
          var lg = Math.round((a.cg + b.cg) / 2);
          var lb = Math.round((a.cb + b.cb) / 2);
          ctx.strokeStyle = 'rgba(' + lr + ',' + lg + ',' + lb + ',' + linkAlpha + ')';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (var di = 0; di < drawState.length; di++) {
      var d = drawState[di];
      ctx.fillStyle = 'rgba(' + d.cr + ',' + d.cg + ',' + d.cb + ',' + d.alpha + ')';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(anim);
  }

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastActivityTime = Date.now();
  });
  document.addEventListener('mouseleave', function() {
    mouseX = -1000;
    mouseY = -1000;
  });
  document.addEventListener('keydown', function() { lastActivityTime = Date.now(); });
  document.addEventListener('keyup', function() { lastActivityTime = Date.now(); });

  window.updateParticleColors = function(mode) {
    if (mode === 'reset' || mode === 'default') {
      currentPalette = defaultPalette.slice();
      return;
    }
    if (PALETTES[mode]) {
      currentPalette = PALETTES[mode].map(function(c) { return { r: c.r, g: c.g, b: c.b }; });
      return;
    }
    if (mode === 'single' && arguments[1]) {
      var hex = arguments[1].replace(/^#/, '');
      var r = parseInt(hex.slice(0, 2), 16);
      var g = parseInt(hex.slice(2, 4), 16);
      var b = parseInt(hex.slice(4, 6), 16);
      currentPalette = [{ r: r, g: g, b: b }];
      return;
    }
    if (mode === 'gradient' && arguments.length >= 4) {
      currentPalette = [];
      for (var i = 1; i <= 3; i++) {
        var h = arguments[i].replace(/^#/, '');
        currentPalette.push({
          r: parseInt(h.slice(0, 2), 16),
          g: parseInt(h.slice(2, 4), 16),
          b: parseInt(h.slice(4, 6), 16)
        });
      }
    }
  };

  window.setParticleRadius = function(r) {
    influenceRadius = Math.max(0, Number(r));
  };

  window.setParticleForce = function(f) {
    forceFactor = Math.max(0, Number(f));
  };

  window.getParticleRadius = function() {
    return influenceRadius;
  };

  window.getParticleForce = function() {
    return forceFactor;
  };

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(anim);
})();
