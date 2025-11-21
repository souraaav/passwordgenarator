const passwordDisplay = document.getElementById('passwordDisplay');
const copyBtn = document.getElementById('copyBtn');
const copyFeedback = document.getElementById('copyFeedback');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const includeUppercase = document.getElementById('includeUppercase');
const includeLowercase = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const strengthText = document.getElementById('strengthText');
const bars = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3'),
    document.getElementById('bar4')
];
const generateBtn = document.getElementById('generateBtn');

const strengthSlider = document.getElementById('strengthSlider');
const sensitivityValue = document.getElementById('sensitivityValue');

const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

// Initial State
let passwordLength = 12;
let options = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false
};
// Strength sensitivity (1.0 by default)
let strengthSensitivity = 1.0;

// Event Listeners
lengthSlider.addEventListener('input', (e) => {
    passwordLength = +e.target.value;
    lengthValue.innerText = passwordLength;
    generatePassword();
});

[includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        options.uppercase = includeUppercase.checked;
        options.lowercase = includeLowercase.checked;
        options.numbers = includeNumbers.checked;
        options.symbols = includeSymbols.checked;
        generatePassword();
    });
});

generateBtn.addEventListener('click', generatePassword);

strengthSlider.addEventListener('input', (e) => {
    strengthSensitivity = parseFloat(e.target.value);
    sensitivityValue.innerText = strengthSensitivity.toFixed(1);
    // Recalculate strength for current password
    calculateStrength(passwordDisplay.innerText || '');
});

copyBtn.addEventListener('click', () => {
    if (!passwordDisplay.innerText) return;
    
    navigator.clipboard.writeText(passwordDisplay.innerText).then(() => {
        showCopyFeedback();
    });
});

function showCopyFeedback() {
    copyFeedback.classList.add('active');
    setTimeout(() => {
        copyFeedback.classList.remove('active');
    }, 2000);
}

function generatePassword() {
    let charPool = '';
    if (options.uppercase) charPool += CHAR_SETS.uppercase;
    if (options.lowercase) charPool += CHAR_SETS.lowercase;
    if (options.numbers) charPool += CHAR_SETS.numbers;
    if (options.symbols) charPool += CHAR_SETS.symbols;

    if (charPool === '') {
        passwordDisplay.innerText = '';
        passwordDisplay.classList.add('placeholder');
        updateStrength(0);
        return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
    }

    passwordDisplay.innerText = password;
    passwordDisplay.classList.remove('placeholder');
    calculateStrength(password);
    animatePasswordChange();
}

function calculateStrength(password) {
    // Use sensitivity to shift thresholds: lower values make it easier to reach higher strength
    const s = Math.max(0.5, Math.min(2.0, strengthSensitivity));
    const lenThreshold1 = Math.round(8 * s);   // baseline for first length bonus
    const lenThreshold2 = Math.round(12 * s);  // baseline for second length bonus
    const lenBonusAll = Math.round(11 * s);    // threshold for full-feature bonus

    let strength = 0;

    if (password.length >= lenThreshold1) strength += 1;
    if (password.length >= lenThreshold2) strength += 1;
    if (options.uppercase && options.lowercase) strength += 1;
    if (options.numbers && options.symbols) strength += 1;
    if (options.uppercase && options.lowercase && options.numbers && options.symbols && password.length >= lenBonusAll) strength += 1;

    // Normalize to 0-4 scale (keep behavior similar to previous)
    if (strength > 4) strength = 4;
    if (strength === 0 && password.length > 0) strength = 1;

    updateStrength(strength);
}

function updateStrength(strength) {
    // Reset bars
    bars.forEach(bar => {
        bar.className = 'bar';
        bar.style.backgroundColor = 'transparent';
    });

    let color = '';
    let text = '';

    switch (strength) {
        case 1:
            color = 'var(--strength-weak)';
            text = 'Weak';
            break;
        case 2:
            color = 'var(--strength-medium)';
            text = 'Medium';
            break;
        case 3:
            color = 'var(--strength-strong)';
            text = 'Strong';
            break;
        case 4:
            color = 'var(--strength-hardcore)';
            text = 'Hardcore';
            break;
        default:
            text = '';
    }

    strengthText.innerText = text;

    for (let i = 0; i < strength; i++) {
        bars[i].classList.add('active');
        bars[i].style.backgroundColor = color;
    }
}

function animatePasswordChange() {
    passwordDisplay.style.opacity = '0.5';
    passwordDisplay.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        passwordDisplay.style.opacity = '1';
        passwordDisplay.style.transform = 'scale(1)';
    }, 150);
}

// Generate on load
generatePassword();
