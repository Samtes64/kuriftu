// app/access-room/[roomId]/page.tsx
'use client'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { Lightbulb, Utensils, DoorOpen, VenetianMask, Fan, Sheet } from 'lucide-react'

export default function AccessRoomPage() {
  const { roomId } = useParams()
  const [lightLevel, setLightLevel] = useState(50)
  const [curtainOpen, setCurtainOpen] = useState(false)
  const [doorLocked, setDoorLocked] = useState(true)
  const [acTemp, setAcTemp] = useState(22)

  // Sample food items
  const foodMenu = [
    { id: 1, name: 'Breakfast Platter', price: 12.99 },
    { id: 2, name: 'Club Sandwich', price: 9.99 },
    { id: 3, name: 'Pasta Carbonara', price: 14.99 },
    { id: 4, name: 'Cheesecake', price: 7.99 }
  ]

  // Sample spa services
  const spaServices = [
    { id: 1, name: 'Swedish Massage (30min)', price: 45 },
    { id: 2, name: 'Deep Tissue Massage (60min)', price: 80 },
    { id: 3, name: 'Aromatherapy (45min)', price: 65 }
  ]

  const [selectedFood, setSelectedFood] = useState<number[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const toggleFoodSelection = (id: number) => {
    if (selectedFood.includes(id)) {
      setSelectedFood(selectedFood.filter(item => item !== id))
    } else {
      setSelectedFood([...selectedFood, id])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl">Room #{roomId} Controls</CardTitle>
            <CardDescription>
              Manage your room environment and services
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="controls">
              <Lightbulb className="h-4 w-4 mr-2" />
              Room Controls
            </TabsTrigger>
            <TabsTrigger value="dining">
              <Utensils className="h-4 w-4 mr-2" />
              Room Service
            </TabsTrigger>
            <TabsTrigger value="spa">
              <VenetianMask className="h-4 w-4 mr-2" />
              Spa Services
            </TabsTrigger>
          </TabsList>

          {/* Room Controls Tab */}
          <TabsContent value="controls">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lighting Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Lighting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Main Lights</span>
                      <Switch />
                    </div>
                    <div>
                      <p className="text-sm mb-2">Dimmer Level</p>
                      <Slider 
                        value={[lightLevel]}
                        onValueChange={(value) => setLightLevel(value[0])}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Climate Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Fan className="h-5 w-5 mr-2" />
                    Climate Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AC Unit</span>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <p className="text-sm mb-2">Temperature: {acTemp}°C</p>
                      <Slider 
                        value={[acTemp]}
                        onValueChange={(value) => setAcTemp(value[0])}
                        max={30}
                        min={16}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>16°</span>
                        <span>23°</span>
                        <span>30°</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Curtain Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sheet className="h-5 w-5 mr-2" />
                    Window Curtains
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {curtainOpen ? 'Open' : 'Closed'}
                    </span>
                    <Switch 
                      checked={curtainOpen}
                      onCheckedChange={setCurtainOpen}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Door Control */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DoorOpen className="h-5 w-5 mr-2" />
                    Door Lock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {doorLocked ? 'Locked' : 'Unlocked'}
                    </span>
                    <Switch 
                      checked={doorLocked}
                      onCheckedChange={setDoorLocked}
                    />
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Request Staff Assistance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Room Service Tab */}
          <TabsContent value="dining">
            <Card>
              <CardHeader>
                <CardTitle>Room Service Menu</CardTitle>
                <CardDescription>
                  Select items to order (will be charged to your room)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {foodMenu.map(item => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFood.includes(item.id)
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleFoodSelection(item.id)}
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ETB {item.price.toFixed(2)}
                        </p>
                      </div>
                      {selectedFood.includes(item.id) && (
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" disabled={selectedFood.length === 0}>
                  Order Selected Items ({selectedFood.length})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spa Services Tab */}
          <TabsContent value="spa">
            <Card>
              <CardHeader>
                <CardTitle>In-Room Spa Services</CardTitle>
                <CardDescription>
                  Book a relaxing massage in the comfort of your room
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spaServices.map(service => (
                    <div 
                      key={service.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedService === service.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ETB {service.price.toFixed(2)}
                        </p>
                      </div>
                      {selectedService === service.id && (
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button className="w-full" disabled={!selectedService}>
                    Book Massage Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}