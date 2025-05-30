'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCartIcon, MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import CartDrawer from '@/components/cart/CartDrawer'
import { Separator } from '@/components/ui/separator'

export default function Header() {
  const pathname = usePathname()
  const { cartItems, calculateTotal } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/50 backdrop-blur-sm'
      )}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <ShoppingCartIcon className='h-6 w-6' />
            <span className='font-bold text-xl'>ShoeStore</span>
          </Link>

          <div className='flex items-center space-x-4'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon' className='relative'>
                  <ShoppingCartIcon className='h-5 w-5' />
                  {cartItems.length > 0 && (
                    <span className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                      {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <CartDrawer />
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon' className='md:hidden'>
                  <MenuIcon className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left'>
                <div className='py-4'>
                  <Link href='/' className='flex items-center space-x-2 mb-8'>
                    <ShoppingCartIcon className='h-6 w-6' />
                    <span className='font-bold text-xl'>ShoeStore</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <Separator/>
    </header>
  )
}
