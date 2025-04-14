
// stripe.js - Simulated Stripe Checkout
function startStripeCheckout() {
  alert("Simulated Stripe Checkout (Test Mode)");
  firebase.firestore().collection("users").doc(currentUser.uid).set({ isPro: true }, { merge: true }).then(() => {
    alert("Pro Mode Activated!");
    document.getElementById("download-csv").disabled = false;
  });
}
