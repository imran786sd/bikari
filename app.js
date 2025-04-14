// app.js
let currentUser = null;
const transactionList = document.getElementById("transaction-list");

document.getElementById("google-login").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      currentUser = result.user;
      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      document.getElementById("user-info").innerHTML = `
        <p>${currentUser.displayName}</p>
        <img src="${currentUser.photoURL}" width="40" style="border-radius:50%;" />
      `;
      loadTransactions();
      setupProfile(currentUser);
      showTab("dashboard");
    })
    .catch(error => alert("Login failed: " + error.message));
});

document.getElementById("logout").addEventListener("click", () => {
  firebase.auth().signOut().then(() => location.reload());
});

document.getElementById("transaction-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  if (!desc || !amount || !date) return alert("Please fill all fields");

  await firebase.firestore().collection("transactions").add({
    uid: currentUser.uid,
    desc, amount, type,
    date: new Date(date)
  });

  document.getElementById("transaction-form").reset();
  loadTransactions();
      setupProfile(currentUser);
      showTab("dashboard");
});

async function loadTransactions() {
  const snapshot = await firebase.firestore().collection("transactions")
    .where("uid", "==", currentUser.uid).get();

  const data = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });

  displayTransactions(data);
  drawCharts(data);
}

function displayTransactions(transactions) {
  transactionList.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.date.toDate().toDateString()} - ${t.desc}: $${t.amount}`;
    transactionList.appendChild(li);
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income-total").textContent = income.toFixed(2);
  document.getElementById("expense-total").textContent = expense.toFixed(2);
  document.getElementById("balance").textContent = (income - expense).toFixed(2);
}

function drawCharts(transactions) {
  // Placeholder for bar and pie charts
  // Chart.js logic can go here next
}


let barChart, pieChart;

function drawCharts(transactions) {
  const ctxBar = document.getElementById("bar-chart").getContext("2d");
  const ctxPie = document.getElementById("pie-chart").getContext("2d");

  const incomeData = {};
  const expenseData = {};

  transactions.forEach(t => {
    const date = new Date(t.date.seconds * 1000).toLocaleDateString();
    const target = t.type === "income" ? incomeData : expenseData;
    target[date] = (target[date] || 0) + t.amount;
  });

  const labels = Array.from(new Set([...Object.keys(incomeData), ...Object.keys(expenseData)])).sort();

  const incomeValues = labels.map(label => incomeData[label] || 0);
  const expenseValues = labels.map(label => expenseData[label] || 0);

  if (barChart) barChart.destroy();
  barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeValues,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        },
        {
          label: "Expense",
          data: expenseValues,
          backgroundColor: "rgba(255, 99, 132, 0.6)"
        }
      ]
    }
  });

  const categoryTotals = {};
  transactions.forEach(t => {
    const key = t.type;
    categoryTotals[key] = (categoryTotals[key] || 0) + t.amount;
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ["#4bc0c0", "#ff6384"]
      }]
    }
  });
}


// Tab switching
document.getElementById("tab-dashboard").addEventListener("click", () => {
  showTab("dashboard");
});
document.getElementById("tab-profile").addEventListener("click", () => {
  showTab("profile");
});

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

function setupProfile(user) {
  document.getElementById("profile-name").textContent = user.displayName;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-pic").src = user.photoURL;
}

function exportToCSV(transactions) {
  let csv = "Date,Description,Amount,Type\n";
  transactions.forEach(t => {
    const date = new Date(t.date.seconds * 1000).toLocaleDateString();
    csv += `${date},${t.desc},${t.amount},${t.type}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bikari_transactions.csv";
  link.click();
}

document.getElementById("download-csv").addEventListener("click", () => {
  firebase.firestore().collection("transactions")
    .where("uid", "==", currentUser.uid)
    .get()
    .then(snapshot => {
      const data = [];
      snapshot.forEach(doc => data.push(doc.data()));
      exportToCSV(data);
    });
});

// Activate dashboard tab by default on login
document.addEventListener("DOMContentLoaded", () => {
  showTab("dashboard");
});

document.getElementById("time-filter").addEventListener("change", () => {
  loadTransactions();
      setupProfile(currentUser);
      showTab("dashboard");
});

function filterTransactions(transactions) {
  const filter = document.getElementById("time-filter").value;
  const now = new Date();

  return transactions.filter(t => {
    const d = new Date(t.date.seconds * 1000);

    if (filter === "day") {
      return d.toDateString() === now.toDateString();
    } else if (filter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return d >= startOfWeek && d <= endOfWeek;
    } else if (filter === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (filter === "year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

async function loadTransactions() {
  const snapshot = await firebase.firestore().collection("transactions")
    .where("uid", "==", currentUser.uid).get();

  const data = [];
  snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));

  const filtered = filterTransactions(data);
  displayTransactions(filtered);
  drawCharts(filtered);
}


let isProUser = false;

function setupProfile(user) {
  document.getElementById("profile-name").textContent = user.displayName;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-pic").src = user.photoURL;

  const userDocRef = firebase.firestore().collection("users").doc(user.uid);
  userDocRef.get().then(doc => {
    if (doc.exists && doc.data().isPro) {
      isProUser = true;
      document.getElementById("download-csv").disabled = false;
      document.getElementById("download-csv").title = "";
    } else {
      isProUser = false;
      document.getElementById("download-csv").disabled = true;
      document.getElementById("download-csv").title = "Upgrade to Pro to unlock this feature";
    }
  });

  document.getElementById("pro-upgrade").addEventListener("click", () => {
    userDocRef.set({ isPro: true }, { merge: true }).then(() => {
      alert("Pro Mode Activated!");
      isProUser = true;
      document.getElementById("download-csv").disabled = false;
      document.getElementById("download-csv").title = "";
    });
  });
};

// import and call startStripeCheckout from stripe.js