/* ════════════════════════════
   PORTFOLIO SWITCHER — portfolio.js
════════════════════════════ */

function showMode(mode) {
  const photoP   = document.getElementById('photo-portfolio');
  const devP     = document.getElementById('dev-portfolio');
  const switcher = document.getElementById('switcher');
  const photoBtn = document.getElementById('photo-btn');
  const devBtn   = document.getElementById('dev-btn');

  if (mode === 'photo') {
    photoP.style.display = 'block';
    devP.style.display   = 'none';
    photoP.style.animation = 'none';
    void photoP.offsetWidth;
    photoP.style.animation = 'fadeIn 0.4s ease';
    photoBtn.classList.add('active');
    photoBtn.classList.remove('dev-active');
    devBtn.classList.remove('active', 'dev-active');
    switcher.classList.remove('light-switcher');
  } else {
    photoP.style.display = 'none';
    devP.style.display   = 'block';
    devP.style.animation = 'none';
    void devP.offsetWidth;
    devP.style.animation = 'fadeIn 0.4s ease';
    devBtn.classList.add('active', 'dev-active');
    photoBtn.classList.remove('active');
    switcher.classList.add('light-switcher');
  }
}
