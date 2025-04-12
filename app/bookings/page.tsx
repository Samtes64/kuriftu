'use client'
// app/dashboard/bookings/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@prisma/client';
import { format, isWithinInterval } from 'date-fns';
import { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookingWithDetails extends Booking {
  Room: {
    title: string;
    image: string;
  };
  Hotel: {
    title: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const isBookingActive = (startDate: Date, endDate: Date) => {
    const today = new Date();
    return isWithinInterval(today, {
      start: new Date(startDate),
      end: new Date(endDate)
    });
  };

  const handleRowClick = (booking: BookingWithDetails) => {
    if (isBookingActive(booking.startDate, booking.endDate)) {
      router.push(`/access-room/${booking.roomId}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            {bookings.length} total bookings
          </p>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Hotel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => {
                      const isActive = isBookingActive(booking.startDate, booking.endDate);
                      return (
                        <tr 
                          key={booking.id} 
                          className={`hover:bg-muted/50 ${isActive ? 'cursor-pointer hover:bg-primary/5' : ''}`}
                          onClick={() => handleRowClick(booking)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{booking.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.Room.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.Hotel.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                              {format(new Date(booking.startDate), 'MMM d')} -{' '}
                              {format(new Date(booking.endDate), 'MMM d, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ETB {booking.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isActive ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="outline">Completed</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-muted-foreground">
                        You don&apos;t have any bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}