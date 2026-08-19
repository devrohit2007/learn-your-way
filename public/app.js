// app.js — Learn Your Way workspace logic

(() => {

  // Theme
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const themeLabel  = document.getElementById('themeLabel');
  const hamburgerBtn  = document.getElementById('hamburgerBtn');
  const hamburgerMenu = document.getElementById('hamburgerMenu');

  const savedTheme = localStorage.getItem('lyw-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if (themeIcon)  themeIcon.textContent  = savedTheme === 'dark' ? '☀' : '☾';
  if (themeLabel) themeLabel.textContent = savedTheme === 'dark' ? 'Light mode' : 'Dark mode';

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburgerMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    hamburgerMenu.classList.add('hidden');
  });

  hamburgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lyw-theme', next);
    if (themeIcon)  themeIcon.textContent  = next === 'dark' ? '☀' : '☾';
    if (themeLabel) themeLabel.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
    hamburgerMenu.classList.add('hidden');
  });

  // State
  let currentMaterial        = '';
  let currentMode            = '';
  let currentExplanationText = '';
  let isSpeaking             = false;
  let practiceData           = [];
  let practiceAnswers        = [];
  let quizData               = [];
  let quizAnswers            = [];
  let isDemo                 = false;
  let currentLang            = "English";

  // Elements
  const inputSection       = document.getElementById('inputSection');
  const modeSection        = document.getElementById('modeSection');
  const explanationSection = document.getElementById('explanationSection');
  const practiceSection    = document.getElementById('practiceSection');
  const quizSection        = document.getElementById('quizSection');
  const ALL_SECTIONS = [inputSection, modeSection, explanationSection, practiceSection, quizSection];

  const materialInput   = document.getElementById('materialInput');
  const materialPreview = document.getElementById('materialPreview');
  const continueBtn     = document.getElementById('continueBtn');
  const demoBtn         = document.getElementById('demoBtn');
  const backToInputBtn  = document.getElementById('backToInputBtn');

  const activeModeIcon     = document.getElementById('activeModeIcon');
  const activeModeLabel    = document.getElementById('activeModeLabel');
  const loadingState       = document.getElementById('loadingState');
  const loadingText        = document.getElementById('loadingText');
  const explanationOutput  = document.getElementById('explanationOutput');
  const explanationContent = document.getElementById('explanationContent');
  const errorState         = document.getElementById('errorState');
  const errorMessage       = document.getElementById('errorMessage');
  const retryBtn           = document.getElementById('retryBtn');
  const rethinkSection     = document.getElementById('rethinkSection');
  const bottomActions      = document.getElementById('bottomActions');
  const backToModeBtn      = document.getElementById('backToModeBtn');
  const practiceBtn        = document.getElementById('practiceBtn');
  const listenBtn          = document.getElementById('listenBtn');
  const listenIcon         = document.getElementById('listenIcon');
  const listenLabel        = document.getElementById('listenLabel');

  const practiceLoading   = document.getElementById('practiceLoading');
  const practiceQuestions = document.getElementById('practiceQuestions');
  const practiceActions   = document.getElementById('practiceActions');
  const checkAnswersBtn   = document.getElementById('checkAnswersBtn');
  const practiceResults   = document.getElementById('practiceResults');
  const practiceNav       = document.getElementById('practiceNav');
  const backToExplainBtn  = document.getElementById('backToExplainBtn');
  const toQuizBtn         = document.getElementById('toQuizBtn');

  const quizIntro         = document.getElementById('quizIntro');
  const startQuizBtn      = document.getElementById('startQuizBtn');
  const quizLoading       = document.getElementById('quizLoading');
  const quizQuestions     = document.getElementById('quizQuestions');
  const quizActions       = document.getElementById('quizActions');
  const submitQuizBtn     = document.getElementById('submitQuizBtn');
  const quizResults       = document.getElementById('quizResults');
  const quizScoreCard     = document.getElementById('quizScoreCard');
  const quizResultItems   = document.getElementById('quizResultItems');
  const quizRethink       = document.getElementById('quizRethink');
  const backToPracticeBtn = document.getElementById('backToPracticeBtn');
  const startOverBtn      = document.getElementById('startOverBtn');

  const MODE_META = {
    simple:  { icon: '◎', label: 'Simple' },
    analogy: { icon: '◈', label: 'Analogy' },
    visual:  { icon: '◱', label: 'Visual' },
    steps:   { icon: '◳', label: 'Step-by-step' }
  };
  const LETTERS = ['A', 'B', 'C', 'D'];

  // Section navigation
  function showSection(section) {
    ALL_SECTIONS.forEach(s => s.classList.add('hidden'));
    section.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Step 1: Input
  continueBtn.addEventListener('click', () => {
    const text = materialInput.value.trim();
    if (!text) {
      materialInput.focus();
      materialInput.style.borderColor = 'var(--text-tertiary)';
      setTimeout(() => { materialInput.style.borderColor = ''; }, 1200);
      return;
    }
    currentMaterial = text;
    isDemo = false;
    materialPreview.textContent = text;
    showSection(modeSection);
  });

  document.getElementById("pdfBtn").addEventListener("click", () => document.getElementById("pdfUpload").click());

  document.getElementById("pdfUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const formData = new FormData();
    formData.append("file", file);
    const isImage = /\.(jpe?g|png|webp)$/i.test(file.name);
    continueBtn.textContent = isImage ? "Extracting image..." : "Extracting PDF...";
    continueBtn.disabled = true;
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      materialInput.value = data.text;
      continueBtn.textContent = "Continue →";
      continueBtn.disabled = false;
    } catch (err) {
      alert("PDF error: " + err.message);
      continueBtn.textContent = "Continue →";
      continueBtn.disabled = false;
    }
  });

  demoBtn.addEventListener('click', () => {
    currentMaterial = DEMO_MATERIAL;
    isDemo = true;
    materialInput.value = DEMO_MATERIAL;
    materialPreview.textContent = DEMO_MATERIAL;
    showSection(modeSection);
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
    });
  });

  backToInputBtn.addEventListener('click', () => showSection(inputSection));

  // Step 2: Mode
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => startExplanation(btn.dataset.mode));
  });

  // Step 3: Explanation
  async function startExplanation(mode) {
    currentMode = mode;
    stopSpeech();
    const meta = MODE_META[mode];
    activeModeIcon.textContent  = meta.icon;
    activeModeLabel.textContent = meta.label;
    loadingState.classList.remove('hidden');
    explanationOutput.classList.add('hidden');
    errorState.classList.add('hidden');
    rethinkSection.classList.add('hidden');
    bottomActions.classList.add('hidden');
    explanationContent.innerHTML = '';
    showSection(explanationSection);
    try {
      if (isDemo) {
        await delay(900);
        renderExplanation(DEMO_EXPLANATIONS[currentLang][mode], mode);
      } else {
        loadingText.textContent = 'Understanding your material...';
        const raw = await AI.explain(currentMaterial, mode, currentLang);
        renderAIExplanation(raw, mode);
      }
    } catch (err) {
      showError(err);
    }
  }

  function renderExplanation(demo, mode) {
    loadingState.classList.add('hidden');
    if (demo.type === 'steps') {
      const ol = document.createElement('ol');
      ol.className = 'ai-steps';
      demo.content.forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = step;
        ol.appendChild(li);
      });
      explanationContent.appendChild(ol);
      currentExplanationText = demo.content.join('. ');
    } else {
      explanationContent.innerHTML = demo.content;
      currentExplanationText = explanationContent.textContent;
    }
    explanationOutput.classList.remove('hidden');
    showRethink(mode);
    saveToHistory(currentMaterial, currentMode, currentLang);
    highlightKeyTerms();
  }

  function renderAIExplanation(text, mode) {
    loadingState.classList.add('hidden');
    currentExplanationText = text;
    if (mode === 'steps') {
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
      if (ol.children.length) {
        explanationContent.appendChild(ol);
      } else {
        explanationContent.innerHTML = '<p>' + text + '</p>';
      }
    } else if (mode === 'visual') {
      const lines = text.split('\n').filter(l => l.trim());
      const diagram = document.createElement('div');
      diagram.className = 'ai-diagram';
      let hasArrow = false;
      lines.forEach(line => {
        if (/[↓↑→←▼▲]/.test(line)) {
          const arrow = document.createElement('div');
          arrow.className = 'ai-diagram-arrow';
          arrow.textContent = line.trim();
          diagram.appendChild(arrow);
          hasArrow = true;
        } else {
          const box = document.createElement('div');
          box.className = 'ai-diagram-box';
          box.textContent = line.trim();
          diagram.appendChild(box);
        }
      });
      if (hasArrow) {
        explanationContent.appendChild(diagram);
      } else {
        explanationContent.innerHTML = '<p>' + text + '</p>';
      }
    } else {
      text.split('\n\n').filter(p => p.trim()).forEach(para => {
        const p = document.createElement('p');
        p.innerHTML = mdToHtml(para.trim());
        explanationContent.appendChild(p);
      });
    }
    explanationOutput.classList.remove('hidden');
    showRethink(mode);
    saveToHistory(currentMaterial, currentMode, currentLang);
    highlightKeyTerms();
  }

  function showRethink(activeMode) {
    document.querySelectorAll('.rethink-btn').forEach(btn => {
      btn.style.display = btn.dataset.mode === activeMode ? 'none' : '';
    });
    rethinkSection.classList.remove('hidden');
    bottomActions.classList.remove('hidden');
  }

  function showError(err) {
    loadingState.classList.add('hidden');
    explanationOutput.classList.add('hidden');
    let message = 'Something went wrong. Please try again.';
    if (err.message === 'NO_API_KEY') {
      message = 'No API key set. Use the built-in demo to see how it works.';
    } else if (err.message.includes('fetch') || err.message.includes('network')) {
      message = 'Network error. Check your connection and try again.';
    } else if (err.message) {
      message = err.message;
    }
    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
  }

  retryBtn.addEventListener('click', () => { if (currentMode) startExplanation(currentMode); });

  document.querySelectorAll('.rethink-btn').forEach(btn => {
    btn.addEventListener('click', () => { stopSpeech(); startExplanation(btn.dataset.mode); });
  });

  backToModeBtn.addEventListener('click', () => { stopSpeech(); showSection(modeSection); });

  // Listen
  listenBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) { listenLabel.textContent = 'Not supported'; return; }
    if (isSpeaking) { stopSpeech(); return; }
    if (!currentExplanationText) return;

    // Clear any stale speech before starting a new explanation.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentExplanationText);
    utterance.rate = 0.90;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => {
      isSpeaking = true;
      listenIcon.textContent = '⏹';
      listenLabel.textContent = 'Stop';
      listenBtn.classList.add('listening');
    };
    utterance.onend = utterance.onerror = () => {
      isSpeaking = false;
      listenIcon.textContent = '🔊';
      listenLabel.textContent = 'Listen';
      listenBtn.classList.remove('listening');
    };
    window.speechSynthesis.speak(utterance);
  });

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    if (listenIcon)  listenIcon.textContent  = '🔊';
    if (listenLabel) listenLabel.textContent = 'Listen';
    if (listenBtn)   listenBtn.classList.remove('listening');
  }

  // Step 4: Practice
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
    practiceAnswers = [];
    try {
      if (isDemo) {
        await delay(800);
        practiceData = DEMO_PRACTICE[currentLang];
      } else {
        practiceData = await AI.generatePractice(currentMaterial, currentMode);
      }
      renderQuestions(practiceData, practiceQuestions, practiceAnswers, () => {
        const ready = practiceAnswers.every(a => a !== null);
        checkAnswersBtn.disabled = !ready;
        checkAnswersBtn.style.opacity = ready ? '1' : '0.5';
      });
      practiceLoading.classList.add('hidden');
      practiceQuestions.classList.remove('hidden');
      practiceActions.classList.remove('hidden');
      checkAnswersBtn.disabled = true;
      checkAnswersBtn.style.opacity = '0.5';
    } catch (err) {
      practiceLoading.classList.add('hidden');
      practiceQuestions.innerHTML = '<p style="color:var(--text-secondary);font-size:0.9rem;">Could not generate questions. ' + (err.message === 'NO_API_KEY' ? 'Try the demo mode.' : 'Please try again.') + '</p>';
      practiceQuestions.classList.remove('hidden');
    }
  });

  checkAnswersBtn.addEventListener('click', () => {
    lockOptions(practiceQuestions);
    renderResults(practiceData, practiceAnswers, practiceResults, false);
    practiceActions.classList.add('hidden');
    practiceResults.classList.remove('hidden');
    practiceNav.classList.remove('hidden');
  });

  backToExplainBtn.addEventListener('click', () => { stopSpeech(); showSection(explanationSection); });

  // Step 5: Quiz
  toQuizBtn.addEventListener('click', () => {
    showSection(quizSection);
    quizIntro.classList.remove('hidden');
    quizLoading.classList.add('hidden');
    quizQuestions.classList.add('hidden');
    quizActions.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizQuestions.innerHTML = '';
    quizResultItems.innerHTML = '';
    quizAnswers = [];
  });

  startQuizBtn.addEventListener('click', async () => {
    quizIntro.classList.add('hidden');
    quizLoading.classList.remove('hidden');
    try {
      if (isDemo) {
        await delay(900);
        quizData = DEMO_QUIZ[currentLang];
      } else {
        quizData = await AI.generateQuiz(currentMaterial, currentMode);
      }
      renderQuestions(quizData, quizQuestions, quizAnswers, () => {
        const ready = quizAnswers.every(a => a !== null);
        submitQuizBtn.disabled = !ready;
        submitQuizBtn.style.opacity = ready ? '1' : '0.5';
      });
      quizLoading.classList.add('hidden');
      quizQuestions.classList.remove('hidden');
      quizActions.classList.remove('hidden');
      submitQuizBtn.disabled = true;
      submitQuizBtn.style.opacity = '0.5';
    } catch (err) {
      quizLoading.classList.add('hidden');
      quizIntro.innerHTML = '<p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:16px;">Could not generate quiz. ' + (err.message === 'NO_API_KEY' ? 'Try the demo mode.' : 'Please try again.') + '</p><button class="btn btn-ghost btn-sm" onclick="location.reload()">Start over</button>';
      quizIntro.classList.remove('hidden');
    }
  });

  submitQuizBtn.addEventListener('click', () => {
    lockOptions(quizQuestions);
    quizActions.classList.add('hidden');
    quizQuestions.classList.add('hidden');
    const correct = renderResults(quizData, quizAnswers, quizResultItems, true);
    const total   = quizData.length;
    const pct     = Math.round((correct / total) * 100);
    let grade, msg;
    if (pct === 100)    { grade = 'Perfect';       msg = 'You nailed it.'; }
    else if (pct >= 75) { grade = 'Good';           msg = 'Solid understanding.'; }
    else if (pct >= 50) { grade = 'Getting there';  msg = 'A few things to revisit.'; }
    else                { grade = 'Keep going';     msg = 'Try a different explanation style.'; }
    quizScoreCard.innerHTML =
      '<div class="quiz-score-number">' + correct + '/' + total + '</div>' +
      '<div class="quiz-score-grade">'  + grade   + '</div>' +
      '<div class="quiz-score-msg">'    + msg      + '</div>';
    quizResults.classList.remove('hidden');
    if (correct < total) {
      quizRethink.classList.remove('hidden');
    } else {
      quizRethink.classList.add('hidden');
    }
  });

  document.querySelectorAll('#quizRethink .rethink-btn').forEach(btn => {
    btn.addEventListener('click', () => { stopSpeech(); startExplanation(btn.dataset.mode); });
  });

  backToPracticeBtn.addEventListener('click', () => showSection(practiceSection));

  startOverBtn.addEventListener('click', () => {
    stopSpeech();
    materialInput.value = '';
    currentMaterial = '';
    currentMode     = '';
    isDemo          = false;
    showSection(inputSection);
  });

  // Shared: render questions
  function renderQuestions(questions, container, answersArr, onAnswer) {
    container.innerHTML = '';
    questions.forEach((q, i) => {
      answersArr[i] = null;
      const card = document.createElement('div');
      card.className = 'practice-q';
      const num = document.createElement('div');
      num.className = 'practice-q-num';
      num.textContent = 'Question ' + (i + 1) + ' of ' + questions.length;
      const text = document.createElement('div');
      text.className = 'practice-q-text';
      text.textContent = q.question;
      card.appendChild(num);
      card.appendChild(text);
      const opts = document.createElement('div');
      opts.className = 'mc-options';
      q.options.forEach((opt, j) => {
        const btn = document.createElement('button');
        btn.className = 'mc-option';
        btn.type = 'button';
        btn.innerHTML = '<span class="mc-letter">' + LETTERS[j] + '</span>' + opt;
        btn.addEventListener('click', () => {
          opts.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          answersArr[i] = j;
          onAnswer();
        });
        opts.appendChild(btn);
      });
      card.appendChild(opts);
      container.appendChild(card);
    });
  }

  // Shared: render results
  function renderResults(questions, answers, container, addFeedback) {
    container.innerHTML = '';
    let correct = 0;
    questions.forEach((q, i) => {
      const userAns   = answers[i];
      const isCorrect = userAns === q.correct;
      if (isCorrect) correct++;
      const item = document.createElement('div');
      item.className = 'result-item';
      const status = document.createElement('div');
      status.className = 'result-status ' + (isCorrect ? 'correct' : 'incorrect');
      status.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
      const qText = document.createElement('div');
      qText.className = 'result-q';
      qText.textContent = q.question;
      const answerLine = document.createElement('div');
      answerLine.className = 'result-answer';
      if (isCorrect) {
        answerLine.textContent = 'Your answer: ' + LETTERS[userAns] + ' — ' + q.options[userAns];
      } else {
        answerLine.textContent = 'Your answer: ' + (LETTERS[userAns] || '?') + ' · Correct: ' + LETTERS[q.correct] + ' — ' + q.options[q.correct];
      }
      item.appendChild(status);
      item.appendChild(qText);
      item.appendChild(answerLine);
      if (addFeedback && q.explanation) {
        const exp = document.createElement('div');
        exp.className = 'result-explanation';
        exp.textContent = q.explanation;
        item.appendChild(exp);
      }
      container.appendChild(item);
    });
    return correct;
  }

  // Shared: lock options
  function lockOptions(container) {
    container.querySelectorAll('.mc-option').forEach(btn => {
      btn.style.pointerEvents = 'none';
    });
  }

  // Utility
  async function highlightKeyTerms() {
    try {
      const terms = isDemo
        ? ["pointer", "memory address", "variable", "dereference", "operator"]
        : await AI.getKeyTerms(currentExplanationText);
      if (!terms || !terms.length) return;
      const bar = document.createElement("div");
      bar.className = "key-terms-bar";
      const label = document.createElement("div");
      label.className = "key-terms-label";
      label.textContent = "Key terms";
      bar.appendChild(label);
      terms.forEach(term => {
        const chip = document.createElement("span");
        chip.className = "key-term-chip";
        chip.textContent = term;
        bar.appendChild(chip);
      });
      explanationContent.appendChild(bar);
    } catch(e) {}
  }

  function mdToHtml(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  // History
  const HISTORY_KEY = "lyw-history";

  function saveToHistory(material, mode, lang) {
    const history = getHistory();
    const item = { material, mode, lang, date: Date.now() };
    history.unshift(item);
    const trimmed = history.slice(0, 3);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
    catch(e) { return []; }
  }

  function renderHistory() {
    const history = getHistory();
    const list = document.getElementById("historyList");
    list.innerHTML = "";
    if (!history.length) {
      list.innerHTML = "<div class=\"history-empty\">No history yet.</div>";
      return;
    }
    const MODE_ICONS = { simple: "◎", analogy: "◈", visual: "◱", steps: "◳" };
    history.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.className = "history-item";
      btn.type = "button";
      btn.innerHTML = "<div class=\"history-item-mode\">" + (MODE_ICONS[item.mode] || "") + " " + item.mode + " · " + (item.lang || "English") + "</div><div class=\"history-item-text\">" + item.material.slice(0, 120) + "...</div>";
      btn.addEventListener("click", () => {
        materialInput.value = item.material;
        currentLang = item.lang || "English";
        document.querySelectorAll(".lang-btn").forEach(b => {
          b.classList.toggle("active", b.dataset.lang === currentLang);
        });
        document.getElementById("historyPanel").classList.add("hidden");
        currentMaterial = item.material;
        isDemo = false;
        materialPreview.textContent = item.material;
        showSection(modeSection);
      });
      list.appendChild(btn);
    });
  }

  document.getElementById("historyBtn").addEventListener("click", () => {
    renderHistory();
    document.getElementById("historyPanel").classList.remove("hidden");
  });

  document.getElementById("historyClose").addEventListener("click", () => {
    document.getElementById("historyPanel").classList.add("hidden");
  });

  document.getElementById("historyClearBtn").addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})();
