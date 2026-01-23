// --- MODAL ---

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
            `<a href="${link.url}" class="btn btn-primary m-1" target="_blank">${link.text}</a>`,
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
        const categories = item.getAttribute("data-category").split(" ");

        if (filter === "all" || categories.includes(filter)) {
          item.classList.remove("d-none");
        } else {
          item.classList.add("d-none");
        }
      });
    });
  });
});

// // Nav dot highlight for active section

// const sections = document.querySelectorAll("section");
// const navLinks = document.querySelectorAll(".navi-link");

// const observer = new IntersectionObserver(
//   entries => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         navLinks.forEach(link => {
//           link.classList.toggle(
//             "active-nav",
//             link.getAttribute("href") === `#${entry.target.id}`
//           );
//         });
//       }
//     });
//   },
//   {
//     threshold: 0.6, // section is "active" when 60% visible
//   }
// );

// sections.forEach(section => observer.observe(section));

// Nav dot highlight for active section
const navLinks = document.querySelectorAll(".navi-link");

const observerOptions = {
  root: null,
  // This creates a narrow 'detective' strip across the middle of the screen
  rootMargin: "-40% 0px -40% 0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active-nav",
          link.getAttribute("href") === `#${id}`,
        );
      });
    }
  });
}, observerOptions);

// Track only the elements that have an ID matching your nav links
navLinks.forEach((link) => {
  const targetId = link.getAttribute("href").substring(1);
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    observer.observe(targetSection);
  }
});
// <!-- Background Pill Slider for Filter -->

const buttons = document.querySelectorAll(".filter-btn");
const indicator = document.querySelector(".filter-indicator");

function moveIndicator(btn) {
  const ul = btn.closest("ul");

  const btnRect = btn.getBoundingClientRect();
  const ulRect = ul.getBoundingClientRect();

  const left = btnRect.left - ulRect.left - ul.clientLeft;
  const width = btnRect.width;

  indicator.style.left = `${left}px`;
  indicator.style.width = `${width}px`;
}

// position indicator on load
const activeBtn = document.querySelector(".filter-btn.active");
moveIndicator(activeBtn);

// move on click
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    moveIndicator(btn);
  });
});


// <!-- Current Year Script -->

const year = new Date().getFullYear();
document.getElementById("copyright").innerHTML =
  `This website was designed and coded by Dan Finley &copy; ${year}`;
