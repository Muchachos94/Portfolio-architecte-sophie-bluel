document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("connexion");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const credentials = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        // Cas où l'authentification a réussi
        const data = await response.json();
        localStorage.setItem("token", data.token); // 🔐 On stocke le token
        console.log("Connexion réussie, redirection...");
        window.location.href = "index.html"; // Redirection vers la page d'accueil
      } else {
        // Cas où l'authentification a échoué (email ou mdp incorrect)
        console.error("Erreur lors de la connexion : Email ou mot de passe incorrect.");
        showError("Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (error) {
      // Cas où une erreur technique survient (ex: serveur non disponible)
      console.error("Erreur technique :", error);
      showError("Une erreur est survenue. Réessayez plus tard.");
    }
  });

  function showError(message) {
    let errorMsg = document.getElementById("error-message");
    const forgotPassword = document.getElementById("forgot-password"); // 🎯 On cible le lien
  
    if (!errorMsg) {
      errorMsg = document.createElement("p");
      errorMsg.id = "error-message";
      errorMsg.classList.add("error-message"); // 🆕 On garde la classe CSS
  
      // 👇 On insère le message d'erreur APRÈS le lien "Mot de passe oublié"
      forgotPassword.after(errorMsg);
    }
    errorMsg.textContent = message;
  }
});