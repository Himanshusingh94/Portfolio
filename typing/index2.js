// Select DOM elements
const typingText = document.querySelector(".typing-text p");
const input = document.querySelector(".wrapper .input-field");

let time = document.querySelector(".time span b");
let cpm = document.querySelector(".cpm span");
let wpm = document.querySelector(".wpm span");
let maxspeed = document.querySelector(".high span");
let mistake = document.querySelector(".mistake span");
let tryAgain = document.querySelector("button");

// Set initial values
const paragraph = [
    "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the English alphabet, making it ideal for typing practice.",
  
  "In the heart of the bustling city, the aroma of freshly baked bread wafted through the air, enticing passersby to stop and indulge.",
  
  "As the sun set behind the mountains, the sky transformed into a canvas of vibrant hues, painting a breathtaking view for all to admire.",
  
  "The curious cat cautiously approached the shimmering fish tank, its eyes wide with wonder and anticipation of the aquatic life within.",
  
  "During the annual festival, the streets were adorned with colorful lights and decorations, creating a festive atmosphere that captivated everyone."
];

let timer;           // Timer for countdown
let maxTime = 60;    // Maximum typing time
let timeLeft = maxTime;
let charIndex = 0;   // Tracks typed characters
let mistakes = 0;    // Tracks mistakes
let isTyping = false;

// Load a random paragraph for typing
function loadParagraph() {
    let randomIndex = Math.floor(Math.random() * paragraph.length); // Select random paragraph

    typingText.innerHTML = ''; // Clear previous paragraph

    // Render paragraph with individual characters wrapped in span tags
    for (const char of paragraph[randomIndex]) {
        typingText.innerHTML += `<span>${char}</span>`;
    }

    // Highlight first character
    typingText.querySelectorAll('span')[0].classList.add('active');

    // Ensure input focus when user interacts with text box
    document.addEventListener('keydown', () => input.focus());
    typingText.addEventListener("click", () => input.focus());
}

// Handle user input while typing
function initTyping() {
    const char = typingText.querySelectorAll('span'); // Get characters in the paragraph
    const typedChar = input.value.charAt(charIndex);  // Capture typed character

    if (charIndex >= char.length || timeLeft <= 0) {
        return; // Stop processing if time is up or all characters are typed
    }

    if (!isTyping) {
        timer = setInterval(initTime, 1000); // Start countdown timer
        isTyping = true;
    }

    // Check if typed character is correct
    if (char[charIndex].innerText === typedChar) {
        char[charIndex].classList.add('correct');
    } else {
        mistakes++; // Increment mistake count
        char[charIndex].classList.add('incorrect');
    }

    // Remove active class from previous character
    char.forEach(span => span.classList.remove("active"));
    
    charIndex++; // Move to the next character

    // Highlight next character
    if (charIndex < char.length) {
        char[charIndex].classList.add('active');
    }

    // Update mistake count and CPM calculation
    mistake.innerText = mistakes;
    cpm.innerText = charIndex - mistakes;

    // If all characters are typed, restart paragraph
    if (charIndex === char.length) {
        console.log(`Completed! Characters: ${charIndex}, Mistakes: ${mistakes}`);
        highSpeed();
        loadParagraph();
        charIndex = 0;
    }
}

// Timer function to track remaining time
function initTime() {
    if (timeLeft > 0) {
        timeLeft--; // Decrease time
        time.innerText = timeLeft;

        const elapsedTime = Math.max(1, maxTime - timeLeft);  // Ensure minimum elapsed time is 1
        const wpmVal = Math.round(((charIndex - mistakes) / 5) / elapsedTime * 60); // Calculate WPM
        wpm.innerText = wpmVal;
        highSpeed();

    } else {
        clearInterval(timer); // Stop timer when time runs out
    }
}

// Track highest typing speed (WPM)
function highSpeed() {
    const max = parseInt(maxspeed.innerText) || 0;
    const current = parseInt(wpm.innerText) || 0;
    const char = typingText.querySelectorAll('span');

    // Update max speed if a new high is achieved
    if (charIndex === char.length && current > max) {
        maxspeed.innerText = current;
    }
}

// Reset function to restart typing test
function reset() {
    clearInterval(timer); // Stop timer
    timeLeft = maxTime;
    time.innerText = timeLeft;
    input.value = ''; // Clear input field
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    wpm.innerText = 0;
    cpm.innerText = 0;
    mistake.innerText = 0;
    loadParagraph(); // Load new paragraph
}

// Event listeners for input and restart button
input.addEventListener("input", initTyping);
tryAgain.addEventListener("click", reset);

// Load initial paragraph
loadParagraph();