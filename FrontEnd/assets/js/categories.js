async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }
  
  function displayCategories(categories, works) {
    const list = document.querySelector("#categories");

    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.classList.add("active"); // "Tous" est sélectionné par défaut au chargement de la page
    buttonAll.addEventListener("click", () => {
      displayWorks(works);
    });
    list.appendChild(buttonAll);
  
    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
    
        button.addEventListener("click", () => {
          const filteredWorks = works.filter(work => work.category.id === category.id);
          displayWorks(filteredWorks);
        });
    
        list.appendChild(button);
      });
  }