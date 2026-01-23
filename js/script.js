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

// GITHUB HEATMAP

document.addEventListener("DOMContentLoaded", async () => {
  const heatmapSvg = document.querySelector(".calendar");
  const legendSvg = document.querySelector(".legend-svg");
  const USERNAME = "dannyjive";

  if (!heatmapSvg) return;

  if (!window.GITHUB_TOKEN) {
    heatmapSvg.innerHTML = `<text x="0" y="20" fill="white">Token Missing</text>`;
    return;
  }

  const query = `query {
    user(login: "${USERNAME}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const responseData = await res.json();
    const calendarData =
      responseData.data.user.contributionsCollection.contributionCalendar;
    const weeks = calendarData.weeks;
    const days = weeks.flatMap((week) => week.contributionDays);

    const svgNS = "http://www.w3.org/2000/svg";
    const squareSize = 11;
    const spacing = 3;
    const monthHeaderHeight = 20; // Extra space for Jan, Feb, etc.

    const totalWeeks = weeks.length;
    const viewWidth = totalWeeks * (squareSize + spacing);
    const viewHeight = 7 * (squareSize + spacing) + monthHeaderHeight;

    heatmapSvg.setAttribute("viewBox", `0 0 ${viewWidth} ${viewHeight}`);
    heatmapSvg.innerHTML = "";

    // --- Render Month Labels ---
    let currentMonth = -1;
    weeks.forEach((week, i) => {
      const firstDayInWeek = new Date(week.contributionDays[0].date);
      const month = firstDayInWeek.getMonth();

      if (month !== currentMonth) {
        const monthLabel = document.createElementNS(svgNS, "text");
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        monthLabel.setAttribute("x", i * (squareSize + spacing));
        monthLabel.setAttribute("y", 12); // Position above the squares
        monthLabel.setAttribute("fill", "#8b949e");
        monthLabel.style.fontSize = "9px";
        monthLabel.style.fontFamily = "sans-serif";
        monthLabel.textContent = monthNames[month];

        heatmapSvg.appendChild(monthLabel);
        currentMonth = month;
      }
    });

    // --- Render Heatmap Squares ---
    days.forEach((day, i) => {
      const rect = document.createElementNS(svgNS, "rect");
      const col = Math.floor(i / 7);
      const row = i % 7;

      rect.setAttribute("x", col * (squareSize + spacing));
      // Shift squares down to make room for labels
      rect.setAttribute("y", row * (squareSize + spacing) + monthHeaderHeight);
      rect.setAttribute("width", squareSize);
      rect.setAttribute("height", squareSize);
      rect.setAttribute("rx", 2);
      rect.setAttribute("data-level", getLevel(day.contributionCount));

      const title = document.createElementNS(svgNS, "title");
      title.textContent = `${day.contributionCount} contributions on ${day.date}`;
      rect.appendChild(title);

      heatmapSvg.appendChild(rect);
    });

    // --- Render Legend ---
    if (legendSvg) {
      legendSvg.innerHTML = "";
      legendSvg.setAttribute(
        "viewBox",
        `0 0 ${5 * (squareSize + spacing)} ${squareSize}`,
      );
      for (let i = 0; i < 5; i++) {
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", i * (squareSize + spacing));
        rect.setAttribute("y", 0);
        rect.setAttribute("width", squareSize);
        rect.setAttribute("height", squareSize);
        rect.setAttribute("rx", 2);
        rect.setAttribute("data-level", i.toString());
        legendSvg.appendChild(rect);
      }
    }
  } catch (err) {
    console.error(err);
    heatmapSvg.innerHTML = `<text x="0" y="20" fill="white">Error loading heatmap</text>`;
  }
});

function getLevel(count) {
  if (count === 0) return "0";
  if (count < 3) return "1";
  if (count < 6) return "2";
  if (count < 10) return "3";
  return "4";
}

// <!-- Current Year Script -->

const year = new Date().getFullYear();
document.getElementById("copyright").innerHTML =
  `This website was designed and coded by Dan Finley &copy; ${year}`;
