// 1. Firebase Imports (Modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// आपका नया कॉन्फ़िगरेशन
const firebaseConfig = {
  apiKey: "AIzaSyDKBVzKZqyqNE9PJRHfPPrbG85eX9tUFj0",
  authDomain: "ankdristi.firebaseapp.com",
  projectId: "ankdristi",
  storageBucket: "ankdristi.firebasestorage.app",
  messagingSenderId: "751636757575",
  appId: "1:751636757575:web:6b15c6df18e04ed01b8562",
  measurementId: "G-DPJ3CL8XED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 2. Splash Screen & Auth Status
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                checkUserStatus();
            }, 800);
        }
    }, 2500);
});

function checkUserStatus() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('home-page').classList.remove('hidden');
            document.getElementById('auth-page').classList.add('hidden');
        } else {
            document.getElementById('home-page').classList.remove('hidden');
        }
    });
}

// 3. Chaldean Numerology Logic
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

// 4. Loshu Grid Logic
window.generateLoshuGrid = function(dob) {
    const digits = dob.replace(/\D/g, '').split('');
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

// 5. Auth Functions (Global scope के लिए window का इस्तेमाल)
window.toggleAuthMode = function() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "लॉगिन (Login)" : "पंजीकरण (Register)";
    document.getElementById('mobile-group').style.display = isLoginMode ? "none" : "block";
    document.getElementById('dob-group').style.display = isLoginMode ? "none" : "block";
};

window.handleAuth = async function() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    
    if (!email || !password) {
        alert("ईमेल और पासवर्ड आवश्यक हैं।");
        return;
    }

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const mobile = document.getElementById('auth-mobile').value;
            const dob = document.getElementById('auth-dob').value;
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCred.user.uid), {
                email, mobile, dob, createdAt: serverTimestamp()
            });
        }
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('home-page').classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    }
};

// 6. Navigation
const submitBtn = document.getElementById('submitBtn');
if(submitBtn) {
    submitBtn.addEventListener('click', () => {
        const name = nameInput.value;
        const dobVal = document.getElementById('dob').value;
        if (!name || !dobVal) { alert("विवरण भरें"); return; }
        
        generateLoshuGrid(dobVal);
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('result-page').classList.remove('hidden');
    });
}
