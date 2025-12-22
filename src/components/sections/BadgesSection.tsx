const BadgesSection = () => {
  return (
    <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3 justify-center">
              <div>
                <p className="font-semibold text-foreground">Verified Sellers</p>
                <p className="text-sm text-muted-foreground">100% Trusted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div>
                <p className="font-semibold text-foreground">Safe Shipping</p>
                <p className="text-sm text-muted-foreground">Live Arrival Guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div>
                <p className="font-semibold text-foreground">Expert Support</p>
                <p className="text-sm text-muted-foreground">24/7 Help</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div>
                <p className="font-semibold text-foreground">Top Rated</p>
                <p className="text-sm text-muted-foreground">4.9 Average</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default BadgesSection