import { useState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface ResetAlarmDialogProps {
  onClose: () => void;
  onConfirm: (
    selectedOptions: string[],
    freeText: string,
  ) => void;
  patientName: string;
}

const resetOptions = [
  "Nothing to report",
  "Pain",
  "High O2",
  "High HR",
  "LOW HR",
  "text 1",
  "text2",
  "text3",
  "text 4",
  "text5",
];

export default function ResetAlarmDialog({
  onClose,
  onConfirm,
  patientName,
}: ResetAlarmDialogProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    string[]
  >([]);
  const [freeText, setFreeText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    // Scroll the parent phone frame's content area to top
    const phoneContent = document.querySelector('.phone-content-area');
    if (phoneContent) {
      phoneContent.scrollTop = 0;
    }
    // Also scroll window to top
    window.scrollTo(0, 0);
  }, []);

  const handleCheckboxChange = (
    option: string,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(
        selectedOptions.filter((o) => o !== option),
      );
    }
  };

  const handleConfirm = () => {
    const hasSelection =
      selectedOptions.length > 0 || freeText.trim().length > 0;
    if (!hasSelection) return;

    // If there's text in "Other", add it as a selected option
    const finalOptions =
      freeText.trim().length > 0
        ? [...selectedOptions, `Other: ${freeText.trim()}`]
        : selectedOptions;

    onConfirm(finalOptions, freeText);
    // Reset form
    setSelectedOptions([]);
    setFreeText("");
  };

  const handleCancel = () => {
    // Reset form
    setSelectedOptions([]);
    setFreeText("");
    onClose();
  };

  const isConfirmDisabled =
    selectedOptions.length === 0 &&
    freeText.trim().length === 0;

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-white overflow-hidden pt-7 pb-12">
      {/* Header */}
      <div className="bg-teal-600 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-teal-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg">Reset Alarm</h1>
          <p className="text-teal-100 text-sm">{patientName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        <div className="space-y-6">
          {/* Checkboxes */}
          <div className="space-y-3">
            <Label className="text-gray-700">
              Select applicable items:
            </Label>
            {resetOptions.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3"
              >
                <Checkbox
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      option,
                      checked as boolean,
                    )
                  }
                />
                <Label
                  htmlFor={option}
                  className="text-sm cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>

          {/* Other Text Area */}
          <div className="space-y-2">
            <Label htmlFor="freetext" className="text-gray-700">
              Other
            </Label>
            <Textarea
              id="freetext"
              placeholder="Enter any additional details..."
              value={freeText}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= 100) {
                  setFreeText(text);
                }
              }}
              maxLength={100}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 text-right">
              {freeText.length}/100 characters
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0 -mb-12">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Reset
          </Button>
        </div>
      </div>
    </div>
  );
}