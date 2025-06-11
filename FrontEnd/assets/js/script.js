let works = [];

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const works = await response.json();
    return works;
  } 
  catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

function displayWorks(works , emplacement , canDelete = false) {
  const gallery = document.querySelector("."+emplacement);

  gallery.innerHTML = ""; //  On vide la galerie

  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    caption.textContent = work.title;

    if (canDelete) {
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can", "delete-icon");

      trash.addEventListener("click", async () => {
        const token = localStorage.getItem("token");

        try {
          const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.ok) {
            // Mise à jour de la liste locale
            works = works.filter(w => w.id !== work.id);

            // Mise à jour dynamique des galeries
            displayWorks(works, "gallery");
            displayWorks(works, "modal-gallery", true);
          } else {
            throw new Error("Échec de la suppression");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });

      figure.appendChild(trash);
    }

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  works = await fetchWorks();
  const categories = await fetchCategories();

  if (works) {
    displayWorks(works , "gallery");
  }
  const token = localStorage.getItem("token");
  if (!token && categories) {
    displayCategories(categories, works);
  }

    const loginLink = document.getElementById("login-link");  
    if (loginLink) {
      if (token) {
        // L'utilisateur est connecté
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          window.location.href = "index.html";
        });
      } else {
        // L'utilisateur est déconnecté
        loginLink.textContent = "login";
        loginLink.href = "login.html";
      }
    }
  
    //  Ajout du bouton "modifier" si l'utilisateur est connecté
  if (token) {

    const editContainer =document.getElementById("edit-container-js");
    editContainer.classList.add("d-block");
    editContainer.classList.remove("d-none");


    const portfolioHeader = document.querySelector(".portfolio-header");

    if (token && portfolioHeader) {
      portfolioHeader.classList.add("logged-in");
    }
    

    const editBanner = document.getElementById("edit-banner-js");
    editBanner.classList.add("d-block");
    editBanner.classList.remove("d-none");


    // Ajout des gestionnaires de clic pour ouvrir la modale
    editContainer.addEventListener("click", openModal);
    editBanner.addEventListener("click", openModal);
  
  }

  const modalOverlay = document.querySelector(".modal-overlay");
  const modalClose = document.querySelector(".modal-close");
  
  // Fonction pour ouvrir la modale
  function openModal() {
    modalOverlay.classList.remove("d-none");
    document.body.classList.add("modal-open");
  }
  
  // Fonction pour fermer la modale
  function closeModal() {
    modalOverlay.classList.add("d-none");
    document.body.classList.remove("modal-open");
  }
  
  // Gestionnaires d'événements
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });


  displayWorks (works, "modal-gallery" , true);

  const addPhotoBtn = document.getElementById("add-photo-btn");
  const galleryView = document.querySelector(".modal-gallery-view");
  const addPhotoView = document.querySelector(".modal-add-photo");
  const returnBtn = document.getElementById("return-to-gallery");
  
  if (addPhotoBtn && galleryView && addPhotoView && returnBtn) {
    // Clique sur "Ajouter une photo"
    addPhotoBtn.addEventListener("click", () => {
      galleryView.classList.add("d-none");
      addPhotoView.classList.remove("d-none");
    });
  
    // Clique sur la flèche retour
    returnBtn.addEventListener("click", () => {
      addPhotoView.classList.add("d-none");
      galleryView.classList.remove("d-none");

      // Réinitialisation du formulaire d’ajout
      imageInput.value = "";
      previewImage.src = "";
      previewImage.classList.add("d-none");
      uploadIcon.classList.remove("d-none");
      uploadLabel.classList.remove("d-none");
      uploadInfo.classList.remove("d-none");

      // Réinitialisation du bouton Valider
      validateBtn.classList.add("inactive");
      validateBtn.disabled = false;
    });


    // Gestion du menu déroulant custom des catégories
    const customSelect = document.getElementById("category-select");
    const selectTrigger = customSelect ? customSelect.querySelector(".select-trigger") : null;
    const optionsContainer = document.getElementById("category-options");
    const selectedCategory = customSelect ? customSelect.querySelector(".selected") : null;

    if (categories && optionsContainer && selectedCategory) {
      categories.forEach(category => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("custom-option");
        optionDiv.dataset.id = category.id;
        optionDiv.textContent = category.name;

        optionDiv.addEventListener("click", () => {
          selectedCategory.textContent = category.name;
          optionsContainer.classList.add("d-none");
          customSelect.dataset.selectedId = category.id;
        });

        optionsContainer.appendChild(optionDiv);
      });

      if (selectTrigger) {
        selectTrigger.addEventListener("click", () => {
          optionsContainer.classList.toggle("d-none");
        });
      }
    }
    const imageInput = document.getElementById("image-upload");
    const titleInput = document.getElementById("title");
    const validateBtn = document.getElementById("validate-photo-btn");

    // Fonction pour activer/désactiver le bouton "Valider"
    function updateValidateButton() {
      const hasImage = imageInput.files.length > 0;
      const hasTitle = titleInput.value.trim() !== "";
      const hasCategory = customSelect.dataset.selectedId !== undefined;

      if (hasImage && hasTitle && hasCategory) {
        validateBtn.classList.remove("inactive");
        validateBtn.disabled = false;
      } else {
        validateBtn.classList.add("inactive");
        validateBtn.disabled = false;
      }
      // Ajout du bloc pour masquer le message d'erreur si le bouton devient actif
      const errorMessage = document.getElementById("form-error-message");
      if (!validateBtn.classList.contains("inactive") && errorMessage) {
        errorMessage.classList.add("d-none");
      }
    }

    // Appliquer les listeners sur chaque champ du formulaire
    imageInput.addEventListener("change", updateValidateButton);
    titleInput.addEventListener("input", updateValidateButton);
    optionsContainer.querySelectorAll(".custom-option").forEach(option => {
      option.addEventListener("click", updateValidateButton);
    });

    // Initialiser l'état du bouton "Valider"
    validateBtn.classList.add("inactive");
    validateBtn.disabled = false;

    // Prévisualisation de l’image
    const previewImage = document.getElementById("preview-image");
    const uploadIcon = document.querySelector(".upload-placeholder-icon");
    const uploadLabel = document.querySelector(".upload-label");
    const uploadZone = document.querySelector(".upload-zone");
    const uploadInfo = uploadZone.querySelector("p");

    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          previewImage.classList.remove("d-none");
          uploadIcon.classList.add("d-none");
          uploadLabel.classList.add("d-none");
          uploadInfo.classList.add("d-none");
        };
        reader.readAsDataURL(file);
      }
    });

    validateBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      // Vérification des champs requis
      const hasImage = imageInput.files.length > 0;
      const hasTitle = titleInput.value.trim() !== "";
      const hasCategory = customSelect.dataset.selectedId !== undefined;

      const errorMessage = document.getElementById("form-error-message");
      if (!hasImage || !hasTitle || !hasCategory) {
        if (errorMessage) {
          errorMessage.classList.remove("d-none");
        }
        return;
      } else {
        if (errorMessage) {
          errorMessage.classList.add("d-none");
        }
      }

      const formData = new FormData();
      formData.append("image", imageInput.files[0]);
      formData.append("title", titleInput.value);
      formData.append("category", parseInt(customSelect.dataset.selectedId, 10));

      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout du projet");
        }

        const newWork = await response.json();

        works.push(newWork);
        displayWorks(works, "gallery");
        displayWorks(works, "modal-gallery", true);

        addPhotoView.classList.add("d-none");
        galleryView.classList.remove("d-none");
        modalOverlay.classList.add("d-none");
        document.body.classList.remove("modal-open");

        imageInput.value = "";
        titleInput.value = "";
        customSelect.querySelector(".selected").textContent = "";
        customSelect.removeAttribute("data-selected-id");
        previewImage.src = "";
        previewImage.classList.add("d-none");
        uploadIcon.classList.remove("d-none");
        uploadLabel.classList.remove("d-none");
        uploadInfo.classList.remove("d-none");

        validateBtn.classList.add("inactive");
        validateBtn.disabled = false;
      } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de l'ajout du projet.");
      }
    });
  }
  

});