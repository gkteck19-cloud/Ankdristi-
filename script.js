// 1. Firebase Initialize
const firebaseConfig = {
  apiKey: "AIzaSyCJIfQ-UTS6ns0pRO0nH4wzUQNnBB4_plc",
  authDomain: "ankdristi-37446610-e3f3b.firebaseapp.com",
  projectId: "ankdristi-37446610-e3f3b",
  storageBucket: "ankdristi-37446610-e3f3b.firebasestorage.app",
  messagingSenderId: "216216154216",
  appId: "1:216216154216:web:c6d5ffde5dc4faf13dcbdd"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. स्प्लैश स्क्रीन टाइमर (Fixed Logic)
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                // सुनिश्चित करें कि होम पेज विज़िबल हो
                const home = document.getElementById('home-page');
                if(home) home.classList.remove('hidden');
            }, 800);
        }
    }, 2500);
});

// 3. Chaldean Numerology Values
const chaldeanMap = {
    a:1, i:1, j:1, q:1, y:1, b:2, k:2, r:2,
    c:3, g:3, l:3, s:3, d:4, m:4, t:4,
    e:5, h:5, n:5, x:5, u:6, v:6, w:6,
    o:7, z:7, f:8, p:8
};

// 4. Live Namank Calculation
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

// 5. Auth Logic
let isLoginMode = false;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const authTitle = document.getElementById('auth-title');
    const mobileField = document.getElementById('mobile-group');
    const dobField = document.getElementById('dob-group');
    const toggleText = document.getElementById('toggle-text');

    if (isLoginMode) {
        authTitle.innerText = "लॉगिन (Login)";
        if(mobileField) mobileField.style.display = "none";
        if(dobField) dobField.style.display = "none";
        toggleText.innerText = "अकाउंट बनाना चाहते हैं?";
    } else {
        authTitle.innerText = "पंजीकरण (Register)";
        if(mobileField) mobileField.style.display = "block";
        if(dobField) dobField.style.display = "block";
        toggleText.innerText = "क्या पहले से अकाउंट है?";
    }
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const mobile = document.getElementById('auth-mobile') ? document.getElementById('auth-mobile').value : "";
    const dob = document.getElementById('auth-dob') ? document.getElementById('auth-dob').value : "";

    if (!email || !password) {
        alert("कृपया ईमेल और पासवर्ड भरें।");
        return;
    }

    try {
        if (isLoginMode) {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            alert("सफलतापूर्वक लॉगिन हुआ!");
        } else {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            await db.collection("users").doc(user.uid).set({
                email: email,
                mobile: mobile,
                dob: dob,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("अकाउंट सफलतापूर्वक बन गया!");
        }
        // Auth के बाद पेज बदलें
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('home-page').classList.remove('hidden');
    } catch (error) {
        alert("त्रुटि: " + error.message);
    }
}

// 6. Navigation (Submit Button)
const submitBtn = document.getElementById('submitBtn');
if(submitBtn) {
    submitBtn.addEventListener('click', () => {
        const name = nameInput.value;
        const dobInput = document.getElementById('dob').value;

        if (!name || !dobInput) {
            alert("कृपया नाम और जन्म तिथि दर्ज करें।");
            return;
        }
        // यहाँ Loshu grid call करें
        if(typeof generateLoshuGrid === 'function') generateLoshuGrid(dobInput);
        
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('result-page').classList.remove('hidden');
    });
}
