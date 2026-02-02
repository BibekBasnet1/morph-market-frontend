import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  LayoutDashboard,
  ShoppingCart,
  User,
  List,
  FileText,
  ChevronDown,
  Ellipsis,
  Store,
  Warehouse,
  ActivityIcon,
} from "lucide-react";

import { useSidebar } from "../../contexts/SidebarContext";
import type { RoleName } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  roles: RoleName[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles: RoleName[];
  subItems?: NavSubItem[];
};
const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    roles: ["admin", "seller","buyer"],
    path: "/dashboard",
  },
    {
    icon: <List size={20} />,
    name: "Buyers List",
    roles: ["admin"],
    path: "/buyers",
  },
      {
    icon: <List size={20} />,
    name: "Sellers List",
    roles: ["admin"],
    path: "/sellers",
  },
  {
    name: "Products",
    icon: <ShoppingCart size={20} />,
    roles: ["seller"],
    subItems: [
      { name: "All Products", path: "/products", roles: ["seller"] },
      { name: "Add Product", path: "/products/add", roles: ["seller"] },
    ],
  },
    {
    name: "Inventory",
    icon: <Warehouse size={20} />,
    roles: ["seller","buyer"],
    path: "/inventory",
  },
      {
    name: "Activity Log",
    icon: <ActivityIcon size={20} />,
    roles: ["seller","buyer", 'admin'],
    path: "/activity-log",
  },
  {
    icon: <User size={20} />,
    name: "User Profile",
    path: "/profile",
    roles: ["admin", "seller", "buyer"],
  },
];


// const othersItems: NavItem[] = [
//   {
//     icon: <PieChart size={20} />,
//     name: "Charts",
//     roles:["admin"],
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", roles:[],pro: true },
//       { name: "Bar Chart", path: "/bar-chart",roles:['admin'], pro: true },
//     ],
//   },
//   //   {
//   //   name: "Administration",
//   //   icon: <FileText size={20} />,
//   //   roles: ["admin", "seller","buyer"],
//   //   subItems: [
//   //     { name: "Add Categories", path: "/add-categories", roles: ["admin", "seller","buyer"], pro: false },
//   //   ],
//   // },
// ];

const supportItems: NavItem[] = [
  {
    icon: <Store />,
    roles:['admin','seller','buyer'],
    name: "Store",
    path: "/store",
  },
   {
    name: "Add Attributes",
    icon: <FileText size={20} />,
    roles: ["admin"],
    subItems: [
      { name: "Add Categories", path: "/add-categories", roles: ["admin"], pro: false },
      { name: "Add Traits", path: "/add-traits", roles: ["admin"], pro: false },
      { name: "Add Tags", path: "/add-tags", roles: ["admin"], pro: false },
      { name: "Add Diet", path: "/add-diet", roles: ["admin"], pro: false },
      { name: "Add Maturity Level", path: "/add-maturity", roles: ["admin"], pro: false },
      { name: "Add Origin", path: "/add-origin", roles: ["admin"], pro: false },
      { name: "Add Gender", path: "/add-gender", roles: ["admin"], pro: false },

    ],
  },
 
];

const AppSidebar: React.FC = () => {

  const {user} = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } =
    useSidebar();
  const location = useLocation();
  // Auto-close sidebar on mobile after route change
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "support";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "support"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : supportItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "support",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "support"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const userRoleNames: RoleName[] =
  user?.roles?.map((r) => r.name as RoleName) ?? [];

const hasAccess = (allowedRoles: RoleName[]) =>
  allowedRoles.some((role) => userRoleNames.includes(role));

  // Modify navItems to set dynamic dashboard path based on role
  const modifiedNavItems = navItems.map(item => {
    if (item.name === "Dashboard") {
      let dashboardPath = "/dashboard"; // default
      if (userRoleNames.includes("admin") || userRoleNames.includes("superadmin")) {
        dashboardPath = "/admin/dashboard";
      } else if (userRoleNames.includes("seller")) {
        dashboardPath = "/seller/dashboard";
      } else if (userRoleNames.includes("buyer")) {
        dashboardPath = "/buyer/dashboard";
      }
      return { ...item, path: dashboardPath };
    }
    return item;
  });

  const renderMenuItems = (
  items: NavItem[],
  menuType: "main" | "support"
) => (
  <ul className="flex flex-col gap-1">
    {items
      // ✅ filter parent menus by role
      .filter((nav) => hasAccess(nav.roles))
      .map((nav, index) => {
        // ✅ filter sub-items by role
        const visibleSubItems = nav.subItems
          ? nav.subItems.filter((sub) => hasAccess(sub.roles))
          : [];

        // ❌ do not render menu if it has subItems but none are visible
        if (nav.subItems && visibleSubItems.length === 0) {
          return null;
        }

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType &&
                  openSubmenu?.index === index
                    ? "menu-item-active text-green-600"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "xl:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-green-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* ✅ Render filtered submenus */}
            {nav.subItems &&
              visibleSubItems.length > 0 &&
              (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {visibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}

                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-pro-active"
                                  : "menu-dropdown-badge-pro-inactive"
                              } menu-dropdown-badge-pro`}
                            >
                              pro
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </li>
        );
      })}
  </ul>
);

  return (
    <aside
      className={`fixed dark:bg-black bg-white flex flex-col  top-0 px-5 left-0  h-screen transition-all duration-300 ease-in-out z-50 border-r dark:border-gray-700 border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[260px]"
            : isHovered
            ? "w-[260px]"
            : "w-[80px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8  flex ${
          !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {/* <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
                  
             <span className="text-2xl">🐍</span>
             <span className="font-serif text-xl font-bold text-black dark:text-white">
               SerpentMarket
             </span>
            </>
          ) : (
           <span className="text-2xl">🐍</span>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <Ellipsis className="size-6" />
                )}
              </h2>
              {renderMenuItems(modifiedNavItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Support"
                ) : (
                  <Ellipsis className="size-6" />
                )}
              </h2>
              {renderMenuItems(supportItems, "support")}
            </div>
            {/* <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <Ellipsis className="size-6" />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
