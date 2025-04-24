import React, { useEffect, useState } from "react";
import SuggestionCard from "@/components/SuggestionCard";
import FilterBar from "@/components/FilterBar";
import AddCommentDialog from "@/components/AddCommentDialog";
import ResuggestDialog from "@/components/ResuggestDialog";
import DashboardAnalyticsPanel from "@/components/DashboardAnalyticsPanel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewToggle from "@/components/ViewToggle";
import SuggestionsTable from "@/components/SuggestionsTable";
import BulkActionBar from "@/components/BulkActionBar";
import {
  Suggestion,
  addComment,
  fetchSuggestions,
  updateSuggestionStatus,
} from "@/services/mockData";
import StatsOverview from "@/components/StatsOverview";

const Index: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    status?: string;
    matchCategory?: string;
    market?: string;
    searchTerm?: string;
  }>({});
  
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [resuggestDialogOpen, setResuggestDialogOpen] = useState(false);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("suggestions");
  const [view, setView] = useState<"cards" | "table">("cards");
  
  const [stats, setStats] = useState({
    totalSuggestions: 0,
    approvedPercentage: 0,
    averageMatchScore: 0,
    activeReviewers: 0,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadSuggestions();
  }, [filters]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSuggestions(filters);
      setSuggestions(data);
    } catch (error) {
      console.error("Error loading suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to load suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: "Approved" | "Rejected" | "Flagged" | "Pending"
  ) => {
    setIsProcessing(true);
    try {
      const updatedSuggestion = await updateSuggestionStatus(id, status);
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? updatedSuggestion : s))
      );
      toast({
        title: "Success",
        description: `Suggestion ${status.toLowerCase()} successfully.`,
      });
    } catch (error) {
      console.error("Error updating suggestion:", error);
      toast({
        title: "Error",
        description: `Failed to update suggestion status.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddComment = (id: string) => {
    setActiveSuggestionId(id);
    setCommentDialogOpen(true);
  };

  const handleResuggest = (id: string) => {
    setActiveSuggestionId(id);
    setResuggestDialogOpen(true);
  };

  const submitComment = async (text: string, reasonCode?: string) => {
    if (!activeSuggestionId) return;
    
    setIsProcessing(true);
    try {
      await addComment(activeSuggestionId, text, reasonCode);
      setCommentDialogOpen(false);
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
      loadSuggestions();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const submitResuggest = async (alternativeId: string) => {
    if (!activeSuggestionId) return;
    
    setIsProcessing(true);
    try {
      setResuggestDialogOpen(false);
      toast({
        title: "Success",
        description: "Alternative match selected successfully.",
      });
      loadSuggestions();
    } catch (error) {
      console.error("Error resuggesting:", error);
      toast({
        title: "Error",
        description: "Failed to select alternative match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterChange = (newFilters: {
    status?: string;
    matchCategory?: string;
    market?: string;
    searchTerm?: string;
  }) => {
    const processedFilters = {
      status: newFilters.status === "all-statuses" ? undefined : newFilters.status,
      matchCategory: newFilters.matchCategory === "all-confidence" ? undefined : newFilters.matchCategory,
      market: newFilters.market === "all-markets" ? undefined : newFilters.market,
      searchTerm: newFilters.searchTerm,
    };
    
    setFilters(processedFilters);
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected ? [...prev, id] : prev.filter(sid => sid !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? suggestions.map(s => s.id) : []);
  };

  const handleBulkApprove = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(selectedIds.map(id => updateSuggestionStatus(id, "Approved")));
      toast({
        title: "Success",
        description: `${selectedIds.length} suggestions approved successfully.`,
      });
      loadSuggestions();
      setSelectedIds([]);
    } catch (error) {
      console.error("Error in bulk approve:", error);
      toast({
        title: "Error",
        description: "Failed to approve suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkReject = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(selectedIds.map(id => updateSuggestionStatus(id, "Rejected")));
      toast({
        title: "Success",
        description: `${selectedIds.length} suggestions rejected successfully.`,
      });
      loadSuggestions();
      setSelectedIds([]);
    } catch (error) {
      console.error("Error in bulk reject:", error);
      toast({
        title: "Error",
        description: "Failed to reject suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkFlag = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(selectedIds.map(id => updateSuggestionStatus(id, "Flagged")));
      toast({
        title: "Success",
        description: `${selectedIds.length} suggestions flagged successfully.`,
      });
      loadSuggestions();
      setSelectedIds([]);
    } catch (error) {
      console.error("Error in bulk flag:", error);
      toast({
        title: "Error",
        description: "Failed to flag suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const calculateStats = (suggestions: Suggestion[]) => {
      const approvedCount = suggestions.filter(s => s.status === "Approved").length;
      const avgScore = suggestions.reduce((acc, curr) => acc + curr.matchScore, 0) / suggestions.length;
      
      setStats({
        totalSuggestions: suggestions.length,
        approvedPercentage: suggestions.length ? approvedCount / suggestions.length : 0,
        averageMatchScore: avgScore || 0,
        activeReviewers: 5,
      });
    };

    if (suggestions.length) {
      calculateStats(suggestions);
    }
  }, [suggestions]);

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">O360 Harmonization Suggestions</h1>
          <p className="text-muted-foreground mt-1">
            Review and provide feedback on outlet match suggestions
          </p>
        </div>
      </div>

      <StatsOverview {...stats} />

      <Separator className="mb-6" />
      
      <div className="mb-6 flex items-center justify-between">
        <FilterBar onFilterChange={handleFilterChange} />
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      
      <Tabs defaultValue="suggestions" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Loading suggestions...</p>
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12 bg-muted/40 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
              <p className="text-muted-foreground mb-4">
                Try changing your filters or search terms
              </p>
              <Button onClick={() => setFilters({})}>Clear Filters</Button>
            </div>
          ) : (
            <div>
              <BulkActionBar
                selectedIds={selectedIds}
                onApproveSelected={handleBulkApprove}
                onRejectSelected={handleBulkReject}
                onFlagSelected={handleBulkFlag}
                onSelectAll={handleSelectAll}
                totalItems={suggestions.length}
              />
              {view === "cards" ? (
                <div>
                  {suggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onApprove={() => handleStatusUpdate(suggestion.id, "Approved")}
                      onReject={() => handleStatusUpdate(suggestion.id, "Rejected")}
                      onFlag={() => handleStatusUpdate(suggestion.id, "Flagged")}
                      onResuggest={() => handleResuggest(suggestion.id)}
                      onAddComment={() => handleAddComment(suggestion.id)}
                      isProcessing={isProcessing}
                      isSelected={selectedIds.includes(suggestion.id)}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : (
                <SuggestionsTable
                  suggestions={suggestions}
                  onApprove={(id) => handleStatusUpdate(id, "Approved")}
                  onReject={(id) => handleStatusUpdate(id, "Rejected")}
                  onFlag={(id) => handleStatusUpdate(id, "Flagged")}
                  onResuggest={handleResuggest}
                  onAddComment={handleAddComment}
                  isProcessing={isProcessing}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                />
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dashboard">
          <DashboardAnalyticsPanel />
        </TabsContent>
      </Tabs>

      <AddCommentDialog
        isOpen={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        onSubmit={submitComment}
        isSubmitting={isProcessing}
      />

      <ResuggestDialog
        isOpen={resuggestDialogOpen}
        onClose={() => setResuggestDialogOpen(false)}
        onSubmit={submitResuggest}
        isSubmitting={isProcessing}
      />
    </div>
  );
};

export default Index;
