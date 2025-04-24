export interface Suggestion {
  id: string;
  sourceName: string;
  sourceAddress: string;
  suggestedOutletName: string;
  suggestedAddress: string;
  matchScore: number;
  geoDistance: number;
  matchCategory: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected" | "Flagged";
  marketId: string;
  createdAt: string;
  lastUpdatedAt: string;
  lastUpdatedBy?: string;
  comments?: Comment[];
  dqMetrics: {
    semanticSimilarityScore: number;
    nullFieldsRatio: number;
    patternConsistencyIndex: number;
    overallDqScore: number;
  };
  salesContribution?: {
    value: number;
    volume: number;
    rank: number;
    isHighValue: boolean;
  };
  geoLocation?: GeoLocation;
  revenueShare?: {
    percentage: number;
    monthlyAverage: number;
    yearlyTotal: number;
    trend: "up" | "down" | "stable";
  };
}

export interface Comment {
  id: string;
  text: string;
  reasonCode?: string;
  createdAt: string;
  createdBy: string;
}

export interface Market {
  id: string;
  name: string;
}

export interface DashboardMetrics {
  dqStatistics: {
    avgSemanticSimilarity: number;
    highDqPercentage: number;
    lowDqFlaggedPercentage: number;
    finalizedRatio: number;
  };
  feedbackStatistics: {
    approvedPercentage: number;
    rejectedPercentage: number;
    resuggestedPercentage: number;
    validatedPercentage: number;
    avgTimeToFeedback: number;
    avgTimeToFinalization: number;
  };
  marketBreakdown: {
    marketId: string;
    marketName: string;
    totalSuggestions: number;
    approved: number;
    rejected: number;
    pending: number;
    flagged: number;
  }[];
  timelineData: {
    date: string;
    approved: number;
    rejected: number;
    flagged: number;
    resuggested: number;
  }[];
  reviewerStats: {
    activeReviewers: number;
    reviewsByUser: {
      userId: string;
      userName: string;
      reviewCount: number;
    }[];
  };
}

export interface GeoLocation {
  sourceLatitude: number;
  sourceLongitude: number;
  suggestedLatitude: number;
  suggestedLongitude: number;
}

const markets: Market[] = [
  { id: "m1", name: "United States" },
  { id: "m2", name: "United Kingdom" },
  { id: "m3", name: "Germany" },
  { id: "m4", name: "France" },
  { id: "m5", name: "Japan" },
];

const generateMockSuggestions = (count: number): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const statuses: ("Pending" | "Approved" | "Rejected" | "Flagged")[] = [
    "Pending",
    "Approved",
    "Rejected",
    "Flagged",
  ];
  
  for (let i = 0; i < count; i++) {
    const matchScore = Math.random();
    let matchCategory: "High" | "Medium" | "Low";
    
    if (matchScore > 0.8) {
      matchCategory = "High";
    } else if (matchScore > 0.5) {
      matchCategory = "Medium";
    } else {
      matchCategory = "Low";
    }
    
    const geoDistance = Math.random() * 10;
    const randomMarket = markets[Math.floor(Math.random() * markets.length)];
    const rank = Math.floor(Math.random() * 100) + 1;
    
    suggestions.push({
      id: `sugg-${i + 1}`,
      sourceName: `Source Outlet ${i + 1}`,
      sourceAddress: `${Math.floor(Math.random() * 1000) + 1} Main St, City ${i + 1}, State`,
      suggestedOutletName: `Suggested Outlet ${i + 1}`,
      suggestedAddress: `${Math.floor(Math.random() * 1000) + 1} Main St, City ${i + 1}, State`,
      matchScore,
      geoDistance,
      matchCategory,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      marketId: randomMarket.id,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      lastUpdatedAt: new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)).toISOString(),
      lastUpdatedBy: Math.random() > 0.5 ? "John Doe" : undefined,
      comments: Math.random() > 0.7 ? [
        {
          id: `comment-${i}-1`,
          text: "This match needs further review due to inconsistent address format.",
          reasonCode: "Incomplete Data",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(),
          createdBy: "Jane Smith"
        }
      ] : [],
      dqMetrics: {
        semanticSimilarityScore: Math.random(),
        nullFieldsRatio: Math.random() * 0.5,
        patternConsistencyIndex: Math.random() * 0.8 + 0.2,
        overallDqScore: Math.random() * 0.8 + 0.2
      },
      salesContribution: {
        value: Math.floor(Math.random() * 1000000),
        volume: Math.floor(Math.random() * 5000),
        rank: rank,
        isHighValue: rank <= 20 // Top 20 are high value
      },
      geoLocation: {
        sourceLatitude: (Math.random() * 170) - 85, // -85 to 85
        sourceLongitude: (Math.random() * 360) - 180, // -180 to 180
        suggestedLatitude: (Math.random() * 170) - 85 + (Math.random() * 0.05 - 0.025), // slight variation
        suggestedLongitude: (Math.random() * 360) - 180 + (Math.random() * 0.05 - 0.025), // slight variation
      },
      revenueShare: {
        percentage: Math.random() * 15 + 5, // 5-20% revenue share
        monthlyAverage: Math.random() * 50000 + 10000, // $10k-60k monthly
        yearlyTotal: Math.random() * 600000 + 120000, // $120k-720k yearly
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable"
      }
    });
  }
  
  return suggestions;
};

