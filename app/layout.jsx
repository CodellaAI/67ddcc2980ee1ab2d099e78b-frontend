
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chirp Social - Connect and Share',
  description: 'A modern social media platform to connect with friends and share your thoughts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen`}>
        <AuthProvider>
          {children}
          <ToastContainer position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
