        <!-- Modal -->
 
      document.addEventListener("DOMContentLoaded", function () {
        const modalImage = document.getElementById("modalImage");
        const modalTitle = document.getElementById("infoModalLabel");
        const modalDescription = document.getElementById("modalDescription");
        const modalLinks = document.getElementById("modalLinks");

        document.querySelectorAll(".open-modal").forEach((thumbnail) => {
          thumbnail.addEventListener("click", function () {
            modalImage.src = this.dataset.img;
            modalImage.alt = this.alt;
            modalTitle.textContent = this.dataset.title;
            modalDescription.textContent = this.dataset.description;

            // Generate links
            const links = JSON.parse(this.dataset.links);
            modalLinks.innerHTML = links
              .map(
                (link) =>
                  `<a href="${link.url}" class="btn btn-primary m-1" target="_blank">${link.text}</a>`
              )
              .join("");
          });
        });
      });
     
     //Filter Buttons
      document.addEventListener("DOMContentLoaded", function () {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const filterItems = document.querySelectorAll(".filter-item");

        filterButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");

            // Change active button styling
            filterButtons.forEach((btn) => {
              btn.classList.remove("active");
              btn.classList.add("inactive");
            });

            this.classList.add("active");

            // Show/Hide items based on filter
            filterItems.forEach((item) => {
              const categories = item.getAttribute("data-category").split(" "); // Split categories into array

              if (filter === "all" || categories.includes(filter)) {
                item.style.display = "block"; // Show matching items
              } else {
                item.style.display = "none"; // Hide non-matching items
              }
            });
          });
        });
      });