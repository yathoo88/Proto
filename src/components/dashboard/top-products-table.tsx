import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product } from "@/lib/types";

interface TopProductsTableProps {
  products: Product[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>인기 상품</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품</TableHead>
              <TableHead>매입처</TableHead>
              <TableHead className="text-right">현재가</TableHead>
              <TableHead className="text-right">재고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 5).map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={product.images[0]} alt={product.name} />
                      <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{product.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {product.supplier}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${product.currentPrice}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className={`${
                      product.inventory.available > 20 ? 'text-green-600' :
                      product.inventory.available > 10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {product.inventory.available}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      product.inventory.available > 20 ? 'bg-green-500' :
                      product.inventory.available > 10 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}