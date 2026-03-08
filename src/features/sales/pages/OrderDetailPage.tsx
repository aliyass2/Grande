import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { useSalesOrder, useUpdateSalesOrder } from '../hooks/useSales'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading, isError } = useSalesOrder(id!)
  const update = useUpdateSalesOrder()

  if (isLoading) return <LoadingSkeleton />
  if (isError || !order) return <ErrorState onRetry={() => navigate('/sales/orders')} />

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/sales/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold font-mono">{order.number}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{order.customerName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => update.mutate({ id: order.id, data: { status: 'confirmed' } })}
              disabled={update.isPending}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirm Order
            </Button>
          )}
          {order.status === 'confirmed' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => update.mutate({ id: order.id, data: { status: 'processing' } })}
              disabled={update.isPending}
            >
              <Package className="h-3.5 w-3.5" />
              Start Processing
            </Button>
          )}
          {order.status === 'processing' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => update.mutate({ id: order.id, data: { status: 'shipped' } })}
              disabled={update.isPending}
            >
              <Truck className="h-3.5 w-3.5" />
              Mark Shipped
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => update.mutate({ id: order.id, data: { status: 'delivered' } })}
              disabled={update.isPending}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark Delivered
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        {/* Line items + notes */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground w-28">Code</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Description</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Qty</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Unit Price</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.lineItems.map(li => (
                    <tr key={li.id}>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{li.productCode}</td>
                      <td className="px-4 py-2.5">{li.description}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{li.quantity}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{formatCurrency(li.unitPrice)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatCurrency(li.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span className="tabular-nums">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1.5">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium text-right max-w-[140px]">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact</span>
                <span className="font-medium">{order.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned To</span>
                <span className="font-medium text-right max-w-[140px]">{order.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-medium">{formatDate(order.orderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exp. Delivery</span>
                <span className="font-medium">{formatDate(order.expectedDelivery)}</span>
              </div>
              {order.deliveredDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-medium text-emerald-600">{formatDate(order.deliveredDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Source Quote</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quote #</span>
                <span
                  className="font-mono text-[11px] text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate(`/sales/quotes/${order.quoteId}`)}
                >
                  {order.quoteNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span className="font-medium">{order.currency}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Amount Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="tabular-nums">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 text-sm">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
