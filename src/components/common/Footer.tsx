const Footer = () => {
  return (
     <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🐍</span>
                <span className="font-serif text-lg font-bold text-foreground">SerpentMarket</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The trusted marketplace for exotic reptiles and snakes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Browse All</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Ball Pythons</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Corn Snakes</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Boas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Start Selling</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Seller Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 SerpentMarket. All rights reserved.
          </div>
        </div>
      </footer>
  )
}

export default Footer