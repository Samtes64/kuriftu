"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Hotel, Room } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Image from "next/image"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { supabase } from "@/lib/supabase"

interface AddHotelFormProps {
  hotel: HotelWithRooms | null
}

export type HotelWithRooms = Hotel & {
  rooms: Room[]
}

const formSchema = z.object({
  userId: z.string(),
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  image: z.string().min(1, { message: "Image is required" }),
  city: z.string().min(1, { message: "City is required" }),
  subCity: z.string().min(1, { message: "Sub-city is required" }),
  locationDescription: z.string().min(10, { message: "Location description must be at least 10 characters" }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
})

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [imageIsDeleting, setImageIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      userId: session?.user?.id || "",
      title: "",
      description: "",
      image: "",
      city: "",
      subCity: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      restaurant: false,
      shopping: false,
      swimmingPool: false,
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `hotels/${fileName}`
  
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file)
  
      if (uploadError) throw uploadError
  
      const { data: publicUrlData } = supabase
        .storage
        .from("images")
        .getPublicUrl(filePath)
  
      const imageUrl = publicUrlData?.publicUrl
  
      form.setValue("image", imageUrl || "")
      toast.success("Image uploaded successfully")
    } catch (error) {
      toast.error("Image upload failed")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = async () => {
    setImageIsDeleting(true)
    try {
      // Add your image deletion logic here if needed
      form.setValue("image", "")
      toast.success("Image removed successfully")
    } catch (error) {
      toast.error("Image deletion failed")
      console.error(error)
    } finally {
      setImageIsDeleting(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save a hotel")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        ...values,
        userId: session.user.id // Ensure we're using the current user's ID
      }
      console.log(payload)

      if (hotel) {
        // Update hotel logic
        // await updateHotel(hotel.id, payload)
        toast.success("Hotel updated successfully")
      } else {
        // Create hotel logic
        // await createHotel(payload)
        toast.success("Hotel created successfully")
      }
    } catch (error) {
      toast.error("An error occurred while saving the hotel")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">{hotel ? "Update Hotel" : "Add a New Hotel"}</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Title *</FormLabel>
                    <FormDescription>Provide your hotel name</FormDescription>
                    <FormControl>
                      <Input placeholder="Grand Hyatt Hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Located in the heart of the city with stunning views..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>Select amenities available at your property</FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Gym</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Spa</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swimmingPool"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Swimming Pool</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Restaurant</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Bar</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shopping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Shopping</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Image *</FormLabel>
                    <FormDescription>Upload a featured image for your hotel</FormDescription>
                    {field.value ? (
                      <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                        <Image
                          src={field.value}
                          alt="Hotel Image"
                          width={400}
                          height={400}
                          className="object-contain rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute right-[-12px] top-0"
                          onClick={() => handleImageDelete()}
                          disabled={imageIsDeleting}
                        >
                          {imageIsDeleting ? <Loader2 className="animate-spin" /> : "✕"}
                        </Button>
                      </div>
                    ) : (
                      <div  className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        <label htmlFor="image-upload" className="text-blue-500">click here to select image</label>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Button 
                            type="button" 
                            variant="outline"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              "Upload Image"
                            )}
                          </Button>
                        </label>
                        <p className="mt-2 text-sm text-muted-foreground">
                          JPG, PNG, or WEBP (Max 5MB)
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Manhattan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description *</FormLabel>
                    <FormDescription>
                      Provide detailed information about the location
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Located on 5th Avenue, just 2 blocks from Central Park..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !session?.user?.id}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    hotel ? "Update Hotel" : "Save Hotel"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AddHotelForm