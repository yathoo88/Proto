import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Order } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface RecentOrdersListProps {
  orders: Order[];
}

const platformColors = {
  ebay: "bg-yellow-100 text-yellow-800",
  shopify: "bg-green-100 text-green-800",
  auction: "bg-purple-100 text-purple-800",
  other: "bg-gray-100 text-gray-800"
};

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 주문</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 6).map((order) => (
            <div key={order.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{order.platform.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {order.productName}
                </p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${platformColors[order.platform]}`}>
                    {order.platform}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.orderDate), { 
                      addSuffix: true,
                      locale: ko 
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${order.salePrice}</p>
                <p className={`text-sm ${
                  order.profit > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${order.profit > 0 ? '+' : ''}${order.profit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}