// 1. Splash Screen Timeout
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 800);
    }, 3000);
});

// 2. Chaldean Numerology Values
const chaldeanMap = {
    a:1, i:1, j:1, q:1, y:1,
    b:2, k:2, r:2,
    c:3, g:3, l:3, s:3,
    d:4, m:4, t:4,
    e:5, h:5, n:5, x:5,
    u:6, v:6, w:6,
    o:7, z:7,
    f:8, p:8
};

// 3. Live Namank Calculation
const nameInput = document.getElementById('userName');
const namankDisplay = document.getElementById('namankDisplay');

nameInput.addEventListener('input', () => {
    let name = nameInput.value.toLowerCase();
    let sum = 0;
    
    for (let char of name) {
        if (chaldeanMap[char]) sum += chaldeanMap[char];
    }
    
    let singleDigit = reduceToSingle(sum);
    namankDisplay.innerText = `नामांक: ${sum} (${singleDigit})`;
});

function reduceToSingle(n) {
    while (n > 9) {
        n = n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return n;
}

// 4. Submit & Navigation
document.getElementById('submitBtn').addEventListener('click', () => {
    const name = nameInput.value;
    const dob = document.getElementById('dob').value;

    if (!name || !dob) {
        alert("कृपया नाम और जन्म तिथि दर्ज करें।");
        return;
    }

    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
});
