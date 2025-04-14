
let currentUser;
const tabs = document.querySelectorAll(".tab");

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      currentUser = result.user;
      setupUserUI(currentUser);
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
}

function setupUserUI(user) {
  document.getElementById("login-section")?.classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("user-info").innerText = "Hi, " + user.displayName;
  document.getElementById("profile-name").innerText = user.displayName;
  document.getElementById("profile-email").innerText = user.email;
  document.getElementById("profile-pic").src = user.photoURL;
  loadTransactions();
}

function logout() {
  firebase.auth().signOut().then(() => location.reload());
}

function showTab(tabId) {
  tabs.forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

function toggleAddForm() {
  document.getElementById("add-form").classList.toggle("hidden");
}

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amt = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  if (!desc || !amt || !date) return alert("Please fill all fields");

  firebase.firestore().collection("transactions").add({
    uid: currentUser.uid,
    desc, amount: amt, type, category, date,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    toggleAddForm();
  });
}

function loadTransactions() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";
  const transactions = [];
  firebase.firestore().collection("transactions")
    .where("uid", "==", currentUser.uid)
    .orderBy("date", "desc")
    .onSnapshot(snapshot => {
      list.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        transactions.push(data);
        const li = document.createElement("li");
        li.textContent = `${data.date} - ${data.category} - ${data.desc}: $${data.amount}`;
        list.appendChild(li);
      });
      updateCharts(transactions);
    });
}

let pieChart, barChart;
function updateCharts(data) {
  const expenses = {}, days = {};
  data.forEach(t => {
    if (t.type === "expense")
      expenses[t.category] = (expenses[t.category] || 0) + t.amount;
    const d = t.date;
    days[d] = (days[d] || 0) + (t.type === "income" ? t.amount : -t.amount);
  });

  const pieCtx = document.getElementById("pie-chart").getContext("2d");
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: Object.keys(expenses),
      datasets: [{ data: Object.values(expenses), backgroundColor: ["#f44336", "#4caf50", "#2196f3", "#ff9800"] }]
    }
  });

  const barCtx = document.getElementById("bar-chart").getContext("2d");
  if (barChart) barChart.destroy();
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: Object.keys(days),
      datasets: [{ label: "Net", data: Object.values(days), backgroundColor: "#4bc0c0" }]
    }
  });
}

window.loginWithGoogle = loginWithGoogle;
window.addTransaction = addTransaction;
window.showTab = showTab;
window.logout = logout;
window.toggleAddForm = toggleAddForm;

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    setupUserUI(user);
  }
});
