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

// Nav dot highlight for active section

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navi-link");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active-nav",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  {
    threshold: 0.6, // section is "active" when 60% visible
  }
);

sections.forEach(section => observer.observe(section));

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
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    moveIndicator(btn);
  });
});

// <!-- GitHub Heatmap Fetch User -->

document.addEventListener("DOMContentLoaded", function () {
  // 1. Create a style tag and inject it into the head
  const style = document.createElement('style');
  style.innerHTML = `
    .calendar text, .calendar .month, .calendar .wday {
      fill: white !important;
      font-family: 'Courier Prime', monospace !important;
    }
    .calendar rect[data-level="0"] {
      fill: #2d2d2d !important;
    }
    .calendar rect[data-level="1"] { fill: #c6e48b !important; }
    .calendar rect[data-level="2"] { fill: #7bc96f !important; }
    .calendar rect[data-level="3"] { fill: #239a3b !important; }
    .calendar rect[data-level="4"] { fill: purple !important; }
    .calendar svg { width: 100% !important; height: auto !important; }
  `;
  document.head.appendChild(style);

  // 2. Initialize the Calendar
  GitHubCalendar(".calendar", "dannyjive", {
    responsive: true,
    global_stats: false,
    proxy(username) {
      return fetch(`https://api.blogg.li/github/${username}`)
        .then(res => res.text());
    }
  }).then(() => {
    console.log("Heatmap loaded!");
  });
});


// <!-- Current Year Script -->

const year = new Date().getFullYear();
document.getElementById(
  "copyright"
).innerHTML = `This website was designed and coded by Dan Finley &copy; ${year}`;
