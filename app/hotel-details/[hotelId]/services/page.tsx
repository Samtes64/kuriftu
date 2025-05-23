"use client"

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Room} from '@prisma/client'
import Image from 'next/image'
import {AspectRatio} from '@/components/ui/aspect-ratio'
import {Calendar as CalendarIcon} from 'lucide-react'
import {addDays, format, differenceInDays, isSameDay} from 'date-fns'
import {DateRange} from 'react-day-picker'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Calendar} from '@/components/ui/calendar'
import {cn} from '@/lib/utils'
import {useState} from 'react'
import {Checkbox} from '@/components/ui/checkbox'
import {Label} from '@/components/ui/label'

export default function Services() {

    const services = [{
        id: 1,
        title: "service title",
        description: 'Service description',
        price: 100,
        maxPeople: 4,
        image: 'imageurl'

    },
        {
            id: 2,
            title: "service title",
            description: 'Service description',
            price: 100,
            maxPeople: 4,
            image: 'imageurl'

        },
        {
            id: 3,
            title: "service title",
            description: 'Service description',
            price: 100,
            maxPeople: 4,
            image: 'imageurl'

        },
        {
            id: 4,
            title: "service title",
            description: 'Service description',
            price: 100,
            maxPeople: 4,
            image: 'imageurl'

        }
    ]
    const [isLoading, setIsLoading] = useState(false);

    const displayService = services.map((service) => {
        return (
            <div
                key={service.id}
                className="flex flex-col md:flex-row gap-6 p-5 border rounded-lg hover:shadow-sm transition-all"
            >
                <div className="md:w-2/5 lg:w-1/3">
                    <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={'/room-placeholder.jpg'}
                            alt={service.title}
                            fill
                            className="object-cover"
                            priority={false}
                        />
                    </AspectRatio>
                </div>

                <div className="md:w-3/5 lg:w-2/3 flex flex-col">
                    <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-semibold">{service.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary" className="px-2 py-1 text-xs font-normal">
                                {service.maxPeople} people
                            </Badge>
                        </div>
                    </div>

                    <div
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-6 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold">
                                    ETB {service.price}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => console.log("payment method")}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Book Now'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    })
    console.log(displayService)

    const [dateRange, setDateRange] = useState<Date | undefined>(new Date)

    const calculateTotalPrice = (room: Room) => {
    }
    const [error, setError] = useState("");

    const handlePayment = async (room: Room) => {
        setIsLoading(true);
        setError("");
    }
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-end">
                    <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">Dinner reservation</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Select dates to check availability</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal hover:bg-accent/90",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="h-4 w-4 opacity-70"/>
                                        {dateRange && <div>selected date: {format(dateRange, "MMM d")} </div>}
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-lg" align="end">
                                <Calendar
                                    initialFocus
                                    mode="single"
                                    defaultMonth={dateRange}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}

                                    disabled={{before: new Date()}}
                                    classNames={{
                                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-3",
                                        caption: "flex justify-center pt-1 relative items-center",
                                        caption_label: "text-sm font-medium",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "bg-accent text-accent-foreground",
                                        day_outside: "text-muted-foreground opacity-50",
                                        day_disabled: "text-muted-foreground opacity-50",
                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                        day_hidden: "invisible",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {displayService}
            </CardContent>
        </Card>
    )
}

