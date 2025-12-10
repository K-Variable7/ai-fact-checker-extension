// Background service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'factCheck') {
    handleFactCheck(request.tabId).then(result => {
      sendResponse({ result });
    }).catch(error => {
      sendResponse({ result: 'Error: ' + error.message });
    });
    return true; // Keep message channel open
  } else if (request.action === 'factCheckSelected') {
    handleFactCheckSelected(request.content).then(result => {
      sendResponse({ result });
    }).catch(error => {
      sendResponse({ result: 'Error: ' + error.message });
    });
    return true;
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  if (command === 'fact-check-selected') {
    // Get selected text
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => window.getSelection().toString()
    });
    const selectedText = result[0].result;
    if (selectedText && selectedText.length >= 10) {
      const factCheckResult = await handleFactCheckSelected(selectedText);
      // Show overlay
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      chrome.tabs.sendMessage(tab.id, { action: 'showOverlay', result: factCheckResult });
    }
  } else if (command === 'fact-check-page') {
    const factCheckResult = await handleFactCheck(tab.id);
    // Show overlay
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    chrome.tabs.sendMessage(tab.id, { action: 'showOverlay', result: factCheckResult });
  }
});

async function handleFactCheckSelected(content) {
  // Rate limiting: Allow one check per minute
  const now = Date.now();
  const { lastCheck } = await chrome.storage.sync.get('lastCheck');
  if (lastCheck && now - lastCheck < 60000) {
    throw new Error('Please wait 1 minute before checking again to avoid API costs.');
  }
  await chrome.storage.sync.set({ lastCheck: now });

  // Get API key, provider, and model from storage
  const { apiKey, provider = 'openai', model = 'gpt-3.5-turbo' } = await chrome.storage.sync.get(['apiKey', 'provider', 'model']);
  if (!apiKey) {
    throw new Error('API key not set. Please save your API key in the extension popup.');
  }

  // Use provided content
  if (!content || content.trim().length < 10) {
    throw new Error('Not enough content to fact-check.');
  }

  // Call AI API
  const prompt = `Fact-check the following text as an AI assistant. Provide a truth score (0-100), a brief explanation, and cite 2-3 reliable sources if possible. Be neutral and evidence-based.\n\nText: ${content}`;

  let apiUrl, headers;
  if (provider === 'openai') {
    apiUrl = 'https://api.openai.com/v1/chat/completions';
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  } else if (provider === 'xai') {
    apiUrl = 'https://api.x.ai/v1/chat/completions';
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  const aiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300 // Limit response length
    })
  });

  if (!aiResponse.ok) {
    const errorData = await aiResponse.json().catch(() => ({}));
    throw new Error(`AI API error (${aiResponse.status}): ${errorData.error?.message || aiResponse.statusText}`);
  }

  const data = await aiResponse.json();
  const result = data.choices[0]?.message?.content || 'No response from AI.';

  return result;
}