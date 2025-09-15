// script.js — debug-friendly Firebase Auth logic (modular SDK v12.x)
console.log("script.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// --- Firebase config: ensure storageBucket is .appspot.com ---
const firebaseConfig = {
  apiKey: "AIzaSyCK4kY6WtC9awbhJ5NSKY_nTXubVQ0WZ0U",
  authDomain: "flashtickets-bce18.firebaseapp.com",
  projectId: "flashtickets-bce18",
  storageBucket: "flashtickets-bce18.appspot.com",
  messagingSenderId: "393195469271",
  appId: "1:393195469271:web:cd18270c4f5d71e5983392",
  measurementId: "G-C89H23X7YS"
};

function el(id){ return document.getElementById(id); }
function showStatus(msg, isError=false){
  const s = el("statusMsg");
  if(!s) return;
  s.textContent = msg;
  s.style.color = isError ? "#b00020" : "#136f63";
  console.log("STATUS:", msg);
}

let auth;
try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("Firebase initialized for project:", firebaseConfig.projectId);
} catch(err) {
  console.error("Firebase init error:", err);
  showStatus("Firebase initialization failed: " + err.message, true);
}

// DOM
const signInBtn = el("signInBtn");
const signUpBtn = el("signUpBtn");
const authForm = el("authForm");

console.log("DOM nodes:", { signInBtn, signUpBtn, authForm });

// Safety checks
if (!auth) {
  console.error("Auth object not created. Aborting listeners.");
  showStatus("Auth not ready. Check firebase config.", true);
}

// Sign Up
if (signUpBtn) {
  signUpBtn.addEventListener("click", async () => {
    console.log("Sign Up clicked");
    const email = (el("email")?.value || "").trim();
    const pw = (el("password")?.value || "");
    if (!email || !pw) { showStatus("Please enter email and password.", true); return; }
    if (pw.length < 6) { showStatus("Password must be at least 6 characters.", true); return; }

    showStatus("Creating account...");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pw);
      console.log("createUserWithEmailAndPassword ->", userCred);
      await sendEmailVerification(userCred.user);
      showStatus("Account created — verification email sent. Check your inbox.");
      await signOut(auth); // force verify on next sign-in
      console.log("Signed out after signup to await verification.");
    } catch(err) {
      console.error("Sign Up error:", err);
      showStatus(`Sign Up error (${err.code}): ${err.message}`, true);
    }
  });
} else {
  console.warn("signUpBtn not found in DOM");
}

// Sign In (form submit)
if (authForm) {
  authForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    console.log("Sign In form submitted");
    const email = (el("email")?.value || "").trim();
    const pw = (el("password")?.value || "");
    if (!email || !pw) { showStatus("Please enter email and password.", true); return; }

    showStatus("Signing in...");
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pw);
      console.log("signInWithEmailAndPassword ->", userCred);
      if (userCred.user.emailVerified) {
        showStatus("Signed in — redirecting...");
        setTimeout(() => window.location.href = "index.html", 800);
      } else {
        showStatus("Please verify your email first. Check your inbox.", true);
        await signOut(auth);
      }
    } catch(err) {
      console.error("Sign In error:", err);
      showStatus(`Sign In error (${err.code}): ${err.message}`, true);
    }
  });
} else {
  console.warn("authForm not found in DOM");
}

// Monitor auth state
onAuthStateChanged(auth, user => {
  console.log("onAuthStateChanged:", user);
  // you can update navbar or show user info here if needed
});

// Expose a debug helper you can run in Console
window._ft_debug = {
  firebaseConfig,
  test: () => console.log("firebaseConfig:", firebaseConfig)
};
