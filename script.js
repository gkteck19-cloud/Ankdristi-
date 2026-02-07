// Firebase Initialize
const firebaseConfig = {
  apiKey: "AIzaSyCJIfQ-UTS6ns0pRO0nH4wzUQNnBB4_plc",
  authDomain: "ankdristi-37446610-e3f3b.firebaseapp.com",
  projectId: "ankdristi-37446610-e3f3b",
  storageBucket: "ankdristi-37446610-e3f3b.firebasestorage.app",
  messagingSenderId: "216216154216",
  appId: "1:216216154216:web:c6d5ffde5dc4faf13dcbdd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// डेटाबेस में यूजर का डेटा सेव करने का फंक्शन
async function saveUserData(name, dob, mobile, gender) {
    try {
        await db.collection("users").add({
            name: name,
            dob: dob,
            mobile: mobile,
            gender: gender,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Data saved successfully!");
    } catch (e) {
        console.error("Error saving data: ", e);
    }
}

// अपने Submit Button के लॉजिक में इसे जोड़ें:
document.getElementById('submitBtn').addEventListener('click', () => {
    const name = nameInput.value;
    const dob = document.getElementById('dob').value;
    const mobile = document.getElementById('mobile').value;
    const gender = document.getElementById('gender').value;

    if (name && dob) {
        // डेटाबेस में सेव करें
        saveUserData(name, dob, mobile, gender);
        
        // रिजल्ट दिखाएँ
        generateLoshuGrid(dob);
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('result-page').classList.remove('hidden');
    }
});


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
