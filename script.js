     //Filter Buttons
      document.addEventListener("DOMContentLoaded", function () {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const filterItems = document.querySelectorAll(".filter-item");

        filterButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");

            // Change active button styling
            filterButtons.forEach((btn) => {
              btn.classList.remove("btn-active");
              btn.classList.add("btn-inactive");
            });

            this.classList.add("btn-active");

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