const mockSuggestions = generateMockSuggestions(50);

const generateMockDashboardMetrics = (): DashboardMetrics => {
  const totalSuggestions = mockSuggestions.length;
  const approved = mockSuggestions.filter(s => s.status === "Approved").length;
  const rejected = mockSuggestions.filter(s => s.status === "Rejected").length;
  const flagged = mockSuggestions.filter(s => s.status === "Flagged").length;
  const resuggested = Math.floor(Math.random() * 10);
  const finalized = approved + rejected;
  
  const marketBreakdown = markets.map(market => {
    const marketSuggestions = mockSuggestions.filter(s => s.marketId === market.id);
    return {
      marketId: market.id,
      marketName: market.name,
      totalSuggestions: marketSuggestions.length,
      approved: marketSuggestions.filter(s => s.status === "Approved").length,
      rejected: marketSuggestions.filter(s => s.status === "Rejected").length,
      pending: marketSuggestions.filter(s => s.status === "Pending").length,
      flagged: marketSuggestions.filter(s => s.status === "Flagged").length,
    };
  });
  
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      approved: Math.floor(Math.random() * 10),
      rejected: Math.floor(Math.random() * 8),
      flagged: Math.floor(Math.random() * 5),
      resuggested: Math.floor(Math.random() * 3),
    };
  });
  
  return {
    dqStatistics: {
      avgSemanticSimilarity: mockSuggestions.reduce((sum, s) => sum + s.dqMetrics.semanticSimilarityScore, 0) / totalSuggestions,
      highDqPercentage: mockSuggestions.filter(s => s.dqMetrics.overallDqScore > 0.7).length / totalSuggestions,
      lowDqFlaggedPercentage: mockSuggestions.filter(s => s.dqMetrics.overallDqScore < 0.4).length / totalSuggestions,
      finalizedRatio: finalized / totalSuggestions,
    },
    feedbackStatistics: {
      approvedPercentage: approved / totalSuggestions,
      rejectedPercentage: rejected / totalSuggestions,
      resuggestedPercentage: resuggested / totalSuggestions,
      validatedPercentage: finalized / totalSuggestions,
      avgTimeToFeedback: 2.3,
      avgTimeToFinalization: 4.7,
    },
    marketBreakdown,
    timelineData,
    reviewerStats: {
      activeReviewers: 5,
      reviewsByUser: [
        { userId: "1", userName: "John Doe", reviewCount: 45 },
        { userId: "2", userName: "Jane Smith", reviewCount: 32 },
        { userId: "3", userName: "Bob Johnson", reviewCount: 28 },
        { userId: "4", userName: "Alice Brown", reviewCount: 21 },
        { userId: "5", userName: "Charlie Davis", reviewCount: 15 },
      ],
    },
  };
};

const mockDashboardMetrics = generateMockDashboardMetrics();

export const fetchSuggestions = async (
  filters?: {
    status?: string;
    matchCategory?: string;
    searchTerm?: string;
    market?: string;
  }
): Promise<Suggestion[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filteredSuggestions = [...mockSuggestions];
  
  if (filters) {
    if (filters.status) {
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.status === filters.status
      );
    }
    
    if (filters.matchCategory) {
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.matchCategory === filters.matchCategory
      );
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredSuggestions = filteredSuggestions.filter(
        (s) =>
          s.sourceName.toLowerCase().includes(term) ||
          s.suggestedOutletName.toLowerCase().includes(term) ||
          s.sourceAddress.toLowerCase().includes(term) ||
          s.suggestedAddress.toLowerCase().includes(term)
      );
    }
    
    if (filters.market) {
      filteredSuggestions = filteredSuggestions.filter(
        (s) => s.marketId === filters.market
      );
    }
  }
  
  return filteredSuggestions;
};

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return mockDashboardMetrics;
};

export const updateSuggestionStatus = async (
  id: string,
  status: "Approved" | "Rejected" | "Flagged" | "Pending"
): Promise<Suggestion> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const suggestionIndex = mockSuggestions.findIndex((s) => s.id === id);
  
  if (suggestionIndex === -1) {
    throw new Error("Suggestion not found");
  }
  
  mockSuggestions[suggestionIndex] = {
    ...mockSuggestions[suggestionIndex],
    status,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedBy: "Current User"
  };
  
  return mockSuggestions[suggestionIndex];
};

export const addComment = async (
  suggestionId: string,
  commentText: string,
  reasonCode?: string
): Promise<Comment> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const suggestionIndex = mockSuggestions.findIndex((s) => s.id === suggestionId);
  
  if (suggestionIndex === -1) {
    throw new Error("Suggestion not found");
  }
  
  const newComment: Comment = {
    id: `comment-${suggestionId}-${Date.now()}`,
    text: commentText,
    reasonCode,
    createdAt: new Date().toISOString(),
    createdBy: "Current User"
  };
  
  if (!mockSuggestions[suggestionIndex].comments) {
    mockSuggestions[suggestionIndex].comments = [];
  }
  
  mockSuggestions[suggestionIndex].comments!.push(newComment);
  mockSuggestions[suggestionIndex].lastUpdatedAt = new Date().toISOString();
  mockSuggestions[suggestionIndex].lastUpdatedBy = "Current User";
  
  return newComment;
};

export const getMarkets = async (): Promise<Market[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return markets;
};
