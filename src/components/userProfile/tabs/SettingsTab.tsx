import { Button } from "../../../components/ui/button";
import Switch  from "../../../components/ui/switch";

const SettingsTab = () => {
  return (
    <div className="max-w-xl space-y-6 rounded-xl border p-6">
      <h3 className="text-lg font-semibold">Account Settings</h3>

      <div className="flex items-center justify-between">
        <span>Email Notifications</span>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <span>SMS Alerts</span>
        <Switch />
      </div>

      <Button variant="destructive">Deactivate Account</Button>
    </div>
  );
};

export default SettingsTab;
