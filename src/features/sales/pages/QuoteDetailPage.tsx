import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle2, XCircle, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useQuote, useUpdateQuote } from '../hooks/useSales'

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: quote, isLoading, isError } = useQuote(id!)
  const update = useUpdateQuote()

  if (isLoading) return <LoadingSkeleton />
  if (isError || !quote) return <ErrorState onRetry={() => navigate('/sales/quotes')} />

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/sales/quotes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold font-mono">{quote.number}</h1>
              <StatusBadge status={quote.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{quote.customerName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {quote.status === 'draft' && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => update.mutate({ id: quote.id, data: { status: 'sent' } })}
              disabled={update.isPending}
            >
              <Send className="h-3.5 w-3.5" />
              Send Quote
            </Button>
          )}
          {quote.status === 'sent' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5 text-rose-600 hover:text-rose-600"
                onClick={() => update.mutate({ id: quote.id, data: { status: 'rejected' } })}
                disabled={update.isPending}
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => update.mutate({ id: quote.id, data: { status: 'accepted' } })}
                disabled={update.isPending}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Accepted
              </Button>
            </>
          )}
          {quote.status === 'accepted' && (
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => update.mutate({ id: quote.id, data: { status: 'converted' } })}
              disabled={update.isPending}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Convert to Order
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
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Disc %</th>
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {quote.lineItems.map(li => (
                    <tr key={li.id}>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{li.productCode}</td>
                      <td className="px-4 py-2.5">{li.description}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{li.quantity}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{formatCurrency(li.unitPrice)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {li.discount > 0
                          ? <span className="text-amber-600 font-medium">{li.discount}%</span>
                          : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">{formatCurrency(li.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatCurrency(quote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span className="tabular-nums">{formatCurrency(quote.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1.5">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(quote.notes || quote.terms) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quote.notes && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">Notes</p>
                    <p className="text-xs text-muted-foreground">{quote.notes}</p>
                  </div>
                )}
                {quote.terms && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">Payment Terms</p>
                    <p className="text-xs text-muted-foreground">{quote.terms}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium text-right max-w-[140px]">{quote.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact</span>
                <span className="font-medium">{quote.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned To</span>
                <span className="font-medium text-right max-w-[140px]">{quote.assignedTo}</span>
              </div>
              {quote.opportunityId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opportunity</span>
                  <span
                    className="font-mono text-[11px] text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/crm/opportunities/${quote.opportunityId}`)}
                  >
                    {quote.opportunityId}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={quote.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span className="font-medium">{quote.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date</span>
                <span className="font-medium">{formatDate(quote.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span className={cn('font-medium', quote.status === 'expired' && 'text-rose-600')}>
                  {formatDate(quote.expiryDate)}
                </span>
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
                <span className="tabular-nums">{formatCurrency(quote.subtotal)}</span>
              </div>
              {quote.discountAmount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-{formatCurrency(quote.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="tabular-nums">{formatCurrency(quote.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 text-sm">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(quote.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
