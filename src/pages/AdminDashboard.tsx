import React, { useEffect, useState } from 'react'
import { Users, Activity, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.user_metadata.role !== 'admin') {
        navigate('/signin')
        return
      }

      // Fetch actual stats from Supabase
      const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact' })
      const { count: activeUsers } = await supabase.from('users').select('*', { count: 'exact' }).eq('status', 'active')
      const { data: revenueData } = await supabase.from('transactions').select('amount').eq('status', 'completed')

      const revenue = revenueData ? revenueData.reduce((sum, transaction) => sum + transaction.amount, 0) : 0

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        revenue: revenue || 0,
      })
    }

    fetchStats()
  }, [navigate])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <p className="text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-yellow-500 mr-4" />
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard