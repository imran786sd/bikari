
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
      updateCharts(transactions);

document.getElementById("google-login").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
});
      updateCharts(transactions);

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
  const category = document.getElementById("category").value;
  date = document.getElementById("date").value;
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
      updateCharts(transactions);

window.showTab = showTab;
window.addTransaction = addTransaction;
window.logout = logout;
window.toggleAddForm = toggleAddForm;

function loadTransactions() {
  firebase.firestore().collection("transactions")
    .where("uid", "==", currentUser.uid)
    .orderBy("date", "desc")
    .onSnapshot(snapshot => {
      const list = document.getElementById("transaction-list");
      list.innerHTML = "";
      const transactions = [];
      const transactions = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.date} - ${data.type} - ${data.desc}: $${data.amount}`;
        list.appendChild(li);
      transactions.push(data);
      });
      updateCharts(transactions);
    });
      updateCharts(transactions);
}

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amt = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  date = document.getElementById("date").value;
  if (!desc || !amt || !date) return alert("Please fill all fields");

  firebase.firestore().collection("transactions").add({
    uid: currentUser.uid,
    desc: desc,
    amount: amt,
    type: type,
    category: category,
    date: date,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    toggleAddForm();
  });
      updateCharts(transactions);
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("user-info").innerText = "Hi, " + user.displayName;
    document.getElementById("profile-name").innerText = user.displayName;
    document.getElementById("profile-email").innerText = user.email;
    document.getElementById("profile-pic").src = user.photoURL;
    loadTransactions();
  }
});
      updateCharts(transactions);

let pieChart, barChart;

function updateCharts(transactions) {
  const expenseData = {};
  const dailyTotals = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      expenseData[t.category] = (expenseData[t.category] || 0) + t.amount;
    }

    const day = t.date;
    dailyTotals[day] = (dailyTotals[day] || 0) + (t.type === "income" ? t.amount : -t.amount);
  });

  // Pie Chart
  const pieCtx = document.getElementById("pie-chart").getContext("2d");
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: Object.keys(expenseData),
      datasets: [{
        data: Object.values(expenseData),
        backgroundColor: ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#9c27b0"]
      }]
    }
  });

  // Bar Chart
  const barCtx = document.getElementById("bar-chart").getContext("2d");
  if (barChart) barChart.destroy();
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: Object.keys(dailyTotals),
      datasets: [{
        label: "Net Total",
        data: Object.values(dailyTotals),
        backgroundColor: "#4bc0c0"
      }]
    }
  });
}

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log("Signed in:", result.user.displayName);
    })
    .catch(error => {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    });
}

window.loginWithGoogle = loginWithGoogle;
window.showTab = showTab;
window.addTransaction = addTransaction;
window.logout = logout;
window.toggleAddForm = toggleAddForm;
