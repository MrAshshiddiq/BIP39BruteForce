#!/usr/bin/env node

const { Wallet, getAddress } = require("ethers");
const fs = require("fs");
const readline = require("readline");

// Warna console
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Setup readline (hanya sekali)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi input
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Clear screen + welcome
function welcomeMessage() {
  console.clear();
  console.log(colors.cyan + "====================================================");
  console.log(" ");
  console.log(" Selamat Datang di Tools Brute Force by MrAshshiddiq");
  console.log("              IG: maulanarahmanashshiddiq");
  console.log("             https://github.com/MrAshshiddiq");
  console.log(" ");
  console.log("====================================================" + colors.reset);
}

// Validasi alamat dengan ethers getAddress, handle trim dan case
function validateAddress(input) {
  try {
    return getAddress(input.trim());
  } catch {
    return null;
  }
}

function makeProgressBar(percent) {
  const total = 30; // panjang bar
  const filled = Math.floor((percent / 100) * total);
  return "[" + "█".repeat(filled) + "░".repeat(total - filled) + "]";
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

async function mainMenu() {
  welcomeMessage();

  let originalWords;

  // Input phrase valid
  while (true) {
    const phrase = await askQuestion(
      colors.yellow + "Masukkan seed phrase (gunakan 'x' untuk kata yang hilang):\n> " + colors.reset
    );

    originalWords = phrase.trim().split(/\s+/);

    if (originalWords.length !== 12) {
      console.log(colors.red + "❌ Seed phrase harus tepat 12 kata!" + colors.reset);
      continue;
    }

    const missingCount = originalWords.filter((w) => w.toLowerCase() === "x").length;

    if (missingCount === 0) {
      console.log(colors.red + "❌ Tidak ada kata 'x' yang hilang di seed phrase." + colors.reset);
      continue;
    }

    break;
  }

  // Input address valid
  let target;
  while (true) {
    const targetInput = await askQuestion(colors.yellow + "Masukkan target address EVM:\n> " + colors.reset);

    const validAddress = validateAddress(targetInput);

    if (validAddress) {
      target = validAddress;
      break;
    } else {
      console.log(colors.red + "❌ Alamat wallet tidak valid!" + colors.reset);
    }
  }

  await bruteForce(originalWords, target);
}

async function bruteForce(originalWords, target) {
  const wordlist = String(fs.readFileSync("./bip39.txt")).split("\n");
  const missingCount = originalWords.filter((w) => w.toLowerCase() === "x").length;
  const placeholder = /\bx\b/;
  const totalCombos = BigInt(wordlist.length) ** BigInt(missingCount);

  let tried = 0n;
  const startTime = Date.now();

  console.log("\n🔍 Proses brute force dimulai...");

  for (let i = 0n; i < totalCombos; i++) {
    let testPhrase = originalWords.join(" ");
    for (let j = 0; j < missingCount; j++) {
      const index = (i / BigInt(wordlist.length) ** BigInt(j)) % BigInt(wordlist.length);
      testPhrase = testPhrase.replace(placeholder, wordlist[Number(index)]);
    }

    tried++;

    let address;
    try {
      ({ address } = Wallet.fromPhrase(testPhrase));
    } catch {
      continue;
    }

    if (address === target) {
      process.stdout.write("\n✅ MATCH DITEMUKAN!\n");

      const finalWords = testPhrase.split(" ").map((word, idx) => {
        if (originalWords[idx].toLowerCase() === "x") {
          return colors.yellow + word + colors.reset;
        } else {
          return colors.cyan + word + colors.reset;
        }
      });

      console.log(colors.white + "- Phrases : " + finalWords.join(" ") + colors.reset);
      console.log(colors.white + "- Address EVM : " + colors.cyan + address + colors.reset);
      process.exit(0);
    }

    // Update progress tiap 2048 percobaan
    if (tried % 2048n === 0n || tried === totalCombos) {
      const percent = (Number(tried) / Number(totalCombos)) * 100;
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = Number(tried) / elapsed;
      const eta = speed > 0 ? (Number(totalCombos - tried) / speed) : 0;

      process.stdout.write(
        "\r" +
          makeProgressBar(percent) +
          ` ${percent.toFixed(2)}% | Tried: ${tried} / ${totalCombos} | ETA: ${formatTime(eta)}`
      );
    }
  }

  console.log("\n" + colors.red + "❌ Tidak ada kecocokan ditemukan." + colors.reset);

  await mainMenu();
}

// Run program
mainMenu();
