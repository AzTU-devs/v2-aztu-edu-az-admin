import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BiotechIcon from '@mui/icons-material/Biotech';
import CampaignIcon from '@mui/icons-material/Campaign';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CategoryIcon from '@mui/icons-material/Category';
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import { GridIcon } from "../icons";
import { permissionForPath } from "../config/routePermissions";

export type NavSubItem = {
  name: string;
  path: string;
  permission?: string | string[];
};

export type NavBadgeKey = "contactUnread";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string | string[];
  subItems?: NavSubItem[];
  badgeKey?: NavBadgeKey;
};

export type NavGroup = {
  label: string;
  permission?: string | string[];
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Ümumi",
    items: [
      {
        icon: <GridIcon />,
        name: "Əsas səhifə",
        path: "/",
      },
    ],
  },
  {
    /*
      The public homepage's editable metric groups — the hero reytinq badges and
      the "Rəqəmlərlə Universitetimiz" counters. A singleton editor, hand-listed
      like the other editorial screens. Distinct from the "/" dashboard above.
    */
    label: "Ana səhifə",
    items: [
      {
        icon: <HomeIcon />,
        name: "Ana səhifə",
        path: "/home",
      },
    ],
  },
  {
    /*
      The public site's "Haqqımızda" dropdown. One entry per screen — the pages
      are hand-listed rather than fetched, like every other group here.
    */
    label: "Haqqımızda",
    items: [
      {
        icon: <InfoIcon />,
        name: "Haqqımızda",
        subItems: [
          { name: "Rektor", path: "/about/rector" },
          { name: "Prorektorlar", path: "/about/vice-rector" },
          { name: "Elmi Şura", path: "/about/scientific-board" },
          { name: "Sabiq Rektorlarımız", path: "/about/former-rectors" },
          { name: "Vizyon, Missiya və Məqsəd", path: "/about/vision-mission-goal" },
          { name: "AzTU-nun Tarixi", path: "/about/history" },
          { name: "Strateji İnkişaf Planı", path: "/about/strategic-plan" },
        ],
      },
      {
        icon: <AccountBalanceIcon />,
        name: "Tərəfdaş Universitet və Əlaqəli İnstitutlar",
        subItems: [
          {
            name: "Türkiyə-Azərbaycan Universiteti",
            path: "/about/turkiye-azerbaijan-university",
          },
          {
            name: "İnformasiya Texnologiyaları İnstitutu",
            path: "/about/institute-of-information-technologies",
          },
          {
            name: "İdarəetmə Sistemləri İnstitutu",
            path: "/about/management-systems-institute",
          },
          { name: "Bakı Texniki Kolleci", path: "/about/baku-technical-college" },
          {
            name: "Bakı Dövlət Rabitə və Nəqliyyat Kolleci",
            path: "/about/baku-state-college-of-communication-and-transport",
          },
        ],
      },
      {
        icon: <GavelIcon />,
        name: "Normativ Sənədlər",
        subItems: [
          { name: "Siyasət Sənədləri", path: "/about/policy-documents" },
          { name: "Dayanıqlılıq Sənədləri", path: "/about/sustainability-documents" },
        ],
      },
    ],
  },
  {
    label: "Məzmun",
    items: [
      {
        icon: <CampaignIcon />,
        name: "Elanlar",
        subItems: [
          { name: "Elanlar", path: "/announcements" },
          { name: "Yeni elan", path: "/announcements/new" },
        ],
      },
      {
        icon: <NewspaperIcon />,
        name: "Xəbərlər",
        subItems: [
          { name: "Xəbərlər", path: "/news" },
          { name: "Yeni xəbər", path: "/news/new" },
          { name: "Xəbər kateqoriyaları", path: "/news-categories" },
          { name: "Fəxri Doktorlar", path: "/honorary-doctors" },
        ],
      },
      {
        /*
          The ranking and accreditation certificates shown in the homepage hero
          and on the QA page. The hero video itself
          (/hero) has no entry here and stays URL-reachable, like the other
          single-screen sections.
        */
        icon: <WorkspacePremiumIcon />,
        name: "Sertifikatlar",
        subItems: [
          { name: "Sertifikatlar", path: "/hero-certificates" },
          { name: "Yeni sertifikat", path: "/hero-certificates/new" },
        ],
      },
    ],
  },
  {
    /*
      The Akademik section. Fakültələr and Kafedralar are nested here alongside
      the editorial pages under "Təhsil və proqramlar", which are hand-listed
      like the Haqqımızda group. Departments moved to the İdarəetmə group below.
    */
    label: "Akademik",
    items: [
      {
        icon: <MenuBookIcon />,
        name: "Təhsil və proqramlar",
        subItems: [
          { name: "MBA", path: "/about/mba" },
          { name: "CDIO", path: "/about/cdio" },
        ],
      },
      {
        icon: <SchoolIcon />,
        name: "Fakültələr",
        subItems: [
          { name: "Fakültələr", path: "/faculties" },
          { name: "Yeni fakültə", path: "/faculties/new" },
        ],
      },
      {
        icon: <CategoryIcon />,
        name: "Kafedralar",
        subItems: [
          { name: "Kafedralar", path: "/cafedras" },
          { name: "Yeni kafedra", path: "/cafedras/new" },
        ],
      },
    ],
  },
  {
    /*
      Management. Departamentlər is nested here, and "Ofis və Mərkəzlər" is a
      creatable CRUD list (its own /offices screens), unlike the hand-listed
      editorial groups above.
    */
    label: "İdarəetmə",
    items: [
      {
        icon: <ApartmentIcon />,
        name: "Departamentlər",
        subItems: [
          { name: "Departamentlər", path: "/admin/departments" },
          { name: "Yeni departament", path: "/admin/departments/create" },
        ],
      },
      {
        icon: <CorporateFareIcon />,
        name: "Ofis və Mərkəzlər",
        subItems: [
          { name: "Ofis və Mərkəzlər", path: "/offices" },
          { name: "Yeni ofis/mərkəz", path: "/offices/new" },
        ],
      },
    ],
  },
  {
    /*
      Students. The "Tədris təqvimi və qaydalar" pages are hand-listed editorial
      screens (About CMS), like the Haqqımızda and Akademik groups.
    */
    label: "Tələbələr",
    items: [
      {
        icon: <GroupsIcon />,
        name: "Tədris təqvimi və qaydalar",
        subItems: [
          { name: "Akademik Təqvim 2025-2026", path: "/about/academic-calendar" },
          { name: "Akademik Təqvim 2026-2027", path: "/about/academic-calendar-2026" },
          { name: "Qiymətləndirmə və İmtahan Qaydaları", path: "/about/assessment-rules" },
          { name: "Kredit Sistemi", path: "/about/credit-system" },
          { name: "LMS Təlimatları", path: "/about/lms-guidelines" },
        ],
      },
    ],
  },
  {
    label: "Tədqiqat",
    items: [
      {
        icon: <ArticleIcon />,
        name: "Tədqiqat",
        subItems: [
          { name: "Tədqiqat Prioritetləri", path: "/research/research-priorities" },
          {
            name: "Əqli Mülkiyyət və Patentlər",
            path: "/research/intellectual-property",
          },
          { name: "Seminarlar və Təlimlər", path: "/research/seminars" },
        ],
      },
      {
        icon: <AutoStoriesIcon />,
        name: "Elmi jurnallar",
        subItems: [
          { name: "Maşınşünaslıq", path: "/research/journal-machine-science" },
          {
            name: "Enerji Davamlılığı, Risklər və Qərarların Qəbul Edilməsi",
            path: "/research/journal-energy-sustainability",
          },
          { name: "Elmi Əsərlər", path: "/research/journal-scientific-works" },
        ],
      },
      {
        icon: <BiotechIcon />,
        name: "Tədqiqat İnstitutları",
        subItems: [
          { name: "İnstitutlar", path: "/research-institutes" },
          { name: "Yeni institut", path: "/research-institutes/new" },
        ],
      },
      {
        icon: <ScienceIcon />,
        name: "Tədqiqat Laboratoriyaları",
        subItems: [
          { name: "Laboratoriyalar", path: "/research-laboratories" },
          { name: "Yeni laboratoriya", path: "/research-laboratories/new" },
        ],
      },
      {
        icon: <AssignmentIcon />,
        name: "Tədqiqat Layihələri",
        subItems: [
          { name: "Layihələr", path: "/research-projects" },
          { name: "Yeni layihə", path: "/research-projects/new" },
        ],
      },
    ],
  },
  {
    label: "Naviqasiya",
    items: [
      {
        icon: <MenuIcon />,
        name: "Menyu",
        subItems: [
          { name: "Header menyu", path: "/menu-header" },
          { name: "Sürətli keçid menyusu", path: "/menu-quick" },
        ],
      },
    ],
  },
  {
    label: "Müraciətlər",
    permission: "contact_messages.read",
    items: [
      {
        icon: <MailOutlineIcon />,
        name: "Əlaqə mesajları",
        path: "/contact-messages",
        permission: "contact_messages.read",
        badgeKey: "contactUnread",
      },
    ],
  },
  {
    label: "Çatbot",
    permission: "chat.read",
    items: [
      {
        icon: <ForumIcon />,
        name: "Çat monitorinqi",
        permission: "chat.read",
        subItems: [
          { name: "Söhbətlər", path: "/chat/sessions", permission: "chat.read" },
          { name: "Statistika", path: "/chat/stats", permission: "chat.read" },
        ],
      },
    ],
  },
  {
    label: "Parametrlər",
    permission: ["roles.read", "admin_users.read", "activity.read"],
    items: [
      {
        icon: <SettingsIcon />,
        name: "Parametrlər",
        subItems: [
          { name: "Rollar", path: "/settings/roles", permission: "roles.read" },
          {
            name: "İstifadəçilər",
            path: "/settings/admin-users",
            permission: "admin_users.read",
          },
          {
            name: "Fəaliyyət jurnalı",
            path: "/settings/activity",
            permission: "activity.read",
          },
        ],
      },
    ],
  },
];

