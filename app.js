
let currentUser;
const tabs = document.querySelectorAll(".tab");
const themeToggle = document.getElementById("theme-toggle");

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("user-info").innerText = "Hi, " + user.displayName;
    document.getElementById("profile-name").innerText = user.displayName;
    document.getElementById("profile-email").innerText = user.email;
    document.getElementById("profile-pic").src = user.photoURL;
  } else {
    currentUser = null;
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("dashboard").classList.add("hidden");
  }
});

document.getElementById("google-login").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
});

function logout() {
  firebase.auth().signOut();
}

function showTab(tabId) {
  tabs.forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amt = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  if (!desc || !amt || !date) return alert("Please fill all fields");

  const li = document.createElement("li");
  li.innerText = `${date} - ${type} - ${desc}: $${amt}`;
  document.getElementById("transaction-list").appendChild(li);
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function toggleAddForm() {
  document.getElementById("add-form").classList.toggle("hidden");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

window.showTab = showTab;
window.addTransaction = addTransaction;
window.logout = logout;
window.toggleAddForm = toggleAddForm;
