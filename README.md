# The repository is still under construction, there may still be bugs or errors!

## More Features soon! Currently only supports Indonesian, other languages will follow!

# BIP39BruteForce
A brute force tool to recover an **Ethereum Wallet (EVM)** from a 12-word mnemonic phrase with missing words (`x` as placeholders).  
Includes a progress bar, ETA, and colored output for easier reading.

---

## 🚀 Features
- **Input Validation**:
  - Ensures the mnemonic phrase contains **exactly 12 words** (prompts again if invalid).
  - Validates the EVM address format before starting.
- **Interactive Progress Bar**:
  - Displays percentage progress, total attempts tried, and estimated time to completion.
  - Updates **in a single line** to avoid console spam.
- **Match Found**:
  - Shows the correct phrase with different colors for missing (`x`) words and the rest.
  - Displays the matched EVM address.
- **No Match Found**:
  - Red-colored message indicating no match was found.
- **Lightweight & Efficient**:
  - Progress updates are throttled (e.g., every 500 attempts) to reduce console load.
  - Uses stream output (`\r`) to keep console clean.

---

## 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MrAshshiddiq/BIP39BruteForce
   cd BIP39BruteForce
   ```

2. **Install Dependencies**
   Make sure you have [Node.js](https://nodejs.org/) version 16+ installed.
   ```bash
   npm install
   ```

3. **Prepare the Wordlist**
   - The wordlist must follow the **BIP39 English** word list.
   - Save it as `bip39.txt` in the project root directory.

---

## ▶️ Usage

1. Run the tool:
   ```bash
   node index.js
   ```

2. Enter the mnemonic phrase:
   - Example valid input:
     ```
     x x x x x x x x x x x x
     ```
   - Use `x` for missing words.
   - Only **12 words** are accepted.

3. Enter the target Ethereum address:
   - Example:
     ```
     0x0000000000000000000000000000000000000000
     ```

4. The brute force process starts:
   - Progress bar moves in one line.
   - Shows **percentage, total tried, ETA**.

5. If a match is found:
   - Displays the full phrase and the EVM address with colored output.
   - If not found, a red message **"No match found"** will be displayed.

---

## 📌 Example Output

```
Welcome to EVM Brute Force Tool!
Enter mnemonic phrase (12 words, use 'x' for missing): x x x x x x x x x x x x
Enter target Ethereum address: 0x0000000000000000000000000000000000000000
🔍 Starting brute force...
[██████░░░░░░░░░░░░░░░░░░] 20.123456% | Tried: 104000/520000 | ETA: 1m 23s

✅ MATCH FOUND :
- Phrases : lorem ipsum dolor sit amet [missing word] consectetur adipiscing elit
- EVM Address : 0x1234567890abcdef1234567890abcdef12345678
```

---

## ⚠️ Disclaimer
This tool is for **educational and security research purposes only**.  
Do not use it to access wallets that do not belong to you.

---

## 📄 License
MIT License © 2025
