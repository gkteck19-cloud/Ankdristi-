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

let isLoginMode = false;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const authTitle = document.getElementById('auth-title');
    const mobileField = document.getElementById('mobile-group');
    const dobField = document.getElementById('dob-group');
    const toggleText = document.getElementById('toggle-text');

    if (isLoginMode) {
        authTitle.innerText = "लॉगिन (Login)";
        mobileField.style.display = "none";
        dobField.style.display = "none";
        toggleText.innerText = "अकाउंट बनाना चाहते हैं?";
    } else {
        authTitle.innerText = "पंजीकरण (Register)";
        mobileField.style.display = "block";
        dobField.style.display = "block";
        toggleText.innerText = "क्या पहले से अकाउंट है?";
    }
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const mobile = document.getElementById('auth-mobile').value;
    const dob = document.getElementById('auth-dob').value;

    if (!email || !password) {
        alert("कृपया ईमेल और पासवर्ड भरें।");
        return;
    }

    try {
        if (isLoginMode) {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            alert("सफलतापूर्वक लॉगिन हुआ!");
        } else {
            // रजिस्ट्रेशन
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Firestore में अतिरिक्त जानकारी सेव करें
            await db.collection("users").doc(user.uid).set({
                email: email,
                mobile: mobile,
                dob: dob,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("अकाउंट सफलतापूर्वक बन गया!");
        }
    } catch (error) {
        alert("त्रुटि: " + error.message);
    }
                                           }

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
// Auth Mode: 'register' or 'login'
let isLoginMode = false;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Login" : "Register";
    document.getElementById('toggle-text').innerText = isLoginMode ? "Need an account?" : "Already have an account?";
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        if (isLoginMode) {
            // Login Logic
            await firebase.auth().signInWithEmailAndPassword(email, password);
            alert("Logged in successfully!");
        } else {
            // Registration Logic
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            alert("Account created successfully!");
        }
        // Auth सफल होने के बाद होम पेज दिखाएँ
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('home-page').classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    }
}

// User की स्थिति पर नज़र रखें (Login है या नहीं)
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // अगर यूजर पहले से लॉगिन है, तो सीधे होम पेज दिखाएँ
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('home-page').classList.remove('hidden');
    } else {
        // लॉगिन नहीं है तो ऑथ पेज दिखाएँ
        document.getElementById('auth-page').classList.remove('hidden');
        document.getElementById('home-page').classList.add('hidden');
    }
});

