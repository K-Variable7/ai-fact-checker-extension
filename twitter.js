// Twitter-specific content script for real-time fact-checking
function addCheckButtonToTweet(tweetElement) {
  if (tweetElement.querySelector('.fact-check-btn')) return; // Already added

  const actions = tweetElement.querySelector('[role="group"]');
  if (!actions) return;

  const checkBtn = document.createElement('button');
  checkBtn.className = 'fact-check-btn';
  checkBtn.innerHTML = '🔍';
  checkBtn.style.cssText = `
    background: none;
    border: none;
    color: #1da1f2;
    cursor: pointer;
    font-size: 14px;
    margin-left: 8px;
    padding: 4px;
  `;
  checkBtn.title = 'Fact-Check this tweet';

  checkBtn.addEventListener('click', async () => {
    const textElement = tweetElement.querySelector('[data-testid="Tweet-User-Text"]') || tweetElement.querySelector('[role="group"]').previousElementSibling;
    const text = textElement ? textElement.innerText : '';
    if (text.length < 10) return;

    // Send to background for fact-check
    const response = await chrome.runtime.sendMessage({ action: 'factCheckSelected', content: text });
    showFactCheckOverlay(response.result);
  });

  actions.appendChild(checkBtn);
}

// Observe for new tweets
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tweets = node.querySelectorAll('[data-testid="Tweet-User-Text"]');
        tweets.forEach(tweet => {
          const tweetElement = tweet.closest('[data-testid="tweet"]') || tweet.closest('article');
          if (tweetElement) addCheckButtonToTweet(tweetElement);
        });
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Add to existing tweets
setTimeout(() => {
  const tweets = document.querySelectorAll('[data-testid="tweet"], article');
  tweets.forEach(addCheckButtonToTweet);
}, 2000);