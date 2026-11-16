/* Planète Dodo · capa de estructura tipo app. Se carga DESPUÉS del script principal. */
(function(){
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  if(!$('.panel-home')) return;

  var L = {
    es:{ home:"Inicio", journal:"Sueño", feeding:"Tomas", signals:"Aprender", family:"Familia",
         s_signals:"Señales", s_nutrition:"Nutrición", s_questions:"Luisa",
         bottle:"Mamadera", breast_l:"Pecho izq.", wet:"Mojado", dirty:"Sucio",
         ask:"Pregúntale a Luisa", ask_sub:"Escribe tu duda y la recibe por WhatsApp o email" },
    fr:{ home:"Accueil", journal:"Sommeil", feeding:"Tétées", signals:"Apprendre", family:"Famille",
         s_signals:"Signes", s_nutrition:"Nutrition", s_questions:"Luisa",
         bottle:"Biberon", breast_l:"Sein gauche", wet:"Pipi", dirty:"Selle",
         ask:"Demandez à Luisa", ask_sub:"Écrivez votre question, elle la reçoit par WhatsApp ou email" },
    en:{ home:"Home", journal:"Sleep", feeding:"Feeds", signals:"Learn", family:"Family",
         s_signals:"Signals", s_nutrition:"Nutrition", s_questions:"Ask Luisa",
         bottle:"Bottle", breast_l:"Left breast", wet:"Wet", dirty:"Dirty",
         ask:"Ask Luisa", ask_sub:"Write your question; she gets it by WhatsApp or email" }
  };
  function lang(){ var l = document.documentElement.lang; return L[l] ? l : "es"; }
  function tr(k){ return L[lang()][k]; }
  function goTab(tab){ var b = $('nav.tabs [data-tab="'+tab+'"]'); if(b) b.click(); }

  /* 1. Inicio: niño/a, tarjeta principal (órbita + cronómetro), registro rápido */
  var home = $('.panel-home');
  var head = $('.section-head', home);
  var childBar = $('#childPillsJournal').parentElement;
  head.after(childBar);

  var hero = document.createElement('div');
  hero.className = 'card hero';
  ['.orbit-wrap', '#orbitCaption', '.timer-buttons', '#timerLive'].forEach(function(sel){ hero.appendChild($(sel)); });
  childBar.after(hero);

  var icons = {
    bottle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 3h4M10 3v3.5c-2 1-3 3-3 5.5v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-7c0-2.5-1-4.5-3-5.5V3"/></svg>',
    breast_l:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/></svg>',
    wet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/></svg>',
    dirty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M9 10c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5-1.3 2-3 2-3 .5-3 2 1.3 2.5 3 2.5 3-1 3-2.5"/></svg>'
  };
  var quick = document.createElement('div');
  quick.className = 'quick-home';
  [['bottle','feed','t'], ['breast_l','feed','t'], ['wet','diaper','d'], ['dirty','diaper','d']].forEach(function(q){
    var b = document.createElement('button');
    b.type = 'button'; b.className = q[2]; b.setAttribute('data-q', q[0]);
    b.innerHTML = '<span class="ic">'+icons[q[0]]+'</span><span class="lb"></span>';
    b.addEventListener('click', function(){
      var target = $('[data-'+q[1]+'="'+q[0]+'"]');
      if(target) target.click();
    });
    quick.appendChild(b);
  });
  hero.after(quick);

  /* 2. Tarjeta "Pregúntale a Luisa" en lugar de los accesos rápidos */
  var ql = $('.quicklinks', home);
  var ask = document.createElement('button');
  ask.type = 'button'; ask.className = 'luisa-card';
  ask.innerHTML = '<span class="av"></span><span><b></b><span></span></span>';
  ask.addEventListener('click', function(){ goTab('questions'); });
  if(ql) ql.replaceWith(ask); else home.appendChild(ask);

  /* 3. Selector Señales · Nutrición · Luisa dentro de "Aprender" */
  var segDefs = [['signals','s_signals'], ['nutrition','s_nutrition'], ['questions','s_questions']];
  segDefs.forEach(function(def){
    var panel = $('.panel[data-panel="'+def[0]+'"]');
    var seg = document.createElement('div');
    seg.className = 'seg'; seg.setAttribute('data-seg', def[0]);
    segDefs.forEach(function(d){
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-to', d[0]);
      if(d[0] === def[0]) b.className = 'on';
      b.addEventListener('click', function(){ goTab(d[0]); });
      seg.appendChild(b);
    });
    panel.insertBefore(seg, panel.firstChild);
  });

  /* 4. Etiquetas (se actualizan al cambiar de idioma) */
  function applyLabels(){
    ['home','journal','feeding','signals','family'].forEach(function(k){
      var span = $('nav.tabs [data-tab="'+k+'"] span');
      if(span){ span.removeAttribute('data-i18n'); span.textContent = tr(k); }
    });
    $$('.seg button').forEach(function(b){
      var d = segDefs.filter(function(x){ return x[0] === b.getAttribute('data-to'); })[0];
      b.textContent = tr(d[1]);
    });
    $$('.quick-home button').forEach(function(b){ $('.lb', b).textContent = tr(b.getAttribute('data-q')); });
    $('b', ask).textContent = tr('ask');
    $('span span', ask).textContent = tr('ask_sub');
  }
  applyLabels();
  $$('.lang-switch button').forEach(function(b){ b.addEventListener('click', function(){ setTimeout(applyLabels, 0); }); });

  /* 5. La pestaña "Aprender" queda activa también en Nutrición y Luisa */
  var map = { nutrition:'signals', questions:'signals' };
  function syncNav(){
    var p = $('section.panel.active'); if(!p) return;
    var k = p.getAttribute('data-panel'); k = map[k] || k;
    $$('nav.tabs button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab') === k); });
  }
  new MutationObserver(syncNav).observe($('main'), { subtree:true, attributes:true, attributeFilter:['class'] });
  syncNav();
})();
