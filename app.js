// app.js
document.getElementById("google-login").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      document.getElementById("user-info").innerHTML = `
        <p>${user.displayName}</p>
        <img src="${user.photoURL}" width="40" style="border-radius:50%;" />
      `;
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
});

document.getElementById("logout").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    location.reload();
  });
});
