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
  const works = await fetchWorks(); // récupère tous les projets
  const categories = await fetchCategories(); // récupère les catégories

  if (works && categories) {
    displayWorks(works); // affiche tous les projets au départ
    displayCategories(categories, works); // crée les boutons et active le tri
  }
});