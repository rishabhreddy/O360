
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddCommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, reasonCode?: string) => void;
  isSubmitting?: boolean;
}

const reasonCodes = [
  { value: "Mismatch", label: "Mismatch" },
  { value: "Incomplete Data", label: "Incomplete Data" },
  { value: "Duplicate", label: "Duplicate" },
  { value: "Requires Validation", label: "Requires Validation" },
  { value: "Other", label: "Other" },
];

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [commentText, setCommentText] = useState("");
  const [reasonCode, setReasonCode] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText.trim(), reasonCode);
      setCommentText("");
      setReasonCode(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reason-code">Reason Code</Label>
            <Select value={reasonCode} onValueChange={setReasonCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason code" />
              </SelectTrigger>
              <SelectContent>
                {reasonCodes.map((code) => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment here..."
              rows={4}
              required
            />
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
            <Button type="submit" disabled={!commentText.trim() || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentDialog;