export const isPathActive = (pathname: string, path: string): boolean =>
  path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

export const navItemKey = (item: NavItem): string => item.path ?? item.name;

export type NavMatch = {
  group: NavGroup;
  item: NavItem;
  subItem?: NavSubItem;
};

export const findNavMatch = (
  pathname: string,
  groups: NavGroup[] = navGroups
): NavMatch | null => {
  let match: NavMatch | null = null;
  let matchedLength = -1;

  groups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.path && isPathActive(pathname, item.path) && item.path.length > matchedLength) {
        match = { group, item };
        matchedLength = item.path.length;
      }
      item.subItems?.forEach((subItem) => {
        if (isPathActive(pathname, subItem.path) && subItem.path.length > matchedLength) {
          match = { group, item, subItem };
          matchedLength = subItem.path.length;
        }
      });
    });
  });

  return match;
};

const normalize = (value: string) =>
  value.toLocaleLowerCase("az").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const filterNavGroups = (groups: NavGroup[], query: string): NavGroup[] => {
  const needle = normalize(query.trim());
  if (!needle) return groups;

  return groups
    .map((group) => {
      if (normalize(group.label).includes(needle)) return group;

      const items = group.items.reduce<NavItem[]>((acc, item) => {
        if (normalize(item.name).includes(needle)) {
          acc.push(item);
          return acc;
        }
        const subItems = item.subItems?.filter((subItem) =>
          normalize(subItem.name).includes(needle)
        );
        if (subItems?.length) {
          acc.push({ ...item, subItems });
        }
        return acc;
      }, []);

      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
};

export const filterNavByPermission = (
  groups: NavGroup[],
  can: (permission: string | string[] | undefined) => boolean
): NavGroup[] => {
  const allows = (
    explicit: string | string[] | undefined,
    path: string | undefined
  ): boolean => can(explicit ?? (path ? permissionForPath(path) : undefined));

  return groups
    .filter((group) => can(group.permission))
    .map((group) => {
      const items = group.items.reduce<NavItem[]>((acc, item) => {
        if (item.subItems?.length) {
          const subItems = item.subItems.filter((subItem) =>
            allows(subItem.permission, subItem.path)
          );
          if (subItems.length && allows(item.permission, undefined)) {
            acc.push({ ...item, subItems });
          }
          return acc;
        }

        if (allows(item.permission, item.path)) {
          acc.push(item);
        }
        return acc;
      }, []);

      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
};
