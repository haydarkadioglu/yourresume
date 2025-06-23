"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button onClick={handlePrint} className="bg-accent hover:bg-accent/90 no-print">
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
}
