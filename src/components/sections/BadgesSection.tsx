const BadgesSection = () => {
  return (
    <section className="border-y border-border dark:border-gray-600 bg-card dark:bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              title: "Verified Sellers",
              subtitle: "100% Trusted",
            },
            {
              title: "Safe Shipping",
              subtitle: "Live Arrival Guarantee",
            },
            {
              title: "Expert Support",
              subtitle: "24/7 Help",
            },
            {
              title: "Top Rated",
              subtitle: "4.9 Average",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center dark:text-white justify-center text-center"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BadgesSection;
