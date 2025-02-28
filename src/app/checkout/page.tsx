import { Suspense } from "react";
import CheckoutPage from "@/components/CheckoutPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}
