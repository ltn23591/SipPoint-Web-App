import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "@/routes/routes";
import { queryClient } from "@/helpers/queryClient";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton expand={false} duration={3000} />
    </QueryClientProvider>
  );
}

export default App;
