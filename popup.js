document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveKeyBtn = document.getElementById('saveKey');
  const checkBtn = document.getElementById('checkBtn');
  const reportBtn = document.getElementById('reportBtn');
  const resultDiv = document.getElementById('result');
  const badgeDiv = document.getElementById('badge');
  const langSelect = document.getElementById('langSelect');
  const providerSelect = document.getElementById('providerSelect');
  const modelSelect = document.getElementById('modelSelect');
  const themeToggle = document.getElementById('themeToggle');
  const feedbackDiv = document.getElementById('feedback');
  const stars = document.querySelectorAll('.star');
  const feedbackText = document.getElementById('feedbackText');
  const submitFeedbackBtn = document.getElementById('submitFeedback');

  const langs = {
    en: {
      title: 'AI Fact-Checker',
      apiKeyLabel: 'API Key:',
      saveKey: 'Save Key',
      checkPage: 'Check Page',
      checkSelected: 'Check Selected',
      reportMisinfo: 'Report Misinfo',
      shareNostr: 'Share on Nostr',
      zap: 'Zap 1 Sat',
      zap1: 'Zap 1 Sat (Tip)',
      zap10: 'Zap 10 Sats (5 More Checks)',
      zapOverride: 'Zap 100 Sats (Override Result)',
      rateCheck: 'Rate this check:',
      copyResult: 'Copy Result',
      searchSnopes: 'Search on Snopes',
      searchFactCheck: 'Search on FactCheck.org',
      exportResult: 'Export Result',
      toggleTheme: 'Toggle Theme',
      help: 'Help',
      comments: 'Comments...',
      submitFeedback: 'Submit Feedback',
      freeUsed: 'Free checks used up! Zap to unlock more or wait for reset.',
      checking: 'Checking...',
      checkingSelected: 'Checking selected text...',
      error: 'Error: ',
      reported: 'Reported! Thanks for helping fight misinformation.',
      shared: 'Shared on Nostr!',
      keySaved: 'API Key saved!',
      enterKey: 'Please enter a valid API key.',
      nostrNotFound: 'Nostr extension not found. Please install a Nostr signer like nos2x or Alby.',
      shareError: 'Error sharing: ',
      reportError: 'Error reporting: ',
      tabNotReady: 'Tab not ready. Please wait for the page to load.',
      cannotCheck: 'Cannot fact-check on this page type.',
      cannotScan: 'Cannot scan content on this page type.',
      selectText: 'Please select at least 10 characters of text to fact-check.',
      badgeText: (badge, count, checks) => `Badge: ${badge} (${count} reports) | Checks: ${checks}/5 free`
    },
    es: {
      title: 'Verificador de Hechos IA',
      apiKeyLabel: 'Clave API:',
      saveKey: 'Guardar Clave',
      checkPage: 'Verificar Pagina',
      checkSelected: 'Verificar Seleccionado',
      reportMisinfo: 'Reportar Desinformacion',
      shareNostr: 'Compartir en Nostr',
      zap: 'Zap 1 Sat',
      zap1: 'Zap 1 Sat (Propina)',
      zap10: 'Zap 10 Sats (5 Verificaciones Mas)',
      zapOverride: 'Zap 100 Sats (Anular Resultado)',
      rateCheck: 'Califica esta verificacion:',
      copyResult: 'Copiar Resultado',
      searchSnopes: 'Buscar en Snopes',
      searchFactCheck: 'Buscar en FactCheck.org',
      exportResult: 'Exportar Resultado',
      toggleTheme: 'Cambiar Tema',
      help: 'Ayuda',
      comments: 'Comentarios...',
      submitFeedback: 'Enviar Comentarios',
      freeUsed: '¡Verificaciones gratuitas agotadas! Zap para desbloquear más o espera el reinicio.',
      checking: 'Verificando...',
      checkingSelected: 'Verificando texto seleccionado...',
      error: 'Error: ',
      reported: '¡Reportado! Gracias por ayudar a combatir la desinformación.',
      shared: '¡Compartido en Nostr!',
      keySaved: '¡Clave API guardada!',
      enterKey: 'Por favor ingresa una clave API válida.',
      nostrNotFound: 'Extensión Nostr no encontrada. Por favor instala un firmante Nostr como nos2x o Alby.',
      shareError: 'Error compartiendo: ',
      reportError: 'Error reportando: ',
      tabNotReady: 'Pestaña no lista. Por favor espera a que la página cargue.',
      cannotCheck: 'No se puede verificar hechos en este tipo de página.',
      cannotScan: 'No se puede escanear contenido en este tipo de página.',
      selectText: 'Por favor selecciona al menos 10 caracteres de texto para verificar.',
      badgeText: (badge, count, checks) => `Insignia: ${badge} (${count} reportes) | Verificaciones: ${checks}/5 gratis`
    }
  };

  let currentLang = 'en';

  const updateModels = () => {
    const provider = providerSelect.value;
    modelSelect.innerHTML = '';
    if (provider === 'openai') {
      modelSelect.innerHTML = '<option value="gpt-3.5-turbo">GPT-3.5 Turbo</option><option value="gpt-4">GPT-4</option>';
    } else if (provider === 'xai') {
      modelSelect.innerHTML = '<option value="grok-beta">Grok Beta</option>';
    }
  };

  const updateTexts = () => {
    const l = langs[currentLang];
    document.querySelector('h3').textContent = l.title;
    document.querySelector('label[for="apiKey"]').textContent = l.apiKeyLabel;
    saveKeyBtn.textContent = l.saveKey;
    checkBtn.textContent = l.checkPage;
    document.getElementById('checkSelectedBtn').textContent = l.checkSelected;
    reportBtn.textContent = l.reportMisinfo;
    document.getElementById('shareNostrBtn').textContent = l.shareNostr;
    document.getElementById('zap1Btn').textContent = l.zap1;
    document.getElementById('zap10Btn').textContent = l.zap10;
    document.getElementById('zapOverrideBtn').textContent = l.zapOverride;
    document.querySelector('#feedback p').textContent = l.rateCheck;
    feedbackText.placeholder = l.comments;
    submitFeedbackBtn.textContent = l.submitFeedback;
    document.getElementById('copyResultBtn').textContent = l.copyResult;
    document.getElementById('exportResultBtn').textContent = l.exportResult;
    document.getElementById('searchSnopesBtn').textContent = l.searchSnopes;
    document.getElementById('searchFactCheckBtn').textContent = l.searchFactCheck;
    themeToggle.textContent = l.toggleTheme;
    document.getElementById('helpBtn').textContent = l.help;
  };

  // Load saved API key, reports, checkCount, lang, provider, model, theme
  const { apiKey, reports = [], checkCount = 0, lang = 'en', provider = 'openai', model = 'gpt-3.5-turbo', theme = 'dark' } = await chrome.storage.sync.get(['apiKey', 'reports', 'checkCount', 'lang', 'provider', 'model', 'theme']);
  if (apiKey) {
    apiKeyInput.value = apiKey;
  }
  currentLang = lang;
  langSelect.value = lang;
  providerSelect.value = provider;
  updateModels();
  modelSelect.value = model;
  if (theme === 'light') {
    document.body.classList.add('light');
  }
  updateTexts();
  const reportCount = reports.length;
  let badge = 'Beginner Fact-Checker';
  if (reportCount >= 10) badge = 'Expert Fact-Hunter';
  else if (reportCount >= 5) badge = 'Pro Checker';
  else if (reportCount >= 1) badge = 'Novice Reporter';
  badgeDiv.textContent = langs[currentLang].badgeText(badge, reportCount, checkCount);

  langSelect.addEventListener('change', async () => {
    currentLang = langSelect.value;
    await chrome.storage.sync.set({ lang: currentLang });
    updateTexts();
    badgeDiv.textContent = langs[currentLang].badgeText(badge, reportCount, checkCount);
  });

  providerSelect.addEventListener('change', async () => {
    const selectedProvider = providerSelect.value;
    await chrome.storage.sync.set({ provider: selectedProvider });
    updateModels();
    // Reset model to first option
    const firstModel = modelSelect.options[0].value;
    modelSelect.value = firstModel;
    await chrome.storage.sync.set({ model: firstModel });
  });

  modelSelect.addEventListener('change', async () => {
    const selectedModel = modelSelect.value;
    await chrome.storage.sync.set({ model: selectedModel });
  });

  themeToggle.addEventListener('click', async () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    await chrome.storage.sync.set({ theme: isLight ? 'light' : 'dark' });
  });

  saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      await chrome.storage.sync.set({ apiKey: key });
      alert(langs[currentLang].keySaved);
    } else {
      alert(langs[currentLang].enterKey);
    }
  });

  checkBtn.addEventListener('click', async () => {
    const { checkCount = 0 } = await chrome.storage.sync.get('checkCount');
    if (checkCount >= 5) {
      resultDiv.textContent = langs[currentLang].freeUsed;
      document.getElementById('zapOptions').style.display = 'block';
      return;
    }

    resultDiv.innerHTML = '<div class="spinner"></div> ' + langs[currentLang].checking;
    checkBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || tab.status !== 'complete') {
        throw new Error(langs[currentLang].tabNotReady);
      }
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('file://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error(langs[currentLang].cannotCheck);
      }
      const response = await chrome.runtime.sendMessage({ action: 'factCheck', tabId: tab.id });
      resultDiv.textContent = response.result;

      // Also show overlay on the page
      await chrome.tabs.sendMessage(tab.id, { action: 'showOverlay', result: response.result });

      // Show share button
      document.getElementById('shareNostrBtn').style.display = 'block';
      document.getElementById('shareNostrBtn').dataset.result = response.result;
      document.getElementById('shareNostrBtn').dataset.url = tab.url;

      // Show zap options
      document.getElementById('zapOptions').style.display = 'block';

      // If result contains "False" or low confidence, show override option
      if (response.result.toLowerCase().includes('false') || response.result.toLowerCase().includes('misleading')) {
        document.getElementById('zapOverrideBtn').style.display = 'block';
      }

      // Show feedback
      feedbackDiv.style.display = 'block';

      // Show extra actions
      document.getElementById('extraActions').style.display = 'block';

      // Increment check count
      await chrome.storage.sync.set({ checkCount: checkCount + 1 });
      const newCount = checkCount + 1;
      badgeDiv.textContent = langs[currentLang].badgeText(badge, reportCount, newCount);
    } catch (error) {
      resultDiv.textContent = langs[currentLang].error + error.message;
    } finally {
      checkBtn.disabled = false;
    }
  });

  checkSelectedBtn.addEventListener('click', async () => {
    const { checkCount = 0 } = await chrome.storage.sync.get('checkCount');
    if (checkCount >= 5) {
      resultDiv.textContent = langs[currentLang].freeUsed;
      document.getElementById('zapOptions').style.display = 'block';
      return;
    }

    resultDiv.innerHTML = '<div class="spinner"></div> ' + langs[currentLang].checkingSelected;
    checkSelectedBtn.disabled = true;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || tab.status !== 'complete') {
        throw new Error(langs[currentLang].tabNotReady);
      }
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('file://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error(langs[currentLang].cannotScan);
      }
      // First get selected content
      const selectedResponse = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedContent' });
      if (!selectedResponse.content || selectedResponse.content.length < 10) {
        throw new Error(langs[currentLang].selectText);
      }
      // Then fact-check it
      const response = await chrome.runtime.sendMessage({ action: 'factCheckSelected', content: selectedResponse.content });
      resultDiv.textContent = response.result;

      // Show overlay
      await chrome.tabs.sendMessage(tab.id, { action: 'showOverlay', result: response.result });

      // Show share button
      document.getElementById('shareNostrBtn').style.display = 'block';
      document.getElementById('shareNostrBtn').dataset.result = response.result;
      document.getElementById('shareNostrBtn').dataset.url = tab.url;

      // Show zap options
      document.getElementById('zapOptions').style.display = 'block';

      // If result contains "False" or low confidence, show override option
      if (response.result.toLowerCase().includes('false') || response.result.toLowerCase().includes('misleading')) {
        document.getElementById('zapOverrideBtn').style.display = 'block';
      }

      // Show feedback
      feedbackDiv.style.display = 'block';

      // Show extra actions
      document.getElementById('extraActions').style.display = 'block';

      // Increment check count
      await chrome.storage.sync.set({ checkCount: checkCount + 1 });
      const newCount = checkCount + 1;
      badgeDiv.textContent = langs[currentLang].badgeText(badge, reportCount, newCount);
    } catch (error) {
      resultDiv.textContent = langs[currentLang].error + error.message;
    } finally {
      checkSelectedBtn.disabled = false;
    }
  });

  shareNostrBtn.addEventListener('click', async () => {
    const result = shareNostrBtn.dataset.result;
    const url = shareNostrBtn.dataset.url;

    if (!window.nostr) {
      alert(langs[currentLang].nostrNotFound);
      return;
    }

    try {
      const event = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['t', 'factcheck'], ['r', url]],
        content: `AI Fact-Check: ${result}\n\nSource: ${url}\n\n#factcheck #AI`
      };

      const signedEvent = await window.nostr.signEvent(event);

      // Publish to a relay
      const relay = new Relay('wss://relay.damus.io'); // Example relay
      await relay.connect();
      await relay.publish(signedEvent);
      relay.close();

      alert(langs[currentLang].shared);
    } catch (error) {
      alert(langs[currentLang].shareError + error.message);
    }
  });

  zapBtn.addEventListener('click', () => {
    // Placeholder LNURL for zapping (replace with real one)
    const lnurl = 'lightning:lnurl1dp68gurn8ghj7um9wfmxjcm99e3k7mf0v9cxj0m385ekvcenxc6r2c35xvukxefcv5mkvv34x5ekzd3ev56nyd3hxqurzepexejxxepnxscrvwfnv9nxzcn9xq6xyefhvgcxxcmyxymnserxfq5fns'; // Example, replace with your LNURL
    window.open(lnurl, '_blank');
  });

  document.getElementById('zap1Btn').addEventListener('click', () => {
    const lnurl = 'lightning:lnurl1dp68gurn8ghj7um9wfmxjcm99e3k7mf0v9cxj0m385ekvcenxc6r2c35xvukxefcv5mkvv34x5ekzd3ev56nyd3hxqurzepexejxxepnxscrvwfnv9nxzcn9xq6xyefhvgcxxcmyxymnserxfq5fns'; // Tip LNURL
    window.open(lnurl, '_blank');
  });

  document.getElementById('zap10Btn').addEventListener('click', async () => {
    const lnurl = 'lightning:lnurl1dp68gurn8ghj7um9wfmxjcm99e3k7mf0v9cxj0m385ekvcenxc6r2c35xvukxefcv5mkvv34x5ekzd3ev56nyd3hxqurzepexejxxepnxscrvwfnv9nxzcn9xq6xyefhvgcxxcmyxymnserxfq5fns'; // Unlock checks LNURL
    window.open(lnurl, '_blank');
    // Simulate unlocking 5 more checks (in real app, verify payment)
    const { checkCount = 0 } = await chrome.storage.sync.get('checkCount');
    await chrome.storage.sync.set({ checkCount: Math.max(0, checkCount - 5) }); // Reset to allow more
    badgeDiv.textContent = langs[currentLang].badgeText(badge, reportCount, Math.max(0, checkCount - 5));
    alert('Checks unlocked! (Simulated)');
  });

  document.getElementById('zapOverrideBtn').addEventListener('click', async () => {
    const lnurl = 'lightning:lnurl1dp68gurn8ghj7um9wfmxjcm99e3k7mf0v9cxj0m385ekvcenxc6r2c35xvukxefcv5mkvv34x5ekzd3ev56nyd3hxqurzepexejxxepnxscrvwfnv9nxzcn9xq6xyefhvgcxxcmyxymnserxfq5fns'; // Override LNURL
    window.open(lnurl, '_blank');
    // Simulate override (in real app, verify payment and allow user to edit result)
    resultDiv.textContent = 'Result overridden: True (user paid to override)';
    alert('Result overridden! (Simulated)');
  });

  reportBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const { reports = [] } = await chrome.storage.sync.get('reports');
      reports.push({ url: tab.url, timestamp: Date.now() });
      await chrome.storage.sync.set({ reports });
      resultDiv.textContent = langs[currentLang].reported;

      // Update badge
      const newCount = reports.length;
      let newBadge = 'Beginner Fact-Checker';
      if (newCount >= 10) newBadge = 'Expert Fact-Hunter';
      else if (newCount >= 5) newBadge = 'Pro Checker';
      else if (newCount >= 1) newBadge = 'Novice Reporter';
      badgeDiv.textContent = langs[currentLang].badgeText(newBadge, newCount, checkCount);
    } catch (error) {
      resultDiv.textContent = langs[currentLang].reportError + error.message;
    }
  });

  // Feedback handling
  let selectedRating = 0;
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
      stars.forEach(s => s.classList.remove('selected'));
      for (let i = 0; i < selectedRating; i++) {
        stars[i].classList.add('selected');
      }
    });
  });

  submitFeedbackBtn.addEventListener('click', async () => {
    const comment = feedbackText.value.trim();
    const feedback = { rating: selectedRating, comment, timestamp: Date.now() };
    const { feedbacks = [] } = await chrome.storage.sync.get('feedbacks');
    feedbacks.push(feedback);
    await chrome.storage.sync.set({ feedbacks });
    alert('Feedback submitted! Thanks for your input.');
    feedbackDiv.style.display = 'none';
    feedbackText.value = '';
    stars.forEach(s => s.classList.remove('selected'));
    selectedRating = 0;
  });

  // Extra actions
  document.getElementById('copyResultBtn').addEventListener('click', () => {
    const resultText = resultDiv.textContent;
    navigator.clipboard.writeText(resultText).then(() => {
      alert('Result copied to clipboard!');
    });
  });

  document.getElementById('exportResultBtn').addEventListener('click', () => {
    const resultText = resultDiv.textContent;
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fact-check-result.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('searchSnopesBtn').addEventListener('click', () => {
    const query = encodeURIComponent(resultDiv.textContent.substring(0, 100)); // Use first 100 chars as query
    window.open(`https://www.snopes.com/search/?q=${query}`, '_blank');
  });

  document.getElementById('searchFactCheckBtn').addEventListener('click', () => {
    const query = encodeURIComponent(resultDiv.textContent.substring(0, 100));
    window.open(`https://www.factcheck.org/search/?q=${query}`, '_blank');
  });

  document.getElementById('helpBtn').addEventListener('click', () => {
    window.open('https://github.com/yourusername/ai-fact-checker-extension/blob/main/README.md', '_blank'); // Replace with actual repo URL
  });
});