# AI Fact-Checker Browser Extension

This extension fact-checks articles and posts in real-time using AI.

## Features

- **Multi-Provider AI**: Choose OpenAI (GPT-3.5/GPT-4) or xAI (Grok Beta) for fact-checking, diversifying sources for better accuracy.
- **Selected Text Scanning**: Highlight and check specific claims instantly.
- **Real-Time Social Scanning**: Auto-add fact-check buttons to tweets on Twitter/X.
- **On-Page Overlays**: Results pop up directly on the webpage with a modern, animated UI.
- **Misinformation Reporting**: Flag bad info, earn badges, and contribute to community tracking.
- **Nostr Integration**: Share fact-checks on decentralized Nostr network for global collaboration.
- **Zaps (Micropayments)**: Support tipping via Lightning Network for incentivizing quality checks and funding API costs.
- **Advanced Zaps**: Zap to unlock more checks (10 sats for 5 more), override disputed results (100 sats), or tip developers.
- **Freemium Model**: 5 free checks/day; zap to unlock more for self-sustainability.
- **User Feedback**: Rate fact-checks with stars and comments to improve accuracy.
- **Multi-Language Support**: Switch between English and Spanish in the UI.
- **Copy & Cross-Verify**: Easily copy results or search claims on Snopes and FactCheck.org for deeper checks.
- **Export & Theme**: Download fact-checks as TXT files, and toggle between dark/light themes.
- **Keyboard Shortcuts**: Quick fact-checks with Ctrl+Shift+F (selected text) or Ctrl+Shift+P (page).
- **Help & Documentation**: Direct link to README for setup and usage.
- **Keyboard Shortcuts**: Use Ctrl+Shift+F to fact-check selected text, or Ctrl+Shift+P for the current page (customizable in browser settings).
- **Polished UI**: Dark theme with glassmorphism, glows, and animations for a professional feel.

## Setup

1. Clone or download this repo.
2. Add icons: Place icon16.png, icon48.png, icon128.png in the `icons/` folder.
3. Load in Chrome: Go to chrome://extensions/, enable Developer mode, Load unpacked, select this folder.
4. Set API Key: Click the extension icon, select provider (OpenAI or xAI), choose model, enter your API key in the popup, and click "Save Key". For xAI, get a key from x.ai.
5. (Optional) For Nostr sharing: Install a Nostr signer extension like [nos2x](https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjj/) or Alby, and set up your Nostr keys.
6. (Optional) For Zaps: Install a Lightning wallet like [Alby](https://getalby.com/) to handle micropayments.

## Usage

- Click the extension icon.
- Select provider (OpenAI or xAI) and model (GPT-3.5/GPT-4 for OpenAI, Grok Beta for xAI).
- Enter and save your OpenAI API key.
- Highlight text on a page, then click "Fact-Check Selected Text" for targeted analysis.
- Or click "Fact-Check Current Page" to analyze the whole page.
- On Twitter/X, fact-check buttons appear on tweets for real-time scanning.
- Results appear in the popup and as an overlay on the page (closes automatically after 10 seconds).
- After a fact-check, rate it with stars and add comments in the feedback section.
- Use "Copy Result" to copy the fact-check to your clipboard, or "Export Result" to download as a TXT file.
- Click "Toggle Theme" to switch between dark and light modes.
- Use "Copy Result" to copy the fact-check to your clipboard, or "Export Result" to download as a TXT file.
- Click "Help" to open the full documentation on GitHub.
- Keyboard shortcuts: Ctrl+Shift+F for selected text, Ctrl+Shift+P for page (set in chrome://extensions/shortcuts).
- Click "Report as Misinfo" to flag the page for community tracking and earn badges.
- After a fact-check, click "Share on Nostr" to publish the result on the decentralized network (requires a Nostr signer extension like nos2x).
- Click "Zap 1 Sat (Tip)" to tip the developers, "Zap 10 Sats (5 More Checks)" to unlock additional free checks, or "Zap 100 Sats (Override Result)" if you disagree with a fact-check result (only shown for disputed claims).
- View your badge and free check counter (resets daily).
- Note: Limited to 1 check/minute and 5 free/day to control costs. Ensure selected/page text has substantial content for accurate results.
- Made with love for truth. Donate BTC: bc1qf2j96j70j9I3cs3gh8048mgxpg3su5ydse6z9m

## Demo

Check out the live demo at [Vercel Link] to see the extension in action without installing.

![Overlay Example](demo/overlay.gif)
![Zap Flow](demo/zap.gif)

## Future Features

- Real-time scanning on social media.
- Firebase for global reports/badges.
- Premium ad-free version.

## Installation

1. Download the extension from the [Chrome Web Store] or [Firefox Add-ons].
2. Load unpacked in Chrome: Go to chrome://extensions, enable Developer mode, click "Load unpacked", select the extension folder.
3. For Firefox: Load as temporary add-on or package for AMO.

## Beta Testers Wanted

Help us test and improve! Post feedback on Nostr or X with #AIFactChecker. Early testers get zaps as rewards.

## Tech Stack

- JavaScript
- Chrome/Firefox Extension API
- OpenAI API
- xAI Grok API