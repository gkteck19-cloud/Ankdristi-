// 1. Firebase Initialize
const firebaseConfig = {
  apiKey: "AIzaSyCJIfQ-UTS6ns0pRO0nH4wzUQNnBB4_plc",
  authDomain: "ankdristi-37446610-e3f3b.firebaseapp.com",
  projectId: "ankdristi-37446610-e3f3b",
  storageBucket: "ankdristi-37446610-e3f3b.firebasestorage.app",
  messagingSenderId: "216216154216",
  appId: "1:216216154216:web:c6d5ffde5dc4faf13dcbdd"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. Splash Screen Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                // लॉगिन स्थिति के आधार पर पेज दिखाएँ
                checkUserStatus();
            }, 800);
        }
    }, 2500);
});

function checkUserStatus() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('home-page').classList.remove('hidden');
            document.getElementById('auth-page').classList.add('hidden');
        } else {
            document.getElementById('home-page').classList.remove('hidden');
        }
    });
}

// 3. Chaldean Numerology & Live Calc
const chaldeanMap = {
    a:1, i:1, j:1, q:1, y:1, b:2, k:2, r:2,
    c:3, g:3, l:3, s:3, d:4, m:4, t:4,
    e:5, h:5, n:5, x:5, u:6, v:6, w:6,
    o:7, z:7, f:8, p:8
};

const nameInput = document.getElementById('userName');
const namankDisplay = document.getElementById('namankDisplay');

if(nameInput) {
    nameInput.addEventListener('input', () => {
        let name = nameInput.value.toLowerCase();
        let sum = 0;
        for (let char of name) {
            if (chaldeanMap[char]) sum += chaldeanMap[char];
        }
        let singleDigit = reduceToSingle(sum);
        namankDisplay.innerText = `नामांक: ${sum} (${singleDigit})`;
    });
}

function reduceToSingle(n) {
    while (n > 9) {
        n = n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return n;
}

// 4. Loshu Grid Logic (यह Result Page के लिए जरूरी है)
function generateLoshuGrid(dob) {
    const digits = dob.replace(/\D/g, '').split('');
    // सभी सेल को पहले खाली करें (अगर HTML में cell IDs हैं)
    const cells = [1,2,3,4,5,6,7,8,9];
    cells.forEach(id => {
        const cell = document.getElementById(`cell-${id}`);
        if(cell) cell.innerText = "";
    });

    digits.forEach(digit => {
        if (digit !== "0") {
            const cell = document.getElementById(`cell-${digit}`);
            if (cell) cell.innerText += digit;
        }
    });
}

// 5. Navigation & Result Trigger
const submitBtn = document.getElementById('submitBtn');
if(submitBtn) {
    submitBtn.addEventListener('click', () => {
        const name = nameInput.value;
        const dobVal = document.getElementById('dob').value;

        if (!name || !dobVal) {
            alert("कृपया नाम और जन्म तिथि दर्ज करें।");
            return;
        }

        // ग्रिड भरें
        generateLoshuGrid(dobVal);
        
        // पेज बदलें
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('result-page').classList.remove('hidden');
        window.scrollTo(0,0);
    });
}

// 6. Auth Toggle & Handle
let isLoginMode = false;
const openAuthBtn = document.getElementById('open-auth-btn');

if(openAuthBtn) {
    openAuthBtn.addEventListener('click', () => {
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('auth-page').classList.remove('hidden');
    });
}

function closeAuth() {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "लॉगिन (Login)" : "पंजीकरण (Register)";
    document.getElementById('mobile-group').style.display = isLoginMode ? "none" : "block";
    document.getElementById('dob-group').style.display = isLoginMode ? "none" : "block";
    document.getElementById('toggle-text').innerText = isLoginMode ? "अकाउंट बनाना चाहते हैं?" : "क्या पहले से अकाउंट है?";
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
        alert("ईमेल और पासवर्ड आवश्यक हैं।");
        return;
    }

    try {
        if (isLoginMode) {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } else {
            const mobile = document.getElementById('auth-mobile').value;
            const dob = document.getElementById('auth-dob').value;
            const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await db.collection("users").doc(userCred.user.uid).set({
                email, mobile, dob, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        closeAuth();
    } catch (error) {
        alert(error.message);
    }
}
