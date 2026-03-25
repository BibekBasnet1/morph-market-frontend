import { NavLink, Outlet } from "react-router";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
    isActive
      ? "border-[#22c55e] text-[#16a34a] dark:text-green-400"
      : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
  }`;

const MyAttributesLayout = () => {
  return (
    <div className="space-y-6 p-1 mx-auto text-gray-900 dark:text-gray-100 ">
      <div>
        <h1 className="text-xl font-semibold">My Attributes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Custom traits are grouped under admin categories. Tags are free-form labels for your animals.
        </p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        <NavLink to="traits" className={tabClass} end>
          My Traits
        </NavLink>
        <NavLink to="tags" className={tabClass} end>
          My Tags
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
};

export default MyAttributesLayout;
