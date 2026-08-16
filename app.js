// app.js — Learn Your Way workspace logic

(() => {

  // ── Theme ────────────────────────────────────────────────
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('lyw-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lyw-theme', next);
    themeIcon.textContent = next === 'dark' ? '☀' : '☾';
  });

  // ── State ────────────────────────────────────────────────
  let currentMaterial = '';
  let currentMode = '';
  let currentExplanationText = '';
  let speechUtterance = null;
  let isSpeaking = false;
  let practiceData = [];
  let userAnswers = [];
  let isDemo = false;

  // ── Elements ─────────────────────────────────────────────
  const inputSection      = document.getElementById('inputSection');
  const modeSection       = document.getElementById('modeSection');
  const explanationSection = document.getElementById('explanationSection');
  const practiceSection   = document.getElementById('practiceSection');

  const materialInput     = document.getElementById('materialInput');
  const materialPreview   = document.getElementById('materialPreview');
  const continueBtn       = document.getElementById('continueBtn');
  const demoBtn           = document.getElementById('demoBtn');
  const backToInputBtn    = document.getElementById('backToInputBtn');

  const activeModeIcon    = document.getElementById('activeModeIcon');
  const activeModeLabel   = document.getElementById('activeModeLabel');
  const loadingState      = document.getElementById('loadingState');
  const loadingText       = document.getElementById('loadingText');
  const explanationOutput = document.getElementById('explanationOutput');
  const explanationContent = document.getElementById('explanationContent');
  const errorState        = document.getElementById('errorState');
  const errorMessage      = document.getElementById('errorMessage');
  const retryBtn          = document.getElementById('retryBtn');
  const rethinkSection    = document.getElementById('rethinkSection');
  const bottomActions     = document.getElementById('bottomActions');
  const backToModeBtn     = document.getElementById('backToModeBtn');
  const practiceBtn       = document.getElementById('practiceBtn');
  const listenBtn         = document.getElementById('listenBtn');
  const listenIcon        = document.getElementById('listenIcon');
  const listenLabel       = document.getElementById('listenLabel');

  const practiceLoading   = document.getElementById('practiceLoading');
  const practiceQuestions = document.getElementById('practiceQuestions');
  const practiceActions   = document.getElementById('practiceActions');
  const checkAnswersBtn   = document.getElementById('checkAnswersBtn');
  const practiceResults   = document.getElementById('practiceResults');
  const practiceNav       = document.getElementById('practiceNav');
  const backToExplainBtn  = document.getElementById('backToExplainBtn');
  const quizBtn           = document.getElementById('quizBtn');

  const MODE_META = {
    simple:  { icon: '◎', label: 'Simple' },
    analogy: { icon: '◈', label: 'Analogy' },
    visual:  { icon: '◱', label: 'Visual' },
    steps:   { icon: '◳', label: 'Step-by-step' }
  };

  // ── Section navigation ──────────────────────────────────
  function showSection(section) {
    [inputSection, modeSection, explanationSection, practiceSection]
      .forEach(s => s.classList.add('hidden'));
    section.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Step 1 → Step 2 ─────────────────────────────────────
  continueBtn.addEventListener('click', () => {
    const text = materialInput.value.trim();
    if (!text) {
      materialInput.focus();
      materialInput.style.borderColor = 'var(--text-tertiary)';
      setTimeout(() => materialInput.style.borderColor = '', 1200);
      return;
    }
    currentMaterial = text;
    isDemo = false;
    materialPreview.textContent = text;
    showSection(modeSection);
  });

  demoBtn.addEventListener('click', () => {
    currentMaterial = DEMO_MATERIAL;
    isDemo = true;
    materialInput.value = DEMO_MATERIAL;
    materialPreview.textContent = DEMO_MATERIAL;
    showSection(modeSection);
  });

  backToInputBtn.addEventListener('click', () => {
    showSection(inputSection);
  });

  // ── Step 2 → Step 3 ─────────────────────────────────────
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      startExplanation(mode);
    });
  });

  async function startExplanation(mode) {
    currentMode = mode;
    stopSpeech();

    const meta = MODE_META[mode];
    activeModeIcon.textContent = meta.icon;
    activeModeLabel.textContent = meta.label;

    // Reset explanation section state
    loadingState.classList.remove('hidden');
    explanationOutput.classList.add('hidden');
    errorState.classList.add('hidden');
    rethinkSection.classList.add('hidden');
    bottomActions.classList.add('hidden');
    explanationContent.innerHTML = '';

    showSection(explanationSection);

    try {
      if (isDemo) {
        // Use built-in demo — no API needed
        await simulateDelay(900);
        const demo = DEMO_EXPLANATIONS[mode];
        renderExplanation(demo, mode);
      } else {
        // Use AI API
        loadingText.textContent = 'Understanding your material...';
        const raw = await AI.explain(currentMaterial, mode);
        renderAIExplanation(raw, mode);
      }
    } catch (err) {
      showError(err, mode);
    }
  }

  function renderExplanation(demo, mode) {
    loadingState.classList.add('hidden');

    if (demo.type === 'text') {
      explanationContent.innerHTML = demo.content;
      currentExplanationText = explanationContent.textContent;
    } else if (demo.type === 'visual') {
      explanationContent.innerHTML = demo.content;
      currentExplanationText = explanationContent.textContent;
    } else if (demo.type === 'steps') {
      const ol = document.createElement('ol');
      ol.className = 'ai-steps';
      demo.content.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = step;
        ol.appendChild(li);
      });
      explanationContent.appendChild(ol);
      currentExplanationText = demo.content.join('. ');
    }

    explanationOutput.classList.remove('hidden');
    showRethink(mode);
  }

  function renderAIExplanation(text, mode) {
    loadingState.classList.add('hidden');
    currentExplanationText = text;

    if (mode === 'steps') {
      // Parse numbered list from AI
      const lines = text.split('\n').filter(l => l.trim());
      const ol = document.createElement('ol');
      ol.className = 'ai-steps';
      lines.forEach(line => {
        const clean = line.replace(/^\d+[\.\)]\s*/, '').trim();
        if (clean) {
          const li = document.createElement('li');
          li.textContent = clean;
          ol.appendChild(li);
        }
      });
      if (ol.children.length > 0) {
        explanationContent.appendChild(ol);
      } else {
        explanationContent.innerHTML = `<p>${text}</p>`;
      }
    } else if (mode === 'visual') {
      // Parse diagram lines from AI
      const lines = text.split('\n').filter(l => l.trim());
      const diagram = document.createElement('div');
      diagram.className = 'ai-diagram';
      let hasArrow = false;

      lines.forEach(line => {
        if (line.match(/[↓↑→←]/)) {
          const arrow = document.createElement('div');
          arrow.className = 'ai-diagram-arrow';
          arrow.textContent = line.trim();
          diagram.appendChild(arrow);
          hasArrow = true;
        } else if (line.trim()) {
          const box = document.createElement('div');
          box.className = 'ai-diagram-box';
          box.textContent = line.trim();
          diagram.appendChild(box);
        }
      });

      if (hasArrow) {
        explanationContent.appendChild(diagram);
      } else {
        // Fallback: render as text
        explanationContent.innerHTML = `<p>${text}</p>`;
      }
    } else {
      // Simple / Analogy: render as paragraphs
      const paragraphs = text.split('\n\n').filter(p => p.trim());
      paragraphs.forEach(para => {
        const p = document.createElement('p');
        p.textContent = para.trim();
        explanationContent.appendChild(p);
      });
    }

    explanationOutput.classList.remove('hidden');
    showRethink(mode);
  }

  function showRethink(currentMode) {
    // Hide the rethink button for the current mode
    document.querySelectorAll('.rethink-btn').forEach(btn => {
      btn.style.display = btn.dataset.mode === currentMode ? 'none' : '';
    });
    rethinkSection.classList.remove('hidden');
    bottomActions.classList.remove('hidden');
  }

  function showError(err, mode) {
    loadingState.classList.add('hidden');
    explanationOutput.classList.add('hidden');

    let message = 'Something went wrong. Please try again.';

    if (err.message === 'NO_API_KEY') {
      message = 'No API key is set. Try the built-in demo to see how it works — press the back button and select "Try the built-in demo".';
    } else if (err.message.includes('fetch') || err.message.includes('network')) {
      message = 'Network error. Check your connection and try again.';
    } else if (err.message) {
      message = err.message;
    }

    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
  }

  retryBtn.addEventListener('click', () => {
    if (currentMode) startExplanation(currentMode);
  });

  // ── Rethink buttons ─────────────────────────────────────
  document.querySelectorAll('.rethink-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      stopSpeech();
      startExplanation(mode);
    });
  });

  // ── Back buttons ─────────────────────────────────────────
  backToModeBtn.addEventListener('click', () => {
    stopSpeech();
    showSection(modeSection);
  });

  // ── Listen (Web Speech API) ──────────────────────────────
  listenBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      listenLabel.textContent = 'Not supported';
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!currentExplanationText) return;

    speechUtterance = new SpeechSynthesisUtterance(currentExplanationText);
    speechUtterance.rate = 0.95;
    speechUtterance.pitch = 1;

    speechUtterance.onstart = () => {
      isSpeaking = true;
      listenIcon.textContent = '⏹';
      listenLabel.textContent = 'Stop';
      listenBtn.classList.add('listening');
    };

    speechUtterance.onend = () => {
      isSpeaking = false;
      listenIcon.textContent = '🔊';
      listenLabel.textContent = 'Listen';
      listenBtn.classList.remove('listening');
    };

    speechUtterance.onerror = () => {
      isSpeaking = false;
      listenIcon.textContent = '🔊';
      listenLabel.textContent = 'Listen';
      listenBtn.classList.remove('listening');
    };

    window.speechSynthesis.speak(speechUtterance);
  });

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    if (listenIcon) listenIcon.textContent = '🔊';
    if (listenLabel) listenLabel.textContent = 'Listen';
    if (listenBtn) listenBtn.classList.remove('listening');
  }

  // ── Step 3 → Step 4: Practice ───────────────────────────
  practiceBtn.addEventListener('click', async () => {
    stopSpeech();
    showSection(practiceSection);
    practiceQuestions.classList.add('hidden');
    practiceActions.classList.add('hidden');
    practiceResults.classList.add('hidden');
    practiceNav.classList.add('hidden');
    practiceLoading.classList.remove('hidden');
    practiceQuestions.innerHTML = '';
    practiceResults.innerHTML = '';
    userAnswers = [];

    try {
      if (isDemo) {
        await simulateDelay(800);
        practiceData = DEMO_PRACTICE;
      } else {
        practiceData = await AI.generatePractice(currentMaterial, currentMode);
      }
      renderPracticeQuestions(practiceData);
    } catch (err) {
      practiceLoading.classList.add('hidden');
      practiceQuestions.innerHTML = `<p style="color:var(--text-secondary);font-size:0.9rem;">Could not generate practice questions. ${err.message === 'NO_API_KEY' ? 'Try the demo mode.' : 'Please try again.'}</p>`;
      practiceQuestions.classList.remove('hidden');
    }
  });

  function renderPracticeQuestions(questions) {
    practiceLoading.classList.add('hidden');
    practiceQuestions.innerHTML = '';
    userAnswers = new Array(questions.length).fill(null);

    questions.forEach((q, i) => {
      const card = document.createElement('div');
      card.className = 'practice-q';

      const num = document.createElement('div');
      num.className = 'practice-q-num';
      num.textContent = `Question ${i + 1}`;

      const text = document.createElement('div');
      text.className = 'practice-q-text';
      text.textContent = q.question;

      card.appendChild(num);
      card.appendChild(text);

      if (q.type === 'mc') {
        const opts = document.createElement('div');
        opts.className = 'mc-options';

        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, j) => {
          const btn = document.createElement('button');
          btn.className = 'mc-option';
          btn.type = 'button';
          btn.innerHTML = `<span class="mc-letter">${letters[j]}</span>${opt}`;
          btn.addEventListener('click', () => {
            // Deselect all in this group
            opts.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            userAnswers[i] = j;
            checkSubmitReady();
          });
          opts.appendChild(btn);
        });

        card.appendChild(opts);
      }

      practiceQuestions.appendChild(card);
    });

    practiceQuestions.classList.remove('hidden');
    practiceActions.classList.remove('hidden');
  }

  function checkSubmitReady() {
    const allAnswered = userAnswers.every(a => a !== null);
    checkAnswersBtn.disabled = !allAnswered;
    checkAnswersBtn.style.opacity = allAnswered ? '1' : '0.5';
  }

  checkAnswersBtn.addEventListener('click', () => {
    showPracticeResults();
  });

  function showPracticeResults() {
    practiceActions.classList.add('hidden');

    // Lock all options
    document.querySelectorAll('.mc-option').forEach(btn => {
      btn.style.pointerEvents = 'none';
    });

    practiceResults.innerHTML = '';
    let correct = 0;

    practiceData.forEach((q, i) => {
      const userAns = userAnswers[i];
      const isCorrect = userAns === q.correct;
      if (isCorrect) correct++;

      const item = document.createElement('div');
      item.className = 'result-item';

      const status = document.createElement('div');
      status.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
      status.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';

      const qText = document.createElement('div');
      qText.className = 'result-q';
      qText.textContent = q.question;

      const letters = ['A', 'B', 'C', 'D'];
      const answerLine = document.createElement('div');
      answerLine.className = 'result-answer';

      if (isCorrect) {
        answerLine.textContent = `Your answer: ${letters[userAns]} — ${q.options[userAns]}`;
      } else {
        answerLine.textContent = `Your answer: ${letters[userAns] || '?'} — Correct: ${letters[q.correct]} — ${q.options[q.correct]}`;
      }

      const exp = document.createElement('div');
      exp.className = 'result-explanation';
      exp.textContent = q.explanation;

      item.appendChild(status);
      item.appendChild(qText);
      item.appendChild(answerLine);
      item.appendChild(exp);
      practiceResults.appendChild(item);
    });

    // Score summary
    const summary = document.createElement('div');
    summary.style.cssText = 'text-align:center;padding:20px 0 8px;font-size:0.95rem;color:var(--text-secondary);';
    summary.textContent = `${correct} of ${practiceData.length} correct`;
    practiceResults.insertBefore(summary, practiceResults.firstChild);

    practiceResults.classList.remove('hidden');
    practiceNav.classList.remove('hidden');
  }

  backToExplainBtn.addEventListener('click', () => {
    stopSpeech();
    showSection(explanationSection);
  });

  // Quiz button placeholder
  quizBtn.addEventListener('click', () => {
    quizBtn.textContent = 'Quiz coming soon...';
    quizBtn.disabled = true;
  });

  // ── Utility ──────────────────────────────────────────────
  function simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})();
