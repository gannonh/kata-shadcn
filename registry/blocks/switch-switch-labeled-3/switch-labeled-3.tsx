"use client";

import { useState } from "react";

import { Switch } from "@/components/ui/switch";

export const title = "Switch with State Labels";

const Example = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{checked ? "On" : "Off"}</span>
      <Switch checked={checked} onCheckedChange={setChecked} />
      <span className="text-sm text-muted-foreground">
        {checked ? "Off" : "On"}
      </span>
    </div>
  );
};

export default Example;
