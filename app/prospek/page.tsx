import { Suspense } from "react";
import { ProspekBoard } from "@/components/prospek-board";

export default function ProspekPage() {
  return (
    <Suspense>
      <ProspekBoard />
    </Suspense>
  );
}
