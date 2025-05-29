export default function Footer() {
  return (
    <footer className='border-t mt-auto'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='font-semibold text-lg mb-4'>ShoeStore</h3>
            <p className='text-muted-foreground text-sm'>
              Your one-stop shop for the latest and greatest footwear.
            </p>
          </div>

          {/* <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Return Policy</a>
              </li>
            </ul>
          </div> */}

          <div className='md:col-start-3 md:text-right'>
            <h3 className='font-semibold text-lg mb-4'>Contact Us</h3>
            <address className='not-italic text-sm text-muted-foreground'>
              <p>123 Shoe Street</p>
              <p>Footwear City, FC 10001</p>
              <p className='mt-2'>Email: support@shoestore.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className='border-t mt-8 pt-8 text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} ShoeStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
