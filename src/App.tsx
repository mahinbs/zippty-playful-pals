import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import GlobalBubbles from "@/components/GlobalBubbles";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#1a1a1a', 
          color: 'white', 
          minHeight: '100vh',
          fontFamily: 'monospace'
        }}>
          <h1>Something went wrong!</h1>
          <p>Error: {this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingFallback = () => (
  <div style={{ 
    padding: '20px', 
    backgroundColor: '#1a1a1a', 
    color: 'white', 
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }}>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      border: '3px solid #3b82f6', 
      borderTop: '3px solid transparent', 
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ marginTop: '20px' }}>Loading Zippty...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Lazy load components to isolate issues
const Index = React.lazy(() => import("./pages/Index"));
const Shop = React.lazy(() => import("./pages/Shop"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Admin = React.lazy(() => import("./pages/Admin"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Shipping = React.lazy(() => import("./pages/Shipping"));
const Returns = React.lazy(() => import("./pages/Returns"));
const Warranty = React.lazy(() => import("./pages/Warranty"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <GlobalBubbles />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
