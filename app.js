
let currentUser;

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("main-nav").classList.remove("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("user-info").innerHTML = user.displayName;
  } else {
    currentUser = null;
    document.getElementById("login-section").style.display = "block";
    document.getElementById("main-nav").classList.add("hidden");
    document.querySelectorAll('.tab-content').forEach(e => e.classList.add("hidden"));
  }
});

document.getElementById("google-login").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
});

function logout() {
  firebase.auth().signOut();
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(e => e.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");
}

function addTransaction() {
  alert("Transaction added (simulated)");
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

window.addTransaction = addTransaction;