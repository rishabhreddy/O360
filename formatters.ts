
import { format } from "date-fns";

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Invalid date format:", error);
    return "Invalid date";
  }
};

export const formatDistance = (distance: number): string => {
  if (distance < 0.1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`;
};

export const getConfidenceColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case "high":
      return "bg-green-600 text-white";
    case "medium":
      return "bg-amber-600 text-white";
    case "low":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    case "flagged":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "pending":
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getDQScoreColor = (score: number): string => {
  if (score >= 0.8) {
    return "bg-green-500";
  } else if (score >= 0.6) {
    return "bg-amber-500";
  } else {
    return "bg-red-500";
  }
};
