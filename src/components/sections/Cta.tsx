
import { Button } from '../ui/button'
import { Link } from 'react-router'

const Cta = () => {
  return (
  <section className="py-20" style={{ background: 'var(--gradient-primary-fade)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Reptile Journey?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of reptile enthusiasts buying and selling on SerpentMarket. 
            Whether you're a first-time buyer or experienced breeder, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
  )
}

export default Cta