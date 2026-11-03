const anyOf = (domain: string, actions: string[]) => actions.map((a) => `${domain}.${a}`);

const NEWS = anyOf("news", ["create", "update", "delete", "activate", "deactivate", "reorder"]);
const NEWS_CATEGORIES = anyOf("news_categories", ["create", "update", "delete"]);
const ANNOUNCEMENTS = anyOf("announcements", [
  "create",
  "update",
  "delete",
  "activate",
  "deactivate",
  "reorder",
  "upload_file",
]);
const HERO = anyOf("hero", ["create", "update", "delete", "activate", "deactivate"]);
const HERO_CERTIFICATES = anyOf("hero_certificates", [
  "create",
  "update",
  "delete",
  "activate",
  "deactivate",
  "reorder",
]);
const PROJECTS = anyOf("projects", ["create", "delete", "reorder"]);
const COLLABORATIONS = anyOf("collaborations", ["create", "update", "delete", "reorder"]);
const EMPLOYEES = anyOf("employees", ["create", "update", "delete"]);
const FACULTIES = anyOf("faculties", ["create", "update", "delete"]);
const CAFEDRAS = anyOf("cafedras", ["create", "update", "delete"]);
const DEPARTMENTS = anyOf("departments", ["create", "update", "delete"]);
const RESEARCH_INSTITUTES = anyOf("research_institutes", ["create", "update", "delete"]);
const RESEARCH_PROJECTS = anyOf("research_projects", ["create", "update", "delete"]);
const ABOUT = anyOf("about", ["update", "activate"]);
const OFFICE = anyOf("office", ["create", "update", "delete"]);
const RESEARCH_PAGES = anyOf("research_pages", ["update", "activate", "upload"]);
const MENU = anyOf("menu", ["footer_column.create", "footer_link.create", "partner_logo.create"]);
const MENU_HEADER = anyOf("menu_header", ["create", "update", "delete"]);

export const ROUTE_PERMISSIONS: Record<string, string | string[]> = {
  // Detail routes inherit this by longest-prefix, so /about/vision-mission-goal
  // is covered without an entry of its own.
  "/about": ABOUT,

  "/research": RESEARCH_PAGES,

  "/news": NEWS,
  "/news/new": "news.create",
  "/news-categories": NEWS_CATEGORIES,

  "/announcements": ANNOUNCEMENTS,
  "/announcements/new": "announcements.create",

  "/sliders": HERO,
  "/sliders/new": "hero.create",
  "/hero": HERO,

  // Prefix matching only descends through "/", so `/hero-certificates` is a
  // sibling of `/hero`, not a child of it — the two never collide.
  "/hero-certificates": HERO_CERTIFICATES,
  "/hero-certificates/new": "hero_certificates.create",

  "/projects": PROJECTS,
  "/projects/new": "projects.create",

  "/collaborations": COLLABORATIONS,
  "/collaborations/new": "collaborations.create",

  "/employees": EMPLOYEES,
  "/employees/new": "employees.create",

  "/faculties": FACULTIES,
  "/faculties/new": "faculties.create",

  "/cafedras": CAFEDRAS,
  "/cafedras/new": "cafedras.create",

  "/admin/departments": DEPARTMENTS,
  "/admin/departments/create": "departments.create",

  "/offices": OFFICE,
  "/offices/new": "office.create",

  "/research-institutes": RESEARCH_INSTITUTES,
  "/research-institutes/new": "research_institutes.create",

  "/research-projects": RESEARCH_PROJECTS,
  "/research-projects/new": "research_projects.create",

  "/research-laboratories": CAFEDRAS,
  "/research-laboratories/new": "cafedras.laboratory.create",

  "/menu-header": MENU_HEADER,
  "/menu-footer": MENU,
  "/menu-quick": MENU,
  "/menu-shared": MENU,

  "/chat/sessions": "chat.read",
  "/chat/stats": "chat.read",

  "/contact-messages": "contact_messages.read",

  "/settings/roles": "roles.read",
  "/settings/roles/new": "roles.create",
  "/settings/admin-users": "admin_users.read",
  "/settings/admin-users/new": "admin_users.create",
  "/settings/activity": "activity.read",
};

export const permissionForPath = (pathname: string): string | string[] | undefined => {
  let best: string | string[] | undefined;
  let bestLength = -1;

  Object.entries(ROUTE_PERMISSIONS).forEach(([path, permission]) => {
    const matches = pathname === path || pathname.startsWith(`${path}/`);
    if (matches && path.length > bestLength) {
      best = permission;
      bestLength = path.length;
    }
  });

  return best;
};
