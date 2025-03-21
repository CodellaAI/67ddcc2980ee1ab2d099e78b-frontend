
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layouts/MainLayout'
import { useAuth } from '@/lib/AuthContext'
import { updateProfile, fetchUserProfile } from '@/lib/api'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

export default function EditProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    profileImage: ''
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const userData = await fetchUserProfile(user.username)
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          profileImage: userData.profileImage || ''
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await updateProfile(formData)
      toast.success('Profile updated successfully')
      router.push(`/profile/${user.username}`)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
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

  return (
    <MainLayout>
      <div className="border-b border-extraLightGray">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/profile/${user?.username}`} className="p-2 rounded-full hover:bg-extraLightGray">
              <FaArrowLeft />
            </Link>
            <h1 className="text-xl font-bold">Edit profile</h1>
          </div>
          
          <button
            type="submit"
            form="profile-form"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div className="h-48 bg-primary w-full"></div>
        <div className="absolute -bottom-16 left-4">
          <Image 
            src={formData.profileImage || 'https://via.placeholder.com/120'} 
            alt={formData.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-white"
          />
        </div>
      </div>
      
      <div className="mt-20 p-4">
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              maxLength={50}
              required
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
              rows={3}
              maxLength={160}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              maxLength={30}
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL
            </label>
            <input
              id="profileImage"
              name="profileImage"
              type="url"
              value={formData.profileImage}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
