
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AlternativeOutlet {
  id: string;
  name: string;
  address: string;
  score: number;
}

const mockAlternatives: AlternativeOutlet[] = [
  {
    id: "alt-1",
    name: "Alternative Outlet 1",
    address: "123 Main St, City, State",
    score: 0.75,
  },
  {
    id: "alt-2",
    name: "Alternative Outlet 2",
    address: "456 Oak Ave, City, State",
    score: 0.68,
  },
  {
    id: "alt-3",
    name: "Alternative Outlet 3",
    address: "789 Pine St, City, State",
    score: 0.61,
  },
];

interface ResuggestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedId: string) => void;
  isSubmitting?: boolean;
}

const ResuggestDialog: React.FC<ResuggestDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState<string | undefined>(
    undefined
  );
  const [alternatives] = useState<AlternativeOutlet[]>(mockAlternatives);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOutlet) {
      onSubmit(selectedOutlet);
    }
  };

  const filteredAlternatives = alternatives.filter(
    (alt) =>
      alt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alt.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose Alternative Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for outlets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <RadioGroup
              value={selectedOutlet}
              onValueChange={setSelectedOutlet}
              className="space-y-0"
            >
              {filteredAlternatives.length > 0 ? (
                filteredAlternatives.map((alt) => (
                  <Label
                    key={alt.id}
                    htmlFor={alt.id}
                    className={`flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 ${
                      selectedOutlet === alt.id ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={alt.id} id={alt.id} />
                      <div>
                        <p className="font-medium">{alt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {alt.address}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(alt.score * 100)}% match
                    </span>
                  </Label>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No alternative outlets found.
                </div>
              )}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedOutlet || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Select Alternative"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResuggestDialog;
