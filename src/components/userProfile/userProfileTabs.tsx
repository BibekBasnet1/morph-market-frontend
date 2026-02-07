import { User, Settings, Activity } from "lucide-react";

interface Tab {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  active: string;
  onChange: (key: string) => void;
}

const tabs: Tab[] = [
  { key: "profile", label: "Profile", icon: <User size={16} /> },
  { key: "activity", label: "Activity", icon: <Activity size={16} /> },
];

const ProfileTabs = ({ active, onChange }: Props) => {
  return (
    <div className="flex gap-2 rounded-xl bg-muted dark:bg-muted p-2 ">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            active === tab.key
              ? "bg-white dark:bg-card shadow text-foreground dark:text-foreground"
              : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;