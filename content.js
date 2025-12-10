// Content script to extract page content
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getContent') {
    let content = '';

    // Try to extract from common article selectors
    const article = document.querySelector('article') || document.querySelector('[role="article"]') || document.querySelector('.post') || document.querySelector('.tweet') || document.querySelector('.status');
    if (article) {
      content = article.innerText;
    } else {
      // Fallback to body, but limit
      content = document.body.innerText;
    }

    // Clean up: remove scripts, excessive whitespace
    content = content.replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/\s+/g, ' ').trim();
    content = content.substring(0, 5000); // Limit to 5k chars for API

    sendResponse({ content: content });
  } else if (request.action === 'getSelectedContent') {
    const selected = window.getSelection().toString().trim();
    sendResponse({ content: selected.substring(0, 5000) });
  } else if (request.action === 'showOverlay') {
    showFactCheckOverlay(request.result);
  }
});

function showFactCheckOverlay(result) {
  // Remove existing overlay
  const existing = document.getElementById('fact-check-overlay');
  if (existing) existing.remove();

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'fact-check-overlay';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(26,26,26,0.9) 100%);
      border: 2px solid rgba(0,255,136,0.8);
      border-radius: 12px;
      padding: 18px;
      z-index: 10000;
      max-width: 340px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,255,136,0.3);
      font-family: 'Fira Code', 'Courier New', monospace;
      color: #ffffff;
      animation: fadeIn 0.5s ease-in, pulse 2s ease-in-out infinite;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    ">
      <h4 style="margin: 0 0 12px 0; color: #00ff88; font-size: 14px; font-weight: 600; text-shadow: 0 0 8px #00ff88;">AI Fact-Check Result</h4>
      <p style="margin: 0; font-size: 12px; line-height: 1.5;">${result}</p>
      <button id="close-overlay" style="
        margin-top: 12px;
        padding: 6px 12px;
        background: #dc3545;
        color: white;
        border: 1px solid #dc3545;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        font-size: 11px;
        font-family: 'Fira Code', monospace;
      ">Close</button>
    </div>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,255,136,0.3); }
        50% { box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,255,136,0.6); }
      }
      #fact-check-overlay button:hover {
        background: #c82333;
        border-color: #c82333;
        box-shadow: 0 0 8px #dc3545;
      }
    </style>
  `;
  document.body.appendChild(overlay);

  // Close button
  document.getElementById('close-overlay').addEventListener('click', () => overlay.remove());

  // Auto-remove after 15 seconds
  setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 15000);
}