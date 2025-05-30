import ProductList from '@/components/product/ProductList';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Premium Footwear Collection</h1>
        <p className="text-lg text-muted-foreground">Discover the perfect pair for every occasion</p>
      </div>
      <ProductList />
    </div>
  );
}