"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Package, 
  BarChart3, 
  ShoppingCart, 
  DollarSign, 
  Archive, 
  MessageSquare 
} from 'lucide-react';

const navItems = [
  { href: '/', label: '대시보드', icon: BarChart3 },
  { href: '/orders', label: '주문관리', icon: ShoppingCart },
  { href: '/pricing', label: '가격최적화', icon: DollarSign },
  { href: '/inventory', label: '재고관리', icon: Archive },
  { href: '/offers', label: '오퍼관리', icon: MessageSquare },
];

export function FloatingSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-4 top-4 bottom-4 w-16 z-50">
      <div className="h-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2">
        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          
          {/* Navigation Icons */}
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      href={item.href}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                        "hover:bg-blue-500 hover:text-white hover:scale-110",
                        pathname === item.href 
                          ? "bg-blue-500 text-white shadow-lg" 
                          : "text-gray-600 hover:text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}