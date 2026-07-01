let content;

const byId = (id) => document.getElementById(id);
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[char]));

function sortNewestFirst(items) {
  const yearValue = (item) => {
    const match = String(item.year || "").match(/\d{4}/);
    return match ? Number(match[0]) : 0;
  };
  return [...items].sort((a, b) => yearValue(b) - yearValue(a));
}

function renderProfile() {
  byId("profile-name").textContent = content.profile.name;
  byId("footer-name").textContent = content.profile.name;
  byId("profile-intro").textContent = content.profile.intro;
  byId("about-text").textContent = content.profile.about;
  byId("email-link").href = `mailto:${content.profile.email}`;
  byId("profile-photo").src = content.profile.photo;
  byId("profile-photo").alt = `${content.profile.name} 的个人照片`;
  byId("profile-meta").innerHTML = [content.profile.location, content.profile.focus]
    .map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  document.title = `${content.profile.name} · 个人主页`;
  byId("profile-links").innerHTML = content.profileLinks.map((link) => link.url ? `
    <a class="profile-link" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
      <span>${escapeHtml(link.name)}</span><span aria-hidden="true">↗</span>
    </a>
  ` : `<span class="profile-link pending"><span>${escapeHtml(link.name)}</span><small>链接待补充</small></span>`).join("");
}

function renderProjects() {
  byId("project-list").innerHTML = content.projects.map((project, index) => `
    <article class="project-card">
      <div>
        <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
      </div>
      <div>${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </article>
  `).join("");
}

function previewButton(title, image) {
  return `<button class="preview-button" data-preview-title="${escapeHtml(title)}" data-preview-image="${escapeHtml(image)}">${escapeHtml(title)}</button>`;
}

function renderTimeline(target, items) {
  byId(target).innerHTML = items.map((item) => `
    <article class="timeline-item">
      <span class="timeline-date">${escapeHtml(item.period)}</span>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.organization)} · ${escapeHtml(item.description)}</p></div>
    </article>
  `).join("");
}

function renderResearch(filter = "全部") {
  const filteredItems = filter === "全部" ? content.research : content.research.filter((item) => item.type === filter);
  const items = sortNewestFirst(filteredItems);
  byId("research-list").innerHTML = items.map((item) => `
    <article class="publication">
      <span class="publication-year">${escapeHtml(item.year)}</span>
      <div>
        ${previewButton(item.title, item.preview)}
        <p class="publication-meta"><span class="result-type">${escapeHtml(item.type)}</span> ${escapeHtml(item.authors)} · ${escapeHtml(item.venue)}</p>
      </div>
      ${item.link ? `<a class="external-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">外部链接 ↗</a>` : ""}
    </article>
  `).join("");
}

function renderResearchFilters() {
  const filters = ["全部", "论文", "会议", "专利", "软件著作权"];
  const countFor = (filter) => filter === "全部"
    ? content.research.length
    : content.research.filter((item) => item.type === filter).length;
  byId("research-filters").innerHTML = filters.map((filter, index) => `
    <button class="filter-button${index === 0 ? " active" : ""}" data-research-filter="${filter}">
      ${filter}<span class="count-badge">${countFor(filter)}</span>
    </button>
  `).join("");
}

function renderHonorGroup(targetId, countId, type) {
  const items = content.honors.filter((item) => item.type === type);
  byId(countId).textContent = items.length;
  byId(targetId).innerHTML = sortNewestFirst(items).map((honor) => `
    <article class="certificate">
      <span class="certificate-icon">★</span>
      ${previewButton(honor.name, honor.preview)}
      <p>${escapeHtml(honor.issuer)} · ${escapeHtml(honor.year)}</p>
    </article>
  `).join("");
}

function renderHonors() {
  renderHonorGroup("personal-honor-list", "personal-honor-count", "个人荣誉");
  renderHonorGroup("competition-list", "competition-count", "竞赛奖励");
}

const dialog = byId("preview-dialog");
document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-research-filter]");
  if (filterButton) {
    document.querySelectorAll("[data-research-filter]").forEach((button) => button.classList.toggle("active", button === filterButton));
    renderResearch(filterButton.dataset.researchFilter);
    return;
  }
  const button = event.target.closest("[data-preview-image]");
  if (!button) return;
  byId("preview-title").textContent = button.dataset.previewTitle;
  byId("preview-image").src = button.dataset.previewImage;
  byId("preview-image").alt = `${button.dataset.previewTitle}预览`;
  byId("preview-note").textContent = "图片仅用于成果预览；请勿未经许可转载或用于其他用途。";
  dialog.showModal();
});
byId("close-preview").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

async function init() {
  const response = await fetch("data/content.json");
  if (!response.ok) throw new Error("网站内容加载失败");
  content = await response.json();
  renderProfile();
  renderProjects();
  renderTimeline("work-list", content.workExperience);
  renderTimeline("education-list", content.education);
  renderResearchFilters();
  renderResearch();
  renderHonors();
  byId("current-year").textContent = new Date().getFullYear();
}

init().catch((error) => {
  console.error(error);
  document.querySelector("main").insertAdjacentHTML("afterbegin", `<p class="load-error">${escapeHtml(error.message)}，请稍后刷新。</p>`);
});
