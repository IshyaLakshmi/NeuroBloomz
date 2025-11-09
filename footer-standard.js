/* footer-standard.js
   Replaces existing footer content with a standardized footer and wires the dyslexic toggle.
   Versioned so pages can force-refresh when we update.
*/
(function(){
  const footerHTML = `
  <div class="footer-inner max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row items-start gap-6">
    <div class="footer-left max-w-xs">
      <div class="header-brand" style="display:flex; align-items:center; gap:0.6rem;">
        <img src="assets/logo.png" alt="NeuroBloomz logo" style="width:28px; height:28px; object-fit:contain;" onerror="this.style.display='none'" />
        <h2 class="lovelace-font text-2xl mb-2" style="margin:0;">NeuroBloomz</h2>
      </div>
      <p class="tt-drugs-font text-amber-900 mt-3" style="max-width:340px;">Supporting child development with engaging activities, resources, and guidance for parents and educators.</p>
      <div style="margin-top:0.9rem;">
        <button id="footerDyslexicToggle" class="dys-toggle" aria-pressed="false" title="Dyslexic Font Accessibility" aria-label="Toggle Dyslexic Font Accessibility">Dyslexic Font Accessibility</button>
      </div>
    </div>

    <div class="footer-nav flex flex-wrap gap-12 text-base tt-drugs-font ml-auto">
      <div class="footer-col">
        <h4 style="margin:0 0 0.6rem 0; font-weight:800;">Home</h4>
        <ul class="space-y-2">
          <li><a href="index.html" class="text-black hover:text-black transition">Home</a></li>
          <li><a href="about-website.html" class="text-black hover:text-black transition">About Website</a></li>
          <li><a href="about-me.html" class="text-black hover:text-black transition">About Me</a></li>
          <li><a href="contact.html" class="text-black hover:text-black transition">Contact Me</a></li>
          <li><a href="blog.html" class="text-black hover:text-black transition">Blog</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 style="margin:0 0 0.6rem 0; font-weight:800;">Neurodivergency Page</h4>
        <ul class="space-y-2">
          <li><a href="autism.html" class="text-black hover:text-black transition">Autism</a></li>
          <li><a href="adhd.html" class="text-black hover:text-black transition">ADHD</a></li>
          <li><a href="specific-learning-disorders.html" class="text-black hover:text-black transition">Specific Learning Disorders</a></li>
          <li><a href="language-development.html" class="text-black hover:text-black transition">Language Development</a></li>
          <li><a href="types-of-attention.html" class="text-black hover:text-black transition">Types of Attention</a></li>
        </ul>
        <h4 style="margin:1rem 0 0.5rem 0; font-weight:800;">Resources Page</h4>
      </div>
    </div>
  </div>
  <div class="footer-credit" style="font-size:0.68rem; color:rgba(0,0,0,0.65); text-align:center; margin-top:0.75rem;">
    <div>Icons made from <a href="https://www.onlinewebfonts.com/icon" target="_blank" rel="noopener noreferrer">svg icons</a> licensed by CC BY 4.0</div>
  </div>
  `;

  function wireToggle(){
    function applyState(enabled){
      if(enabled) document.documentElement.classList.add('dyslexic');
      else document.documentElement.classList.remove('dyslexic');
    }

    function syncButtons(){
      const enabled = localStorage.getItem('useDyslexic') === 'true';
      applyState(enabled);
      const fb = document.getElementById('footerDyslexicToggle');
      if(fb) fb.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      const hb = document.getElementById('homeDyslexicToggle');
      if(hb) hb.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    }

    // Event delegation for footer/home toggles (buttons may be added dynamically)
    document.addEventListener('click', function(e){
      if(!e || !e.target) return;
      // support clicks on child elements inside the button using closest()
      const footerBtn = e.target.closest && e.target.closest('#footerDyslexicToggle');
      const homeBtn = e.target.closest && e.target.closest('#homeDyslexicToggle');
      if(footerBtn || homeBtn){
        const cur = localStorage.getItem('useDyslexic') === 'true';
        localStorage.setItem('useDyslexic', (!cur).toString());
        syncButtons();
      }
    });

    // keyboard activation for accessibility
    document.addEventListener('keydown', function(e){
      const active = document.activeElement;
      if(!active) return;
      if((active.id === 'footerDyslexicToggle' || active.id === 'homeDyslexicToggle') && (e.key === 'Enter' || e.key === ' ')){
        e.preventDefault(); active.click();
      }
    });

    // initialize
    syncButtons();
  }

  document.addEventListener('DOMContentLoaded', function(){
    try{
      document.querySelectorAll('footer.footer-custom').forEach(function(f){
        f.innerHTML = footerHTML;
      });
    }catch(e){ /* ignore */ }
    wireToggle();

    // ---- Site-wide header offset + auto-tag sub-nav wrappers ----
    function updateHeaderOffset(){
      try{
        var nav = document.querySelector('.site-nav');
        if(!nav) return;
        // ensure header is in fixed stacking mode so nothing overlays it
        nav.classList.add('site-nav-fixed');
        var h = Math.ceil(nav.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--site-nav-height', h + 'px');
        // ensure anchor jumps and scrolls respect the header
        document.documentElement.style.setProperty('scroll-padding-top', h + 'px');
        var m = document.querySelector('main');
        if(m) m.style.paddingTop = h + 'px';
      }catch(e){ /* ignore measurement errors */ }
    }

    // Auto-tag any button groups that look like sub-navigation (filter rows)
    try{
      var seen = 0;
      document.querySelectorAll('button.filter-btn').forEach(function(btn){
        var wrapper = btn.closest('div');
        if(!wrapper) return;
        // If the immediate wrapper already looks like a filter-row, tag it
        if(!wrapper.classList.contains('sub-nav-container')){
          // only add when the wrapper contains multiple filter-btns
          var siblingBtns = wrapper.querySelectorAll('button.filter-btn');
          if(siblingBtns && siblingBtns.length > 0){ wrapper.classList.add('sub-nav-container'); seen++; }
        }
      });
    }catch(e){ /* ignore */ }

    // ensure offset updates when viewport changes
    window.addEventListener('resize', updateHeaderOffset, { passive: true });
    // run once now
    updateHeaderOffset();

    // Prevent the browser from restoring scroll position on reload and
    // force the page to open at the top. This avoids small automatic
    // scroll jumps (e.g. ~2cm) that some browsers perform when restoring
    // the previous scroll position. We set history.scrollRestoration to
    // 'manual' where supported and then scroll to top after layout
    // stabilizes.
    try{
      if('scrollRestoration' in history) history.scrollRestoration = 'manual';
      setTimeout(function(){ window.scrollTo(0,0); }, 0);
    }catch(e){ /* ignore */ }
  });
})();
