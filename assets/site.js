const content = window.SITE_CONTENT;

const byId = (id) => document.getElementById(id);
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[char]));

function renderProfile() {
  byId("profile-name").textContent = content.profile.name;
  byId("footer-name").textContent = content.profile.name;
  byId("profile-intro").textContent = content.profile.intro;
  byId("about-text").textContent = content.profile.about;
  byId("email-link").href = `mailto:${content.profile.email}`;
  byId("profile-meta").innerHTML = [content.profile.location, content.profile.focus]
    .map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  document.title = `${content.profile.name} · 个人主页`;
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

function renderPublications() {
  byId("publication-list").innerHTML = content.publications.map((publication) => `
    <article class="publication">
      <span class="publication-year">${escapeHtml(publication.year)}</span>
      <div>
        ${previewButton(publication.title, publication.preview)}
        <p class="publication-meta">${escapeHtml(publication.authors)} · ${escapeHtml(publication.venue)}</p>
      </div>
      ${publication.link ? `<a class="external-link" href="${escapeHtml(publication.link)}" target="_blank" rel="noopener noreferrer">论文链接 ↗</a>` : ""}
    </article>
  `).join("");
}

function renderCertificates() {
  byId("certificate-list").innerHTML = content.certificates.map((certificate) => `
    <article class="certificate">
      <span class="certificate-icon">✓</span>
      ${previewButton(certificate.name, certificate.preview)}
      <p>${escapeHtml(certificate.issuer)} · ${escapeHtml(certificate.year)}</p>
    </article>
  `).join("");
}

function renderExperience() {
  byId("experience-list").innerHTML = content.experience.map((item) => `
    <article class="timeline-item">
      <span class="timeline-date">${escapeHtml(item.period)}</span>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.organization)} · ${escapeHtml(item.description)}</p></div>
    </article>
  `).join("");
}

const dialog = byId("preview-dialog");
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preview-image]");
  if (!button) return;
  byId("preview-title").textContent = button.dataset.previewTitle;
  byId("preview-image").src = button.dataset.previewImage;
  byId("preview-image").alt = `${button.dataset.previewTitle}预览`;
  byId("preview-note").textContent = "当前使用示例图片；替换图片文件和 data/content.js 中的路径即可更新。";
  dialog.showModal();
});
byId("close-preview").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

renderProfile();
renderProjects();
renderPublications();
renderCertificates();
renderExperience();
byId("current-year").textContent = new Date().getFullYear();
