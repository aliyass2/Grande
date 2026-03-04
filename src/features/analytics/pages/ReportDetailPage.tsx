import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorState } from '@/components/ErrorState'
import { formatDate, formatRelative } from '@/lib/formatters'
import { useReport } from '../hooks/useAnalytics'
import { toast } from 'sonner'

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: report, isLoading, isError } = useReport(id!)

  if (isLoading) return <LoadingSkeleton />
  if (isError || !report) return <ErrorState onRetry={() => navigate('/reports')} />

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/reports')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">{report.name}</h1>
            <Badge variant="secondary" className="text-xs capitalize">{report.category}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{report.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success('Export started')}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Export CSV
          </Button>
          <Button size="sm" className="h-8 text-xs" onClick={() => toast.success(`Running ${report.name}...`)}>
            <PlayCircle className="h-3.5 w-3.5 mr-1" />
            Run Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Rows</p>
            <p className="text-2xl font-bold">{report.rowCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Columns</p>
            <p className="text-2xl font-bold">{report.columns.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Last Run</p>
            <p className="text-sm font-semibold">{formatRelative(report.lastRunAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm font-semibold">{formatDate(report.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Column Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Column</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Label</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                </tr>
              </thead>
              <tbody>
                {report.columns.map((col) => (
                  <tr key={col.key} className="border-b last:border-0">
                    <td className="py-2 font-mono text-[11px] text-muted-foreground">{col.key}</td>
                    <td className="py-2 font-medium">{col.label}</td>
                    <td className="py-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{col.type}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
