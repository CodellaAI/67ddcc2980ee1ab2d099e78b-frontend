
'use client'
import { useState, useEffect } from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import { fetchNotifications, markNotificationAsRead } from '@/lib/api'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { FaHeart, FaRetweet, FaAt, FaUser } from 'react-icons/fa'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        const fetchedNotifications = await fetchNotifications()
        setNotifications(fetchedNotifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        toast.error('Failed to load notifications. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to update notification')
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />
      case 'retweet':
        return <FaRetweet className="text-green-500" />
      case 'mention':
        return <FaAt className="text-primary" />
      case 'follow':
        return <FaUser className="text-purple-500" />
      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="border-b border-extraLightGray pb-3">
        <h1 className="text-xl font-bold p-4">Notifications</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          You have no notifications
        </div>
      ) : (
        <div className="divide-y divide-extraLightGray">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => !notification.read && handleMarkAsRead(notification._id)}
            >
              <div className="mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${notification.sender.username}`}>
                    <Image 
                      src={notification.sender.profileImage || 'https://via.placeholder.com/40'} 
                      alt={notification.sender.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </Link>
                  
                  <div>
                    <Link href={`/profile/${notification.sender.username}`} className="font-bold hover:underline">
                      {notification.sender.name}
                    </Link>
                    <p className="text-gray-600">{notification.message}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {format(new Date(notification.createdAt), 'MMM d, yyyy · h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}
