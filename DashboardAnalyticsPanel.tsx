
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DashboardMetrics, fetchDashboardMetrics } from '@/services/mockData';
import { BarChart, TrendingUp, Users } from 'lucide-react';
import { formatPercentage } from '@/utils/formatters';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardAnalyticsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMetrics();
  }, []);
  
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dashboard & Analytics</CardTitle>
          <CardDescription>Loading dashboard metrics...</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!metrics) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dashboard & Analytics</CardTitle>
          <CardDescription>Failed to load metrics data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load dashboard metrics. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { dqStatistics, feedbackStatistics, marketBreakdown, timelineData } = metrics;
  
  // Prepare data for Market Breakdown pie chart
  const marketPieData = marketBreakdown.map(market => ({
    name: market.marketName,
    value: market.totalSuggestions,
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Prepare data for Feedback Status pie chart
  const feedbackStatusData = [
    { name: 'Approved', value: feedbackStatistics.approvedPercentage },
    { name: 'Rejected', value: feedbackStatistics.rejectedPercentage },
    { name: 'Resuggested', value: feedbackStatistics.resuggestedPercentage },
    { name: 'Pending', value: 1 - feedbackStatistics.approvedPercentage - feedbackStatistics.rejectedPercentage - feedbackStatistics.resuggestedPercentage },
  ];
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5" />
          Dashboard & Analytics
        </CardTitle>
        <CardDescription>Overall statistics and metrics for the harmonization process</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dq">Data Quality</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Data Quality</span>
                        <span className="text-sm font-medium">{formatPercentage(dqStatistics.avgSemanticSimilarity)}</span>
                      </div>
                      <Progress value={dqStatistics.avgSemanticSimilarity * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Finalization Rate</span>
                        <span className="text-sm font-medium">{formatPercentage(dqStatistics.finalizedRatio)}</span>
                      </div>
                      <Progress value={dqStatistics.finalizedRatio * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Approval Rate</span>
                        <span className="text-sm font-medium">{formatPercentage(feedbackStatistics.approvedPercentage)}</span>
                      </div>
                      <Progress value={feedbackStatistics.approvedPercentage * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Feedback Status</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {feedbackStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activity Timeline (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="approved" stroke="#4ade80" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="rejected" stroke="#f87171" />
                    <Line type="monotone" dataKey="flagged" stroke="#fbbf24" />
                    <Line type="monotone" dataKey="resuggested" stroke="#60a5fa" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dq">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                  Avg. Semantic Similarity
                </h3>
                <p className="text-2xl font-bold mt-2">{formatPercentage(dqStatistics.avgSemanticSimilarity)}</p>
                <Progress value={dqStatistics.avgSemanticSimilarity * 100} className="h-2 mt-2" />
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium">High DQ Suggestions</h3>
                <p className="text-2xl font-bold mt-2">{formatPercentage(dqStatistics.highDqPercentage)}</p>
                <Progress value={dqStatistics.highDqPercentage * 100} className="h-2 mt-2" />
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium">Low DQ Flagged</h3>
                <p className="text-2xl font-bold mt-2">{formatPercentage(dqStatistics.lowDqFlaggedPercentage)}</p>
                <Progress value={dqStatistics.lowDqFlaggedPercentage * 100} className="h-2 mt-2" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Data Quality Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Very High', value: 0.3 },
                      { name: 'High', value: 0.25 },
                      { name: 'Medium', value: 0.2 },
                      { name: 'Low', value: 0.15 },
                      { name: 'Very Low', value: 0.1 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatPercentage(value)} />
                    <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                    <Bar dataKey="value" name="Percentage">
                      <Cell fill="#4ade80" />
                      <Cell fill="#86efac" />
                      <Cell fill="#fbbf24" />
                      <Cell fill="#f87171" />
                      <Cell fill="#ef4444" />
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="feedback">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium">Avg Time to Feedback</h3>
                <p className="text-2xl font-bold mt-2">{feedbackStatistics.avgTimeToFeedback.toFixed(1)} days</p>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium">Avg Time to Finalization</h3>
                <p className="text-2xl font-bold mt-2">{feedbackStatistics.avgTimeToFinalization.toFixed(1)} days</p>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium">Validated Suggestions</h3>
                <p className="text-2xl font-bold mt-2">{formatPercentage(feedbackStatistics.validatedPercentage)}</p>
                <Progress value={feedbackStatistics.validatedPercentage * 100} className="h-2 mt-2" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Reviewer Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'John Doe', approved: 25, rejected: 10, flagged: 5 },
                      { name: 'Jane Smith', approved: 18, rejected: 15, flagged: 8 },
                      { name: 'Bob Johnson', approved: 15, rejected: 5, flagged: 3 },
                      { name: 'Alice Brown', approved: 12, rejected: 8, flagged: 6 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#4ade80" />
                    <Bar dataKey="rejected" fill="#f87171" />
                    <Bar dataKey="flagged" fill="#fbbf24" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="markets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Market Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {marketPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Market Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={marketBreakdown}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="marketName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" name="Approved" fill="#4ade80" />
                      <Bar dataKey="rejected" name="Rejected" fill="#f87171" />
                      <Bar dataKey="pending" name="Pending" fill="#60a5fa" />
                      <Bar dataKey="flagged" name="Flagged" fill="#fbbf24" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsPanel;
