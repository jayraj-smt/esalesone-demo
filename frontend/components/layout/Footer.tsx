import Link from 'next/link'
import {
  ShoppingCartIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gray-100 mt-12'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='md:col-span-1'>
            <Link href='/' className='flex items-center space-x-2 mb-4'>
              <ShoppingCartIcon className='h-6 w-6' />
              <span className='font-bold text-xl'>ShoeStore</span>
            </Link>
            <p className='text-sm text-muted-foreground mb-4'>
              Premium footwear for every occasion. Quality, comfort, and style
              in every step.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <FacebookIcon className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <InstagramIcon className='h-5 w-5' />
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <TwitterIcon className='h-5 w-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='font-semibold mb-4'>Customer Service</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href='/'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='font-semibold mb-4'>Contact Us</h3>
            <ul className='space-y-2 text-sm'>
              <li className='text-muted-foreground'>
                123 Shoe Street, Fashion District
              </li>
              <li className='text-muted-foreground'>Footwear City, FC 10001</li>
              <li className='text-muted-foreground'>info@shoestore.com</li>
              <li className='text-muted-foreground'>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-200 mt-8 pt-8 text-center text-sm text-muted-foreground'>
          <p>&copy; {currentYear} ShoeStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
