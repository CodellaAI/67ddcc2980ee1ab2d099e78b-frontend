
import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { createTweet } from '@/lib/api'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { FaImage, FaSmile, FaPoll, FaCalendarAlt } from 'react-icons/fa'

export default function TweetForm({ onTweetCreated, replyTo = null, placeholder = "What's happening?" }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('Your chirp cannot be empty')
      return
    }
    
    try {
      setLoading(true)
      const newTweet = await createTweet(content, replyTo)
      setContent('')
      onTweetCreated(newTweet)
      toast.success(replyTo ? 'Reply posted!' : 'Chirp posted!')
    } catch (error) {
      console.error('Error creating tweet:', error)
      toast.error('Failed to post your chirp. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border-b border-extraLightGray">
      <div className="flex">
        <div className="mr-3">
          <Image 
            src={user?.profileImage || 'https://via.placeholder.com/40'} 
            alt={user?.name || 'User'} 
            width={48} 
            height={48} 
            className="rounded-full"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none border-none focus:outline-none text-lg min-h-[80px]"
            maxLength={280}
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex text-primary">
              <button type="button" className="mr-2 p-2 rounded-full hover:bg-blue-50">
                <FaImage />
              </button>
              <button type="button" className="mr-2 p-2 rounded-full hover:bg-blue-50">
                <FaSmile />
              </button>
              <button type="button" className="mr-2 p-2 rounded-full hover:bg-blue-50">
                <FaPoll />
              </button>
              <button type="button" className="mr-2 p-2 rounded-full hover:bg-blue-50">
                <FaCalendarAlt />
              </button>
            </div>
            
            <div className="flex items-center">
              {content.length > 0 && (
                <div className={`mr-3 text-sm ${content.length > 260 ? 'text-red-500' : 'text-gray-500'}`}>
                  {280 - content.length}
                </div>
              )}
              
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !content.trim()}
              >
                {loading ? 'Posting...' : replyTo ? 'Reply' : 'Chirp'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
