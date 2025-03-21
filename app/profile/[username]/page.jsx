
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MainLayout from '@/components/layouts/MainLayout'
import TweetList from '@/components/tweets/TweetList'
import { fetchUserProfile, fetchUserTweets, followUser, unfollowUser } from '@/lib/api'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { FaCalendarAlt, FaMapMarkerAlt, FaLink, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '@/lib/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

export default function Profile() {
  const { username } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const userData = await fetchUserProfile(username)
        setProfile(userData)
        
        const userTweets = await fetchUserTweets(username)
        setTweets(userTweets)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  const handleFollow = async () => {
    try {
      setFollowLoading(true)
      await followUser(profile._id)
      setProfile({
        ...profile,
        isFollowing: true,
        followers: profile.followers + 1
      })
      toast.success(`You are now following ${profile.name}`)
    } catch (error) {
      console.error('Error following user:', error)
      toast.error('Failed to follow user. Please try again.')
    } finally {
      setFollowLoading(false)
    }
  }

  const handleUnfollow = async () => {
    try {
      setFollowLoading(true)
      await unfollowUser(profile._id)
      setProfile({
        ...profile,
        isFollowing: false,
        followers: profile.followers - 1
      })
      toast.success(`You unfollowed ${profile.name}`)
    } catch (error) {
      console.error('Error unfollowing user:', error)
      toast.error('Failed to unfollow user. Please try again.')
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center p-8">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">User not found</h2>
          <p className="text-gray-600 mt-2">The user you're looking for doesn't exist</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="border-b border-extraLightGray">
        <div className="p-4 flex items-center gap-4">
          <Link href="/home" className="p-2 rounded-full hover:bg-extraLightGray">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-gray-500 text-sm">{tweets.length} Chirps</p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="h-48 bg-primary w-full"></div>
        <div className="absolute -bottom-16 left-4">
          <Image 
            src={profile.profileImage || 'https://via.placeholder.com/120'} 
            alt={profile.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-white"
          />
        </div>
        
        <div className="flex justify-end p-4">
          {user && user._id !== profile._id && (
            profile.isFollowing ? (
              <button 
                onClick={handleUnfollow}
                disabled={followLoading}
                className="btn-secondary"
              >
                {followLoading ? 'Processing...' : 'Unfollow'}
              </button>
            ) : (
              <button 
                onClick={handleFollow}
                disabled={followLoading}
                className="btn-primary"
              >
                {followLoading ? 'Processing...' : 'Follow'}
              </button>
            )
          )}
          
          {user && user._id === profile._id && (
            <Link href="/profile/edit" className="btn-secondary">
              Edit profile
            </Link>
          )}
        </div>
      </div>
      
      <div className="mt-16 p-4">
        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-gray-500">@{profile.username}</p>
        
        {profile.bio && (
          <p className="mt-3">{profile.bio}</p>
        )}
        
        <div className="flex flex-wrap gap-4 mt-3 text-gray-500">
          {profile.location && (
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt />
              <span>{profile.location}</span>
            </div>
          )}
          
          {profile.website && (
            <div className="flex items-center gap-1">
              <FaLink />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <FaCalendarAlt />
            <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
          </div>
        </div>
        
        <div className="flex gap-4 mt-3">
          <div>
            <span className="font-bold">{profile.following}</span>{' '}
            <span className="text-gray-500">Following</span>
          </div>
          <div>
            <span className="font-bold">{profile.followers}</span>{' '}
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-extraLightGray mt-4">
        <h3 className="text-lg font-bold p-4 border-b border-extraLightGray">Chirps</h3>
        {tweets.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No chirps yet
          </div>
        ) : (
          <TweetList tweets={tweets} />
        )}
      </div>
    </MainLayout>
  )
}
