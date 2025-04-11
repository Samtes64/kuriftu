'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Search, X, Filter, Waves, Dumbbell, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const amenities = [
    { value: 'gym', label: 'Gym', icon: Dumbbell },

    { value: 'restaurant', label: 'Dining', icon: Utensils },
    { value: 'swimmingPool', label: 'Pool', icon: Waves },
]

export function HotelFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

    // Initialize state from URL params
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '')
        setSelectedAmenities(searchParams.get('amenities')?.split(',') || [])
        setPriceRange([
            parseInt(searchParams.get('minPrice') || '0'),
            parseInt(searchParams.get('maxPrice') || '10000')
        ])
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams()

        if (searchQuery) params.set('search', searchQuery)
        if (selectedAmenities.length) params.set('amenities', selectedAmenities.join(','))
        params.set('minPrice', priceRange[0].toString())
        params.set('maxPrice', priceRange[1].toString())

        router.push(`/?${params.toString()}`)
        setIsMobileFiltersOpen(false)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setSelectedAmenities([])
        setPriceRange([0, 10000])
        router.push('/')
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="mb-8 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500"
                >
                    Discover Luxury Stays
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                    Find your perfect getaway with our curated collection of premium hotels
                </motion.p>
            </div>

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-6">
                <Button
                    variant="outline"
                    className="w-full justify-between py-6 rounded-xl"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                    <span className="font-medium">Filter Hotels</span>
                    <div className="flex items-center gap-2">
                        {selectedAmenities.length > 0 && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                {selectedAmenities.length}
                            </span>
                        )}
                        <Filter className="h-5 w-5" />
                    </div>
                </Button>
            </div>

            {/* Main Filter Container */}
            <AnimatePresence>
                {(isMobileFiltersOpen || !isMobileFiltersOpen) && (
                    <motion.div
                        key="filters"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/20 shadow-sm",
                            isMobileFiltersOpen ? 'block mb-6' : 'hidden lg:block'
                        )}
                    >
                        <div className="space-y-6">
                            {/* Search Input */}
                            <div>
                                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Search</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Hotel name, location, or keyword..."
                                        className="pl-9 h-12 rounded-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Price Range</h3>
                                    <span className="text-sm font-medium">
                                        ETB {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                                    </span>
                                </div>
                                <Slider
                                    min={0}
                                    max={10000}
                                    step={100}
                                    value={priceRange}
                                    onValueChange={(value) => setPriceRange(value as [number, number])}
                                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                                />
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Amenities</h3>
                                <ToggleGroup
                                    type="multiple"
                                    variant="outline"
                                    value={selectedAmenities}
                                    onValueChange={setSelectedAmenities}
                                    className="flex-wrap justify-start gap-2"
                                >
                                    {amenities.map((amenity) => (
                                        <ToggleGroupItem
                                            key={amenity.value}
                                            value={amenity.value}
                                            className="px-4 py-2 h-auto rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:border-primary/30 gap-2"
                                        >
                                            <amenity.icon className="h-4 w-4" />
                                            {amenity.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-lg"
                                    onClick={resetFilters}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                                <Button
                                    className="flex-1 h-12 rounded-lg "
                                    onClick={applyFilters}
                                >
                                    Show Results
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}