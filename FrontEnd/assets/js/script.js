async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const works = await response.json();
    return works;
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = ""; //  On vide la galerie

  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}



document.addEventListener("DOMContentLoaded", async () => {
  const works = await fetchWorks();
  const categories = await fetchCategories();

  if (works && categories) {
    displayWorks(works);
    displayCategories(categories, works);
  }
    // 🆕 Gestion du bouton Login/Logout
    const loginLink = document.getElementById("login-link");
    const token = localStorage.getItem("token");
  
    if (loginLink) { // On vérifie que le lien existe
      if (token) {
        // L'utilisateur est connecté
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          window.location.href = "index.html"; // Recharge la page d'accueil
        });
      } else {
        // L'utilisateur est déconnecté
        loginLink.textContent = "login";
        loginLink.href = "login.html";
      }
    }


    
    // 🆕 Ajout du bouton "modifier" si l'utilisateur est connecté
  if (token) {
    const portfolioTitle = document.querySelector("#portfolio h2"); // Cible le H2 dans #portfolio

    // Crée le conteneur du bouton (icône + texte)
    const editContainer = document.createElement("span");
    editContainer.classList.add("edit-container");

    // Icône du stylo (FontAwesome)
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-regular", "fa-pen-to-square");

    // Texte "modifier"
    const editText = document.createElement("span");
    editText.textContent = "modifier";

    // Assemble le tout
    editContainer.appendChild(editIcon);
    editContainer.appendChild(editText);

    // Ajoute après le titre "Mes projets"
    portfolioTitle.insertAdjacentElement("afterend", editContainer);
  }
});