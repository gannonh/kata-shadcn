import { Spinner } from "@/components/ui/spinner";

export const title = "Spinner Before Text";

const Example = () => (
  <p className="flex items-center gap-2 text-sm text-muted-foreground">
    <Spinner className="size-3" />
    Syncing your changes
  </p>
);

export default Example;
