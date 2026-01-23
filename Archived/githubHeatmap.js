
//Removed from site because the github token was a pain to deal with for security purposes. If you want to use it you'll have to have a secure server host the token.

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