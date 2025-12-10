import { UserProfile } from "@/types";

export const mockUsers: UserProfile[] = [
  {
    _id: "U001",
    id: "U001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    type: "user",
    role: "User",
    isVerified: true,
    twoFactorEnabled: false,
    registeredDate: "2023-06-15",
    lastLogin: "2024-01-20",
    reportsCount: 12
  },
  {
    _id: "U002",
    id: "U002",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43211",
    type: "user",
    role: "User",
    isVerified: true,
    twoFactorEnabled: false,
    registeredDate: "2023-07-20",
    lastLogin: "2024-01-19",
    reportsCount: 8
  },
  {
    _id: "U003",
    id: "U003",
    name: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91 98765 43212",
    type: "user",
    role: "User",
    isVerified: true,
    twoFactorEnabled: false,
    registeredDate: "2023-05-10",
    lastLogin: "2023-12-15",
    reportsCount: 5
  },
  {
    _id: "U004",
    id: "U004",
    name: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91 98765 43213",
    type: "admin",
    role: "Administrator",
    isVerified: true,
    twoFactorEnabled: false,
    registeredDate: "2023-01-05",
    lastLogin: "2024-01-20",
    reportsCount: 0
  },
  {
    _id: "U005",
    id: "U005",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 98765 43214",
    type: "user",
    role: "User",
    isVerified: true,
    twoFactorEnabled: false,
    registeredDate: "2023-08-30",
    lastLogin: "2024-01-18",
    reportsCount: 15
  },
];

