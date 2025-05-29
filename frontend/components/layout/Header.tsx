"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isCheckoutPage = pathname.includes("/checkout");
  const isThankYouPage = pathname.includes("/thank-you");

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          ShoeStore
        </Link>
        
        {!isCheckoutPage && !isThankYouPage && (
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors"
            >
              <ShoppingBag size={20} />
              <span>Shop</span>
            </Link>
          </div>
        )}
        
        {(isCheckoutPage || isThankYouPage) && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${!isThankYouPage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                1
              </div>
              <span className={!isThankYouPage ? "text-primary font-medium" : "text-muted-foreground"}>Checkout</span>
              <div className="w-8 h-px bg-border mx-1"></div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isThankYouPage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                2
              </div>
              <span className={isThankYouPage ? "text-primary font-medium" : "text-muted-foreground"}>Confirmation</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}