"use client";

import { UserStatsData } from "@/types/adminUser";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import AdminMetricCard from "@/components/AdminShared/AdminMetricCard";

interface Props {
  stats: UserStatsData;
}

export default function UserStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminMetricCard
        title="Total Registered Users"
        value={stats.totalUsers || 0}
        growth={stats.usersGrowth || 0}
        comparison="vs last month"
        icon={Users}
        variant="primary"
      />
      <AdminMetricCard
        title="Active Platform Users"
        value={stats.activeUsers || 0}
        growth={stats.activeGrowth || 0}
        comparison="active accounts"
        icon={UserCheck}
        variant="emerald"
      />
      <AdminMetricCard
        title="Blocked / Suspended"
        value={stats.blockedUsers || 0}
        growth={stats.blockedChange || 0}
        comparison="restricted"
        icon={UserX}
        variant="slate"
      />
      <AdminMetricCard
        title="New Registrations Today"
        value={`+${stats.newUsersToday || 0}`}
        growth={stats.todayGrowth || 0}
        comparison="today"
        icon={UserPlus}
        variant="violet"
      />
    </div>
  );
}

