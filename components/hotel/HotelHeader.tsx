import { Star } from 'lucide-react'

export function HotelHeader({
  title,
  location,
  rating
}: {
  title: string
  location: string
  rating: number
}) {
  return (
    <div className="relative h-[500px] bg-gradient-to-r from-primary/10 to-amber-500/10">
      <div className="absolute inset-0 bg-black/30" />
      <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="font-medium">{location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}