const ActivityTab = () => {
  return (
    <div className="rounded-xl border p-6 space-y-3">
      <h3 className="text-lg font-semibold">Recent Activity</h3>

      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>✔ Updated profile information</li>
        <li>✔ Listed a new snake for sale</li>
        <li>✔ Completed an order</li>
      </ul>
    </div>
  );
};

export default ActivityTab;
