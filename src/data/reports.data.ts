import { CreditReport } from "@/types";

export const mockReports: CreditReport[] = [
  {
    id: "CR-2024-001234",
    userId: "U001",
    userName: "Rajesh Kumar",
    pan: "ABCDE1234F",
    creditScore: 750,
    status: "Active",
    generatedDate: "2024-01-15",
    lastUpdated: "2024-01-20"
  },
  {
    id: "CR-2024-001235",
    userId: "U002",
    userName: "Priya Sharma",
    pan: "FGHIJ5678K",
    creditScore: 680,
    status: "Active",
    generatedDate: "2024-01-14",
    lastUpdated: "2024-01-19"
  },
  {
    id: "CR-2024-001236",
    userId: "U003",
    userName: "Amit Patel",
    pan: "LMNOP9012Q",
    creditScore: 820,
    status: "Active",
    generatedDate: "2024-01-13",
    lastUpdated: "2024-01-18"
  },
  {
    id: "CR-2024-001237",
    userId: "U004",
    userName: "Sneha Reddy",
    pan: "RSTUV3456W",
    creditScore: 590,
    status: "Pending",
    generatedDate: "2024-01-12",
    lastUpdated: "2024-01-17"
  },
  {
    id: "CR-2024-001238",
    userId: "U005",
    userName: "Vikram Singh",
    pan: "XYZAB7890C",
    creditScore: 710,
    status: "Active",
    generatedDate: "2024-01-11",
    lastUpdated: "2024-01-16"
  },
];

