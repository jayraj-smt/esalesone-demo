"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <div className="aspect-square relative overflow-hidden cursor-pointer">
        <Image
          src={product?.productImages[0]?.imageUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onClick={handleBuyNow}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
          <Button onClick={handleBuyNow} size="sm">Buy Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
