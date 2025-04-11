"use client"

import { zodResolver } from "@hookform/resolvers/zod"

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
import { Eye, Loader2, Plus, Trash2, UploadCloud, X } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Hotel, Room } from "@/prisma/app/generated/prisma/client"
import { ViewHotelModal } from "./VIewHotelModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { AddRoomForm } from "../room/AddRoomForm"

interface AddHotelFormProps {
  hotel: HotelWithRooms | null
}

export type HotelWithRooms = Hotel & {
  rooms: Room[]
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

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

    // Client-side validation
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG, PNG, or WEBP image.")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size too large. Maximum 5MB allowed.")
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${fileExt}`
      const filePath = `hotels/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filePath)

      form.setValue("image", publicUrl)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error(error)
      toast.error("Image upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = async () => {
    if (!form.getValues("image")) return
    
    setImageIsDeleting(true)
    try {
      const imageUrl = form.getValues("image")
      const imagePath = imageUrl.split('/').pop()?.split('?')[0] || ""
      
      if (imagePath) {
        const { error } = await supabase.storage
          .from("images")
          .remove([`hotels/${imagePath}`])
        
        if (error) throw error
      }
      
      form.setValue("image", "")
      toast.success("Image removed successfully")
    } catch (error) {
      console.error(error)
      toast.error("Image deletion failed")
    } finally {
      setImageIsDeleting(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save a hotel");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const payload = {
        ...values,
        userId: session.user.id, // optional if backend attaches it
      };
  
      console.log("Form payload:", payload); // Debugging
  
      let response;
      if (hotel) {
        // UPDATE hotel
        response = await axios.put(`/api/hotel/${hotel.id}`, payload);

      } else {
        // CREATE hotel
        response = await axios.post("/api/hotel", payload);
      }
  
      toast.success(hotel ? `Hotel updated successfully: ${response}` : "Hotel created successfully");
  
      // Optional redirect
      // window.location.href = "/dashboard/hotels";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).response?.data || "An error occurred while saving the hotel";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteHotel(hotelId: string) {
    try {
      await axios.delete(`/api/hotel/${hotelId}`);
      toast.success("Hotel deleted successfully");
      // router.push("/dashboard/hotels");
    } catch (error) {
      console.error("Delete error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any).response?.data || "Failed to delete hotel");
    }
  }

  

  return (
    <div className="container max-w-6xl py-8">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">
            {hotel ? "Update Hotel" : "Add New Hotel"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Hotel Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Hotel Title *</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          The official name of your hotel
                        </FormDescription>
                        <FormControl>
                          <Input 
                            placeholder="Grand Hyatt Hotel" 
                            {...field} 
                            className="mt-1"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Hotel Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Description *</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Describe your hotel&apos;s unique features and atmosphere
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Located in the heart of the city with stunning views..."
                            {...field}
                            className="mt-1 min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Amenities */}
                  <div>
                    <FormLabel className="text-sm font-medium">Amenities</FormLabel>
                    <FormDescription className="text-xs text-muted-foreground mb-3">
                      Select amenities available at your property
                    </FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: "gym", label: "Gym" },
                        { name: "spa", label: "Spa" },
                        { name: "swimmingPool", label: "Swimming Pool" },
                        { name: "restaurant", label: "Restaurant" },
                        { name: "bar", label: "Bar" },
                        { name: "shopping", label: "Shopping" },
                      ].map((amenity) => (
                        <FormField
                          key={amenity.name}
                          control={form.control}
                          name={amenity.name as keyof typeof formSchema.shape}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Switch
                                  checked={field.value as boolean}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {amenity.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Hotel Image */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Featured Image *</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Upload a high-quality image that represents your hotel
                        </FormDescription>
                        {field.value ? (
                          <div className="relative mt-2 rounded-lg overflow-hidden border">
                            <div className="aspect-video bg-muted/50 flex items-center justify-center">
                              <Image
                                src={field.value}
                                alt="Hotel preview"
                                width={600}
                                height={400}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={handleImageDelete}
                              disabled={imageIsDeleting}
                            >
                              {imageIsDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <label
                              htmlFor="image-upload"
                              className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary transition-colors cursor-pointer"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                <UploadCloud className="h-10 w-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  JPG, PNG, or WEBP (Max. 5MB)
                                </p>
                              </div>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </label>
                            {isUploading && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading image...
                              </div>
                            )}
                          </div>
                        )}
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Location Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">City *</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Sub-City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Manhattan" {...field} />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location Description */}
                  <FormField
                    control={form.control}
                    name="locationDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Location Details *</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground">
                          Describe the neighborhood and nearby attractions
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Located on 5th Avenue, just 2 blocks from Central Park..."
                            {...field}
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
            
              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch gap-3 pt-4 border-t">
  {/* Left-aligned buttons (mobile: bottom) */}
  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
    {hotel && (
      <div className="flex flex-row gap-2">
        <ViewHotelModal hotel={hotel}>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <span className="sr-only sm:not-sr-only">View</span>
            <Eye className="sm:mr-2 h-4 w-4" />
          </Button>
        </ViewHotelModal>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 sm:flex-none"
            >
              <span className="sr-only sm:not-sr-only">Add Room</span>
              <Plus className="sm:mr-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Room to {hotel.title}</DialogTitle>
            </DialogHeader>
            <AddRoomForm hotelId={hotel.id} />
          </DialogContent>
        </Dialog>
      </div>
    )}
  </div>

  {/* Right-aligned buttons (mobile: top) */}
  <div className="flex flex-col-reverse xs:flex-row gap-2 justify-end">
    {/* Delete Button */}
    {hotel && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <span className="sr-only xs:not-sr-only">Delete</span>
            <Trash2 className="xs:mr-2 h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-pretty">
              This will permanently delete {hotel.title} and all associated rooms.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteHotel(hotel.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )}

    {/* Cancel/Submit Buttons */}
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => window.history.back()}
        disabled={isLoading}
        className="flex-1 xs:flex-none"
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        size="sm"
        disabled={isLoading || !session?.user?.id || isUploading}
        className="flex-1 xs:flex-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="sr-only xs:not-sr-only">
              {hotel ? "Updating..." : "Creating..."}
            </span>
          </>
        ) : hotel ? (
          "Update Hotel"
        ) : (
          "Create Hotel"
        )}
      </Button>
    </div>
  </div>
</div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddHotelForm