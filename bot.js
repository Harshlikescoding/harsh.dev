/* ════════════════════════════
   KERO VOICE BOT — bot.js
   Wake word: "Kero"
   Tone: casual and chill
════════════════════════════ */

let botOpen      = false;
let recognition  = null;
let wakeRecog    = null;
let cachedVoices = [];

function loadVoices() {
  cachedVoices = window.speechSynthesis.getVoices();
}
loadVoices();
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// ── Response bank ──
const R = {
  greet: [
    "Hi, I'm Kero, Harsh's assistant. Feel free to ask me anything about his work, projects, or photography.",
    "Hello! I'm Kero. I can tell you about Harsh's projects, skills, photography, or help you navigate the portfolio.",
    "Hi there! I'm Kero. Ask me about Harsh's background, his work, or say something like 'show dev mode' to switch portfolios."
  ],
  wake: [
    "Yes, I'm here. Go ahead.",
    "Listening. What can I help you with?",
    "Hi! What would you like to know?",
    "I'm here. What can I help you with?",
    "Sure, go ahead."
  ],
  who: [
    "Harsh is a 22-year-old computer programming graduate based in Ontario, Canada. He combines a passion for photography with hands-on development work, and is currently building several projects while looking for his first full-time tech role.",
    "Harsh is a developer and photographer based in Ontario. He holds a computer programming diploma, shoots automotive and nature photography, and is actively building projects like ColdThread, ShotClock, and PaperDrop.",
    "He's a Canadian work permit holder with a computer programming background, currently focused on landing a full-time tech role in Ontario while running his VeryHarsh photography and content brand."
  ],
  projects: [
    "Harsh has three projects in development. ColdThread is an AI-powered email composer for cold outreach. ShotClock is a job application tracker. And PaperDrop lets you upload bank statements to get a full budget breakdown automatically.",
    "He's working on ColdThread for email writing, ShotClock for tracking job applications, and PaperDrop for personal budgeting. All three are currently in development.",
    "His projects include ColdThread, ShotClock, and PaperDrop — covering email, job tracking, and budgeting. He also built this dual-mode portfolio you're viewing right now."
  ],
  photo: [
    "Harsh shoots automotive and nature photography, with a dark moody editing style — teal shadows, cinematic composition. Everything is shot on iPhone and edited in Lightroom using his own custom preset.",
    "His photography focuses on automotive and nature subjects. He has a strong eye for composition and edits with a consistent cinematic style. You can view his work in the photo section of this portfolio.",
    "He shoots on iPhone and edits in Lightroom. The style is dark, intentional, and consistent — not the typical over-saturated look. The photo portfolio is on the other side of this site."
  ],
  contact: [
    "You can reach Harsh at hello@veryharsh.dev. He's also on LinkedIn and Instagram. The contact section at the bottom has all the links.",
    "The best way to get in touch is hello@veryharsh.dev. He's open to full-time tech opportunities in Ontario and photography collaborations.",
    "All contact links are in the contact section — LinkedIn, Instagram, and email. He's actively looking for tech roles and open to conversations."
  ],
  switchDev: [
    "Switching to the developer portfolio now.",
    "Opening the developer side.",
    "Here's the developer portfolio."
  ],
  switchPhoto: [
    "Switching to the photography portfolio.",
    "Here's the photo side.",
    "Opening the photography portfolio now."
  ],
  skills: [
    "On the frontend, Harsh works with HTML, CSS, JavaScript, and React. On the backend, he has experience with Python, Node.js, and SQL. He's also comfortable with Git, Linux, and VS Code, and has knowledge of IT support and QA testing.",
    "His strongest area is frontend development — HTML, CSS, JavaScript, and React. He's also building backend skills with Python and Node. He's currently targeting junior developer, IT support, and QA roles in Ontario.",
    "The core stack is HTML, CSS, JavaScript, React, Python, Node.js, and SQL. He's actively expanding his skills through freeCodeCamp and personal projects."
  ],
  location: [
    "Harsh is based in Ontario, Canada. He holds an active work permit and is looking for full-time tech roles locally.",
    "He's based in Ontario, available for in-person or hybrid roles in the GTA and surrounding area.",
    "Ontario-based with an active Canadian work permit. He's open to full-time opportunities in the tech sector."
  ],
  // Navigation
  navAbout: [
    "Scrolling to the about section.",
    "Here's the about section.",
    "Taking you to the about section now."
  ],
  navProjects: [
    "Scrolling to the projects section.",
    "Here's what he's currently building.",
    "Taking you to the projects section."
  ],
  navContact: [
    "Scrolling to the contact section.",
    "Here's how to get in touch with Harsh.",
    "Taking you to the contact section."
  ],
  navSkills: [
    "Scrolling to the skills section.",
    "Here's an overview of his technical skills.",
    "Taking you to the skills section."
  ],
  navGallery: [
    "Scrolling to the photo gallery.",
    "Here's his photography work.",
    "Taking you to the gallery."
  ],
  // Hobbies & personal
  hobbies: [
    "Outside of work, Harsh plays Valorant competitively, shoots photography, and is currently learning French for his immigration pathway. He also drives a 2009 Honda Civic that he maintains himself.",
    "His interests include photography, gaming, and coding. He plays Valorant in his spare time and is studying French as part of his Express Entry strategy.",
    "Harsh shoots photos, plays Valorant, and is learning French. He also does his own car maintenance on a 2009 Honda Civic."
  ],
  car: [
    "He drives a 2009 Honda Civic DX-G Coupe. High mileage but well maintained — he handles the upkeep himself, including oil changes and filter replacements.",
    "A 2009 Honda Civic coupe. He takes care of it himself and knows the car well mechanically.",
    "It's a 2009 Honda Civic DX-G. He does his own maintenance, which says a lot about his hands-on approach to things."
  ],
  gaming: [
    "Harsh plays Valorant. He takes a support and lurker approach — methodical and team-oriented rather than aggressive.",
    "His main game is Valorant. He plays support and lurker roles with a low-sensitivity, read-the-game playstyle.",
    "He plays Valorant competitively, focusing on support and lurker roles. It's a calculated playstyle."
  ],
  // Jokes
  joke: [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "How many developers does it take to change a lightbulb? None — that's a hardware problem.",
    "A SQL query walks into a bar, walks up to two tables and asks: can I join you?",
    "Why do photographers struggle with coding? Too many focus issues.",
    "I told Harsh his first CSS looked good. One of us was lying."
  ],
  // Roasts
  roast: [
    "I appreciate the confidence, but roasting visitors isn't really in my job description.",
    "I'd rather tell you about Harsh's projects. Much more impressive than a roast.",
    "Roasting is above my pay grade. Ask me something about the portfolio instead.",
    "I'll pass on the roast — but I will say, you clearly have good taste in portfolios.",
    "Not going there. But feel free to ask me about Harsh's work, skills, or projects."
  ],
  // About the bot
  aboutKero: [
    "I'm Kero, Harsh's voice assistant built directly into this portfolio. I run on your browser's built-in speech API — no external servers or costs involved.",
    "I'm a voice assistant embedded in this portfolio. I can answer questions about Harsh, navigate to sections, or switch between the photo and developer portfolios. Just say my name to activate me.",
    "I'm Kero. I'm built into this site to help visitors learn more about Harsh and navigate the portfolio hands-free."
  ],
  // Immigration
  immigration: [
    "Harsh is working toward Canadian permanent residency through Express Entry. He holds an active work permit and is pursuing skilled work experience in tech to strengthen his application.",
    "He's on a Canadian work permit and is actively pursuing permanent residency through Express Entry and the Ontario Immigrant Nominee Program. He's also studying French to improve his CRS score.",
    "Harsh is building his immigration pathway through tech employment and language skills. He's targeting the Ontario Immigrant Nominee Program once he secures a full-time tech role."
  ],
  // Brand
  brand: [
    "VeryHarsh is Harsh's personal brand — covering photography, his coding journey, content creation, and life in Canada. The name reflects his straightforward, no-filter approach.",
    "The brand is VeryHarsh. He runs an Instagram photography page, a YouTube channel, and this portfolio under that name. It's a creative and professional identity rolled into one.",
    "VeryHarsh dot dev. Photography, development, and content — all under one brand. It represents his work and his story."
  ],
  unknown: [
    "I'm not sure about that one. You can ask me about Harsh's projects, photography, skills, or say something like 'show dev mode'.",
    "I didn't quite catch that. Try asking about his background, projects, or use a navigation command like 'go to contact'.",
    "I'm not sure how to answer that. Feel free to ask about Harsh's work, his tech stack, or his photography."
  ]
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function processCommand(text) {
  const t = text.toLowerCase();
  let reply  = '';
  let action = null;
  let scroll = null;

  // Navigation — switch mode first if section lives on other side
  if (/go to about|scroll.*about|show.*about/.test(t))                         { reply = rand(R.navAbout);    scroll = 'ph-about';    action = 'photo'; }
  else if (/go to project|scroll.*project|show.*project/.test(t))              { reply = rand(R.navProjects); scroll = 'dv-projects'; action = 'dev'; }
  else if (/go to contact|scroll.*contact|show.*contact/.test(t))              { reply = rand(R.navContact);  scroll = 'ph-contact';  action = 'photo'; }
  else if (/go to skill|scroll.*skill|show.*skill/.test(t))                    { reply = rand(R.navSkills);   scroll = 'dv-skills';   action = 'dev'; }
  else if (/go to gallery|scroll.*gallery|show.*gallery|show.*work/.test(t))   { reply = rand(R.navGallery);  scroll = 'ph-gallery';  action = 'photo'; }
  // Mode switch
  else if (/switch.*dev|show.*dev|open.*dev|go.*dev|dev.*mode/.test(t))        { reply = rand(R.switchDev);   action = 'dev'; }
  else if (/switch.*photo|show.*photo|photo.*mode|go.*photo/.test(t))          { reply = rand(R.switchPhoto); action = 'photo'; }
  // Bot identity
  else if (/who are you|what are you|what is kero|about kero/.test(t))         { reply = rand(R.aboutKero); }
  // Personal
  else if (/who is harsh|about harsh|tell me about harsh|harsh/.test(t))       { reply = rand(R.who); }
  else if (/car|civic|honda|drive/.test(t))                                    { reply = rand(R.car); }
  else if (/gaming|valorant|game|play/.test(t))                                { reply = rand(R.gaming); }
  else if (/hobbie|free time|outside|personal/.test(t))                        { reply = rand(R.hobbies); }
  else if (/immigra|pr|express entry|permit|canada permanent|visa/.test(t))    { reply = rand(R.immigration); }
  else if (/brand|veryharsh|content|youtube|instagram/.test(t))                { reply = rand(R.brand); }
  // Work
  else if (/project|build|making|coldthread|shotclock|paperdrop/.test(t))      { reply = rand(R.projects); }
  else if (/skill|know|stack|language|tech|experience/.test(t))                { reply = rand(R.skills); }
  else if (/contact|email|reach|hire|get in touch/.test(t))                    { reply = rand(R.contact); }
  else if (/photo|photography|shoot|camera|picture/.test(t))                   { reply = rand(R.photo); }
  else if (/where|location|based|ontario|canada|city/.test(t))                 { reply = rand(R.location); }
  // Fun
  else if (/joke|funny|laugh|humor/.test(t))                                   { reply = rand(R.joke); }
  else if (/roast|insult|make fun/.test(t))                                    { reply = rand(R.roast); }
  // Greet last
  else if (/hello|hi\b|hey|what'?s up|sup/.test(t))                           { reply = rand(R.greet); }
  else                                                                           { reply = rand(R.unknown); }

  return { reply, action, scroll };
}

// ── DOM helpers ──
function addMsg(text, type) {
  const msgs = document.getElementById('kero-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'kero-msg ' + type;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function setStatus(s) {
  const el = document.getElementById('kero-status');
  if (el) el.textContent = s;
}

function openPanel() {
  if (!botOpen) {
    botOpen = true;
    const panel = document.getElementById('kero-panel');
    if (panel) panel.classList.add('open');
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── Speech synthesis ──
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utt  = new SpeechSynthesisUtterance(text);
  utt.rate   = 1.05;
  utt.pitch  = 1.0;
  utt.volume = 1;
  utt.lang   = 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const voice  =
    voices.find(v => v.name === 'Google US English') ||
    voices.find(v => v.name.includes('Samantha'))    ||
    voices.find(v => v.lang === 'en-US' && !v.localService) ||
    voices.find(v => v.lang.startsWith('en'))        ||
    voices[0] || null;
  if (voice) utt.voice = voice;

  setStatus('talking');
  utt.onend   = () => setStatus('idle');
  utt.onerror = () => setStatus('idle');

  setTimeout(() => {
    window.speechSynthesis.speak(utt);
    const ping = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(ping); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
  }, 100);
}

// ── Panel toggle (click on orb) ──
let wakeStarted = false;

function toggleBot() {
  botOpen = !botOpen;
  const panel = document.getElementById('kero-panel');
  if (panel) panel.classList.toggle('open', botOpen);

  // First click starts the wake listener (needs user gesture)
  if (!wakeStarted) {
    wakeStarted = true;
    startWakeListener();
  }

  if (botOpen && document.getElementById('kero-messages').children.length === 0) {
    setTimeout(() => {
      const intro = rand(R.greet);
      addMsg(intro, 'bot');
      speak(intro);
    }, 300);
  }
}

// ── Active listening ──
function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { addMsg("your browser doesn't support voice. try chrome.", 'bot'); return; }
  if (recognition) { recognition.stop(); recognition = null; return; }

  // Pause wake listener — Chrome can't run two at once
  if (wakeRecog) { try { wakeRecog.stop(); } catch(e) {} }

  recognition = new SR();
  recognition.continuous     = false;
  recognition.interimResults = false;
  recognition.lang           = 'en-US';

  recognition.onstart = () => {
    setStatus('listening...');
    document.getElementById('kero-btn').classList.add('bot-listening');
  };

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    console.log('[Kero active] heard:', text);
    addMsg(text, 'user');
    const { reply, action, scroll } = processCommand(text);
    setTimeout(() => {
      addMsg(reply, 'bot');
      speak(reply);
      if (action) setTimeout(() => showMode(action), 400);
      if (scroll) setTimeout(() => scrollToSection(scroll), 900);
    }, 350);
  };

  recognition.onerror = (e) => {
    if (e.error === 'not-allowed') addMsg("mic access denied — allow it in your browser settings.", 'bot');
    resetMic();
  };

  recognition.onend = () => {
    resetMic();
    recognition = null;
    // Restart wake listener after done
    setTimeout(() => { try { wakeRecog.start(); } catch(e) {} }, 800);
  };

  recognition.start();
}

function resetMic() {
  setStatus('idle');
  const btn = document.getElementById('kero-btn');
  if (btn) btn.classList.remove('bot-listening');
}

// ── Wake word: "Kero" ──
function startWakeListener() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  wakeRecog = new SR();
  wakeRecog.continuous     = true;
  wakeRecog.interimResults = true;
  wakeRecog.lang           = 'en-US';

  wakeRecog.onresult = (e) => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const heard = e.results[i][0].transcript.toLowerCase().trim();
      console.log('[Kero wake] heard:', heard);
      if (/kero|kiro|keiro|cairo|kido|kiddo|akiro|akero|hero|zero|quiero|kerro/.test(heard)) {
        openPanel();
        setStatus('hey!');
        const wakeReply = rand(R.wake);
        if (document.getElementById('kero-messages').children.length === 0) {
          addMsg(rand(R.greet), 'bot');
        } else {
          addMsg(wakeReply, 'bot');
        }
        speak(wakeReply);
        // Start active listening after wake reply
        setTimeout(() => { if (!recognition) startListening(); }, 1200);
        break;
      }
    }
  };

  wakeRecog.onend = () => {
    console.log('[Kero] wake listener ended, restarting...');
    if (!recognition) {
      setTimeout(() => { try { wakeRecog.start(); console.log('[Kero] wake listener restarted'); } catch(e) { console.warn('[Kero] restart failed:', e); } }, 500);
    }
  };

  wakeRecog.onerror = (e) => {
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      setTimeout(() => { try { wakeRecog.start(); } catch(err) {} }, 1000);
    }
  };

  try { wakeRecog.start(); console.log('[Kero] wake listener started'); } catch(e) { console.warn('[Kero] wake start failed:', e); }
}


