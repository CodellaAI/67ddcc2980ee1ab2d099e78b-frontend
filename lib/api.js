
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: `${API_URL}/api`,
})

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const fetchUserProfile = async (username) => {
  const response = await api.get(`/users/${username}`)
  return response.data
}

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData)
  return response.data
}

export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`)
  return response.data
}

export const unfollowUser = async (userId) => {
  const response = await api.post(`/users/${userId}/unfollow`)
  return response.data
}

// Tweet API
export const createTweet = async (content, replyTo = null) => {
  const payload = { content }
  if (replyTo) payload.replyTo = replyTo
  
  const response = await api.post('/tweets', payload)
  return response.data
}

export const fetchTimeline = async () => {
  const response = await api.get('/tweets/timeline')
  return response.data
}

export const fetchTweet = async (tweetId) => {
  const response = await api.get(`/tweets/${tweetId}`)
  return response.data
}

export const fetchTweetReplies = async (tweetId) => {
  const response = await api.get(`/tweets/${tweetId}/replies`)
  return response.data
}

export const fetchUserTweets = async (username) => {
  const response = await api.get(`/users/${username}/tweets`)
  return response.data
}

export const likeTweet = async (tweetId) => {
  const response = await api.post(`/tweets/${tweetId}/like`)
  return response.data
}

export const unlikeTweet = async (tweetId) => {
  const response = await api.post(`/tweets/${tweetId}/unlike`)
  return response.data
}

export const retweet = async (tweetId) => {
  const response = await api.post(`/tweets/${tweetId}/retweet`)
  return response.data
}

export const unretweet = async (tweetId) => {
  const response = await api.post(`/tweets/${tweetId}/unretweet`)
  return response.data
}

// Explore API
export const fetchExplore = async () => {
  const response = await api.get('/tweets/explore')
  return response.data
}

export const searchTweets = async (query) => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`)
  return response.data
}

// Notifications API
export const fetchNotifications = async () => {
  const response = await api.get('/notifications')
  return response.data
}

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.post(`/notifications/${notificationId}/read`)
  return response.data
}

// Trends and suggestions
export const fetchTrends = async () => {
  const response = await api.get('/trends')
  return response.data
}

export const fetchSuggestedUsers = async () => {
  const response = await api.get('/users/suggestions')
  return response.data
}

export default api
