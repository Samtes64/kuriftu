'use client'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function LuxuryGallery({ mainImage }: { mainImage: string }) {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [mainImage, ...(Array(3).fill(mainImage))] // In reality, you'd have multiple images

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-border/20">
      <div className="relative group">
        <AspectRatio ratio={16/9}>
          <Image
            src={images[currentImage]}
            alt="Luxury hotel gallery"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </AspectRatio>
        
        {/* Navigation Arrows */}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setCurrentImage(prev => (prev - 1 + images.length) % images.length)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setCurrentImage(prev => (prev + 1) % images.length)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all ${currentImage === idx ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
              onClick={() => setCurrentImage(idx)}
            />
          ))}
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-background">
        {images.slice(0,4).map((img, idx) => (
          <button 
            key={idx}
            className={`relative h-20 rounded-lg overflow-hidden transition-all ${currentImage === idx ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'}`}
            onClick={() => setCurrentImage(idx)}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}