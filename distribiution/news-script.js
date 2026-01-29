function formatNewsDate(dmy) {
  const [d, m, y] = (dmy || "").split("/");
  if (!y) return "";
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(date);
}

(async function () {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 0;

  const listRes = await fetch("newsInformation.json");
  if (!listRes.ok) {
    document.getElementById("news-content").innerHTML = "<p class=\"error-message\">News not found.</p>";
    return;
  }
  const list = await listRes.json();
  const item = list[id];
  if (!item) {
    document.getElementById("news-content").innerHTML = "<p class=\"error-message\">News not found.</p>";
    return;
  }

  document.title = `${item.title} — Cangjie UK Team`;
  document.getElementById("news-title").textContent = item.title;

  const dateEl = document.getElementById("news-date");
  if (dateEl && item.date) {
    const [d, m, y] = item.date.split("/");
    dateEl.textContent = formatNewsDate(item.date);
    dateEl.setAttribute("datetime", y && m && d ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : "");
  }

  try {
    const contentRes = await fetch(`newsHTML/${item.name}.html`);
    if (!contentRes.ok) throw new Error("Content not found");
    let html = await contentRes.text();
    // Remove first h1 to avoid duplicate title (title already shown in news-article-header)
    const div = document.createElement("div");
    div.innerHTML = html;
    const firstH1 = div.querySelector("h1");
    if (firstH1) firstH1.remove();
    html = div.innerHTML;
    document.getElementById("news-content").innerHTML = html;
  } catch (e) {
    document.getElementById("news-content").innerHTML = "<p class=\"error-message\">Could not load content. Run <code>npm run build-blogs</code> to generate HTML from markdown.</p>";
  }
})();
