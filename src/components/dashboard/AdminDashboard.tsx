"use client";

import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  MessageSquare,
  Settings,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 ${trendUp ? "text-green-400" : "text-red-400"}`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface ChartBarProps {
  label: string;
  value: number;
  max: number;
}

function ChartBar({ label, value, max }: ChartBarProps) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, Admin!
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your platform today.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Requests"
            value="12,456"
            icon={<Activity size={24} />}
            trend="12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Active Users"
            value="3,842"
            icon={<Users size={24} />}
            trend="8% increase"
            trendUp={true}
          />
          <StatCard
            title="Pending Tasks"
            value="48"
            icon={<Clock size={24} />}
            trend="5 due today"
            trendUp={false}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Performance</h2>
              <TrendingUp className="text-amber-500" size={20} />
            </div>
            <div className="space-y-4">
              <ChartBar label="SMS Sent" value={8500} max={10000} />
              <ChartBar label="Delivery Rate" value={9200} max={10000} />
              <ChartBar label="Success Rate" value={9800} max={10000} />
              <ChartBar label="API Calls" value={7600} max={10000} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <MessageSquare className="text-amber-500" size={20} />
            </div>
            <div className="space-y-4">
              {[
                {
                  user: "John Doe",
                  action: "Sent 500 SMS",
                  time: "2 hours ago",
                },
                {
                  user: "Jane Smith",
                  action: "Created new campaign",
                  time: "4 hours ago",
                },
                {
                  user: "Mike Johnson",
                  action: "Updated settings",
                  time: "6 hours ago",
                },
                {
                  user: "Sarah Williams",
                  action: "Viewed reports",
                  time: "8 hours ago",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-4 border-b border-gray-700 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-400">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Monthly Overview</h2>
              <button className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors">
                View Details →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Messages", value: "45.2K", change: "+12%" },
                { label: "Revenue", value: "$12.5K", change: "+8%" },
                { label: "Customers", value: "1.2K", change: "+5%" },
                { label: "Conversion", value: "3.2%", change: "+2%" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-green-400 mt-2">{stat.change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all hover:shadow-lg hover:shadow-amber-500/40">
                Send Campaign
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all border border-gray-600 hover:border-amber-500/50">
                View Reports
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all border border-gray-600 hover:border-amber-500/50">
                Manage Users
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all border border-gray-600 hover:border-amber-500/50 flex items-center justify-center gap-2">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
