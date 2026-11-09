import { mkdirSync, writeFileSync } from "node:fs";

const LOGIN = "hideuu";
const TOKEN = process.env.GH_TOKEN;

const query = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { login: LOGIN } }),
});
const json = await res.json();
if (!res.ok || json.errors) {
  console.error(JSON.stringify(json.errors ?? json, null, 2));
  process.exit(1);
}

const cal = json.data.user.contributionsCollection.contributionCalendar;
const days = cal.weeks.flatMap(w =>
  w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] }))
);

mkdirSync("data", { recursive: true });
writeFileSync("data/contributions.json", JSON.stringify({ total: cal.totalContributions, days }));
console.log(`Saved ${days.length} days, ${cal.totalContributions} contributions`);