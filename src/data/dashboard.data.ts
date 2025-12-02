import { Users, FileText, CreditCard, AlertCircle } from "lucide-react";

export const dashboardStats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    description: "Active registered users",
    color: "text-blue-600",
    icon: Users
  },
  {
    title: "Credit Reports",
    value: "15,234",
    change: "+8.2%",
    trend: "up",
    description: "Reports generated this month",
    color: "text-purple-600",
    icon: FileText
  },
  {
    title: "Active Loans",
    value: "₹2.4 Cr",
    change: "+5.1%",
    trend: "up",
    description: "Total active loan amount",
    color: "text-green-600",
    icon: CreditCard
  },
  {
    title: "Disputes",
    value: "342",
    change: "-3.2%",
    trend: "down",
    description: "Pending dispute requests",
    color: "text-orange-600",
    icon: AlertCircle
  }
];

export const monthlyTrendsData = [
  { month: 'Jan', users: 1200, reports: 3200, disputes: 45 },
  { month: 'Feb', users: 1500, reports: 3800, disputes: 52 },
  { month: 'Mar', users: 1800, reports: 4200, disputes: 48 },
  { month: 'Apr', users: 2100, reports: 4800, disputes: 55 },
  { month: 'May', users: 2400, reports: 5200, disputes: 42 },
  { month: 'Jun', users: 2700, reports: 5800, disputes: 38 },
];

export const creditScoreDistributionData = [
  { range: '300-500', count: 450 },
  { range: '501-600', count: 1200 },
  { range: '601-700', count: 2800 },
  { range: '701-800', count: 1500 },
  { range: '801-850', count: 350 },
];

export const recentActivityData = [
  { action: "New user registration", user: "John Doe", time: "2 minutes ago", type: "success" },
  { action: "Credit report generated", user: "Jane Smith", time: "15 minutes ago", type: "info" },
  { action: "Dispute submitted", user: "Robert Johnson", time: "1 hour ago", type: "warning" },
  { action: "Account verified", user: "Sarah Williams", time: "2 hours ago", type: "success" },
];

