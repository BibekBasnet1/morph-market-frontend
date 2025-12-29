import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  LayoutDashboard,
  Sparkles,
  ShoppingCart,
  Calendar,
  User,
  CheckSquare,
  List,
  Table,
  FileText,
  PieChart,
  MessageCircle,
  ChevronDown,
  Ellipsis,
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
    roles: ["admin", "seller","buyer"],
    path: "/buyers",
  },
      {
    icon: <List size={20} />,
    name: "Sellers List",
    roles: ["admin", "seller","buyer"],
    path: "/sellers",
  },
  {
    name: "AI Assistant",
    icon: <Sparkles size={20} />,
    roles: ["admin", "seller"],
    subItems: [
      { name: "Text Generator", path: "/text-generator", roles: ["admin", "seller"] },
      { name: "Image Generator", path: "/image-generator", roles: ["admin", "seller"] },
      { name: "Code Generator", path: "/code-generator", roles: ["admin", "seller"] },
      { name: "Video Generator", path: "/video-generator", roles: ["admin", "seller"] },
    ],
  },
  {
    name: "E-commerce",
    icon: <ShoppingCart size={20} />,
    roles: ["admin", "seller"],
    subItems: [
      { name: "Products", path: "/products-list", roles: ["seller"] },
      { name: "Add Product", path: "/add-product", roles: ["seller"] },
      { name: "Billing", path: "/billing", roles: ["admin", "seller"] },
      { name: "Invoices", path: "/invoices", roles: ["admin", "seller"] },
      { name: "Single Invoice", path: "/single-invoice", roles: ["admin", "seller"] },
      { name: "Create Invoice", path: "/create-invoice", roles: ["admin", "seller"] },
      { name: "Transactions", path: "/transactions", roles: ["admin", "seller"] },
      { name: "Single Transaction", path: "/single-transaction", roles: ["admin", "seller"] },
    ],
  },
  {
    icon: <Calendar size={20} />,
    name: "Calendar",
    path: "/calendar",
    roles: ["admin", "seller", "buyer"],
  },
  {
    icon: <User size={20} />,
    name: "User Profile",
    path: "/profile",
    roles: ["admin", "seller", "buyer"],
  },
  {
    name: "Task",
    icon: <CheckSquare size={20} />,
    roles: ["admin", "seller"],
    subItems: [
      { name: "List", path: "/task-list", roles: ["admin", "seller"], pro: true },
      { name: "Kanban", path: "/task-kanban", roles: ["admin", "seller"], pro: true },
    ],
  },
  {
    name: "Forms",
    icon: <FileText size={20} />,
    roles: ["admin", "seller"],
    subItems: [
      { name: "Form Elements", path: "/form-elements", roles: ["admin", "seller"], pro: false },
      { name: "Form Layout", path: "/form-layout", roles: ["admin", "seller"], pro: true },
    ],
  },
  {
    name: "Tables",
    icon: <Table size={20} />,
    roles: ["admin", "seller"],
    subItems: [
      { name: "Basic Tables", path: "/basic-tables", roles: ["admin", "seller"], pro: false },
      { name: "Data Tables", path: "/data-tables", roles: ["admin", "seller"], pro: true },
    ],
  },
  {
    name: "Pages",
    icon: <FileText size={20} />,
    roles: ["admin", "seller"],
    subItems: [
      { name: "File Manager", path: "/file-manager", roles: ["admin", "seller"] },
      { name: "Pricing Tables", path: "/pricing-tables", roles: ["admin", "seller"] },
      { name: "FAQ", path: "/faq", roles: ["admin", "seller", "buyer"] },
      { name: "API Keys", path: "/api-keys", roles: ["admin"] },
      { name: "Integrations", path: "/integrations", roles: ["admin", "seller"] },
      { name: "Blank Page", path: "/blank", roles: ["admin", "seller"] },
      { name: "404 Error", path: "/error-404", roles: ["admin", "seller", "buyer"] },
      { name: "500 Error", path: "/error-500", roles: ["admin", "seller"] },
      { name: "503 Error", path: "/error-503", roles: ["admin", "seller"] },
      { name: "Coming Soon", path: "/coming-soon", roles: ["admin", "seller", "buyer"] },
      { name: "Maintenance", path: "/maintenance", roles: ["admin", "seller"] },
      { name: "Success", path: "/success", roles: ["admin", "seller", "buyer"] },
    ],
  },
];


const othersItems: NavItem[] = [
  {
    icon: <PieChart size={20} />,
    name: "Charts",
    roles:["admin"],
    subItems: [
      { name: "Line Chart", path: "/line-chart", roles:['admin'],pro: true },
      { name: "Bar Chart", path: "/bar-chart",roles:['admin'], pro: true },
    ],
  },
];

const supportItems: NavItem[] = [
  {
    icon: <MessageCircle size={20} />,
    roles:['admin'],
    name: "Chat",
    path: "/chat",
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
    type: "main" | "support" | "others";
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
    ["main", "support", "others"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : menuType === "support"
          ? supportItems
          : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "support" | "others",
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
    menuType: "main" | "support" | "others"
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

  const renderMenuItems = (
  items: NavItem[],
  menuType: "main" | "support" | "others"
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
                        ? "rotate-180 text-brand-500"
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
      className={`fixed dark:bg-black bg-white flex flex-col  top-0 px-5 left-0  h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
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
              {renderMenuItems(navItems, "main")}
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
            <div>
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
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
