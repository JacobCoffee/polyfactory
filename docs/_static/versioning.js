const loadVersions = async () => {
  const res = await fetch(DOCUMENTATION_OPTIONS.URL_ROOT + "versions.json");
  if (res.status !== 200) {
    return null;
  }
  return await res.json();
};

const getCurrentVersion = (versions) => {
  const baseURL = new URL(DOCUMENTATION_OPTIONS.URL_ROOT, window.location).href;
  const parts = window.location.href.replace(baseURL, "").split("/");
  if (!parts.length) {
    return null;
  }
  const maybeVersion = parts[0];
  if (maybeVersion === "lib") {
    return versions.latest;
  }
  if (versions.versions.includes(maybeVersion)) {
    return maybeVersion;
  }
  return null;
};

const addVersionWarning = (currentVersion, latestVersion) => {
  if (currentVersion === latestVersion) {
    return;
  }

  const navbarMain = document.getElementById("navbar-main");
  if (!navbarMain) {
    return;
  }

  const container = document.createElement("div");
  container.id = "version-warning";

  const warningText = document.createElement("span");
  warningText.textContent = `You are viewing the documentation for ${
    currentVersion === "dev" ||
    parseInt(currentVersion) > parseInt(latestVersion)
      ? "a preview"
      : "an outdated"
  } version of Starlite.`;
  container.appendChild(warningText);

  const latestLink = document.createElement("a");
  latestLink.textContent = "Click here to go to the latest version";
  latestLink.href = DOCUMENTATION_OPTIONS.URL_ROOT + "lib";
  container.appendChild(latestLink);

  navbarMain.before(container);
};

const formatVersionName = (version, isLatest) =>
  version + (isLatest ? " (latest)" : "");

const addVersionSelect = (currentVersion, versionSpec) => {
  const navEnd = document.getElementById("navbar-end");
  if (!navEnd) {
    return;
  }

  const container = document.createElement("div");
  container.classList.add("navbar-nav");

  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  container.appendChild(dropdown);

  const dropdownToggle = document.createElement("button");
  dropdownToggle.classList.add("btn", "dropdown-toggle", "nav-item");
  dropdownToggle.setAttribute("data-toggle", "dropdown");
  dropdownToggle.setAttribute("type", "button");
  dropdownToggle.textContent = `Version: ${formatVersionName(
    currentVersion,
    currentVersion === versionSpec.latest,
  )}`;
  dropdown.appendChild(dropdownToggle);

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-menu");
  dropdown.appendChild(dropdownContent);

  for (const version of versionSpec.versions) {
    const navItem = document.createElement("li");
    navItem.classList.add("nav-item");

    const navLink = document.createElement("a");
    navLink.classList.add("nav-link", "nav-internal");
    navLink.href = DOCUMENTATION_OPTIONS.URL_ROOT + version;
    navLink.textContent = formatVersionName(
      version,
      version === versionSpec.latest,
    );
    navItem.appendChild(navLink);

    dropdownContent.appendChild(navItem);
  }

  navEnd.prepend(container);
};

const setupVersioning = (versions) => {
  if (versions === null) {
    return;
  }

  const currentVersion = getCurrentVersion(versions);
  if (currentVersion === null) {
    return;
  }

  addVersionWarning(currentVersion, versions.latest);
  addVersionSelect(currentVersion, versions);
};

window.addEventListener("DOMContentLoaded", () => {
  loadVersions().then(setupVersioning);
});
