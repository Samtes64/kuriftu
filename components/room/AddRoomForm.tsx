// components/room/AddRoomForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, UploadCloud, X, Tv, Wifi, Mountain, Trees, AirVent, DoorOpen } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const roomFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }).max(50, {
    message: "Title must be less than 50 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }).max(500, {
    message: "Description must be less than 500 characters",
  }),
  bedCount: z.coerce.number().int().min(0, {
    message: "Cannot be negative",
  }).max(10, {
    message: "Maximum 10 beds",
  }),
  bathroomCount: z.coerce.number().int().min(0, {
    message: "Cannot be negative",
  }).max(5, {
    message: "Maximum 5 bathrooms",
  }),
  kingBed: z.coerce.number().int().min(0, {
    message: "Cannot be negative",
  }).max(5, {
    message: "Maximum 5 king beds",
  }),
  normalBed: z.coerce.number().int().min(0, {
    message: "Cannot be negative",
  }).max(5, {
    message: "Maximum 5 standard beds",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  breakfastPrice: z.coerce.number().min(0, {
    message: "Cannot be negative",
  }).max(1000, {
    message: "Maximum $1000",
  }),
  roomPrice: z.coerce.number().min(1, {
    message: "Must be at least $1",
  }).max(10000, {
    message: "Maximum $10,000",
  }),
  tv: z.boolean().optional(),
  balcony: z.boolean().optional(),
  wifi: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
})

interface AddRoomFormProps {
  hotelId: string
  onSuccess?: () => void
}

export const AddRoomForm = ({ hotelId, onSuccess }: AddRoomFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageIsDeleting, setImageIsDeleting] = useState(false)

  const form = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      title: "",
      description: "",
      bedCount: 1,
      bathroomCount: 1,
      kingBed: 0,
      normalBed: 1,
      image: "",
      breakfastPrice: 0,
      roomPrice: 100,
      tv: true,
      wifi: true,
      balcony: false,
      forestView: false,
      mountainView: false,
      airCondition: true,
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, JPG, PNG, or WEBP)")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be smaller than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`
      const filePath = `rooms/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("room-images")
        .getPublicUrl(filePath)

      form.setValue("image", publicUrl)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = async () => {
    const imageUrl = form.getValues("image")
    if (!imageUrl) return
    
    setImageIsDeleting(true)
    try {
      const imagePath = imageUrl.split('/room-images/')[1]
      
      if (imagePath) {
        const { error } = await supabase.storage
          .from("room-images")
          .remove([imagePath])
        
        if (error) throw error
      }
      
      form.setValue("image", "")
      toast.success("Image removed")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to remove image")
    } finally {
      setImageIsDeleting(false)
    }
  }

  async function onSubmit(values: z.infer<typeof roomFormSchema>) {
    setIsLoading(true)
    try {
      const payload = {
        ...values,
        hotelId
      }

      // Replace with your actual API call
      // const response = await axios.post(`/api/hotels/${hotelId}/rooms`, payload)
      console.log("Room submission:", payload)
      
      toast.success("Room added successfully", {
        description: `${values.title} has been created`,
      })
      
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to add room", {
        description: "Please check your connection and try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className=" overflow-hidden max-h-[90vh] overflow-y-auto">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Add New Room
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Deluxe King Suite" 
                          {...field} 
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nightly Rate</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            className="bg-background pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the room's features, amenities, and unique qualities..."
                        className="min-h-[120px] bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Room Image Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Room Image
              </h3>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    {field.value ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <Image
                          src={field.value}
                          alt="Room preview"
                          fill
                          className="object-cover"
                          priority
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 size-8"
                          onClick={handleImageDelete}
                          disabled={imageIsDeleting}
                        >
                          {imageIsDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <X className="size-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <label
                          htmlFor="room-image-upload"
                          className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary transition-colors cursor-pointer bg-muted/50"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                            <UploadCloud className="size-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Upload an image</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              High-quality photo (max 5MB)
                            </p>
                          </div>
                          <input
                            id="room-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                        {isUploading && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Room Configuration Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Room Configuration
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="bedCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kingBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>King Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="normalBed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathroomCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Additional Options Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Additional Options
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="breakfastPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breakfast Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            className="bg-background pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Amenities Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="tv"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="tv-switch"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel htmlFor="tv-switch" className="flex items-center gap-2">
                            <Tv className="size-4 text-muted-foreground" />
                            <span>TV</span>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wifi"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="wifi-switch"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel htmlFor="wifi-switch" className="flex items-center gap-2">
                            <Wifi className="size-4 text-muted-foreground" />
                            <span>WiFi</span>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="airCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="ac-switch"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel htmlFor="ac-switch" className="flex items-center gap-2">
                            <AirVent className="size-4 text-muted-foreground" />
                            <span>Air Conditioning</span>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="balcony"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="balcony-switch"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel htmlFor="balcony-switch" className="flex items-center gap-2">
                            <DoorOpen className="size-4 text-muted-foreground" />
                            <span>Balcony</span>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="forestView"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="forest-switch"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel htmlFor="forest-switch" className="flex items-center gap-2">
                            <Trees className="size-4 text-muted-foreground" />
                            <span>Forest View</span>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mountainView"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="mountain-switch"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FormLabel htmlFor="mountain-switch" className="flex items-center gap-2">
                            <Mountain className="size-4 text-muted-foreground" />
                            <span>Mountain View</span>
                          </FormLabel>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Form Submission */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploading || imageIsDeleting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}