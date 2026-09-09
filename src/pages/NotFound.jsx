import { Container } from '../components/ui/States'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl font-bold text-navy-950/10">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy-950">Looks like this trail isn't mapped</h1>
      <p className="mt-3 max-w-md text-ink-500">
        The page you're looking for doesn't exist, or the route has changed. Let's get you back on the trail.
      </p>
      <div className="mt-8 flex gap-3">
        <Button to="/">Back to Home</Button>
        <Button to="/tours" variant="outline-dark">
          Browse Expeditions
        </Button>
      </div>
    </Container>
  )
}
