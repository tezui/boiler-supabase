import React, { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        navigate('/signin')
      }
    }
    fetchUser()
  }, [navigate])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/signin')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex justify-center mb-4">
          <User className="h-20 w-20 text-blue-500" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <p className="text-gray-700">{user.user_metadata.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <p className="text-gray-700">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Join Date</label>
          <p className="text-gray-700">{new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Profile