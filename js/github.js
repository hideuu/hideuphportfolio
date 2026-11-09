const cal = document.getElementById("gh-calendar");
const meta = document.getElementById("gh-meta");

async function loadContributions() {
  const res = await fetch("data/contributions.json");
  const { total, days } = await res.json();

  // Align the first contribution date with its weekday.
  const pad = new Date(days[0].date + "T00:00:00").getDay();
  for (let i = 0; i < pad; i++) {
    cal.insertAdjacentHTML("beforeend", '<i class="day is-empty"></i>');
  }

  days.forEach((d) => {
    const cell = document.createElement("i");
    cell.className = `day lvl-${d.level}`;
    cell.title = `${d.count} contributions on ${d.date}`;
    cal.appendChild(cell);
  });

  // Show the latest weeks when the calendar overflows.
  cal.scrollLeft = cal.scrollWidth;

  meta.textContent = `@hideuu · ${total} contributions in the last year`;
}

loadContributions().catch(console.error);