import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/ui/ProductCard';

export default async function Home() {
  const { products } = await getProducts();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Premium Footwear Collection
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Discover our curated selection of high-quality footwear. From casual sneakers to elegant dress shoes, 
          find the perfect pair for any occasion.
        </p>
      </section>
      
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}