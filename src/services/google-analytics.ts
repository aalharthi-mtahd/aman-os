// src/services/google-analytics.ts
import { GA_WEEKLY_DATA } from '@/lib/db/mock-data'
import type { GAMetrics, TrafficTransactionCorrelation } from '@/types'

interface GAReportRow {
  dimensionValues: { value: string }[]
  metricValues: { value: string }[]
}

interface GAReport {
  rows?: GAReportRow[]
  rowCount?: number
}

// Production: use googleapis library
// import { google } from 'googleapis'

export class GoogleAnalyticsService {
  private propertyId: string
  private useMock: boolean

  constructor() {
    this.propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || ''
    this.useMock = !process.env.GOOGLE_CLIENT_EMAIL || !this.propertyId
  }

  private async getAuthClient() {
    if (typeof window !== 'undefined') return null

    try {
      const { google } = await import('googleapis')
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      })
      return google.analyticsdata({ version: 'v1beta', auth })
    } catch {
      return null
    }
  }

  async getWeeklyMetrics(startDate: string, endDate: string): Promise<GAMetrics[]> {
    if (this.useMock) {
      return this.getMockWeeklyMetrics()
    }

    const analyticsdata = await this.getAuthClient()
    if (!analyticsdata) return this.getMockWeeklyMetrics()

    try {
      const response = await analyticsdata.properties.runReport({
        property: this.propertyId,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
            { name: 'conversions' },
          ],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
      })

      return this.parseReportRows(response.data as GAReport)
    } catch (error) {
      console.error('GA API error:', error)
      return this.getMockWeeklyMetrics()
    }
  }

  private parseReportRows(data: GAReport): GAMetrics[] {
    if (!data.rows) return []

    return data.rows.map((row: GAReportRow) => {
      const date = row.dimensionValues[0].value
      const sessions = parseInt(row.metricValues[0].value) || 0
      const users = parseInt(row.metricValues[1].value) || 0
      const pageviews = parseInt(row.metricValues[2].value) || 0
      const bounceRate = parseFloat(row.metricValues[3].value) || 0
      const avgDuration = parseFloat(row.metricValues[4].value) || 0
      const conversions = parseInt(row.metricValues[5].value) || 0

      return {
        date: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
        sessions,
        users,
        pageviews,
        bounceRate: bounceRate * 100,
        avgSessionDuration: avgDuration,
        conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0,
      }
    })
  }

  getMockWeeklyMetrics(): GAMetrics[] {
    return GA_WEEKLY_DATA.map((d) => ({
      date: d.date,
      sessions: d.sessions,
      users: d.users,
      pageviews: d.pageviews,
      bounceRate: d.bounceRate,
      avgSessionDuration: d.avgSessionDuration,
      conversionRate: d.conversionRate,
    }))
  }

  getTrafficTransactionCorrelation(): TrafficTransactionCorrelation[] {
    return GA_WEEKLY_DATA.map((d) => ({
      date: d.date,
      sessions: d.sessions,
      transactions: d.transactions,
      conversionRate: d.conversionRate,
    }))
  }

  computeCorrelationCoefficient(gaData: GAMetrics[], transactions: number[]): number {
    if (gaData.length !== transactions.length || gaData.length < 2) return 0

    const x = gaData.map((d) => d.sessions)
    const y = transactions

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2))

    return denominator === 0 ? 0 : numerator / denominator
  }

  getAggregatedMetrics(data: GAMetrics[]) {
    if (data.length === 0) return null

    const totalSessions = data.reduce((sum, d) => sum + d.sessions, 0)
    const totalUsers = data.reduce((sum, d) => sum + d.users, 0)
    const totalPageviews = data.reduce((sum, d) => sum + d.pageviews, 0)
    const avgBounceRate = data.reduce((sum, d) => sum + d.bounceRate, 0) / data.length
    const avgSessionDuration = data.reduce((sum, d) => sum + d.avgSessionDuration, 0) / data.length
    const avgConversionRate = data.reduce((sum, d) => sum + d.conversionRate, 0) / data.length

    return {
      sessions: totalSessions,
      users: totalUsers,
      pageviews: totalPageviews,
      bounceRate: parseFloat(avgBounceRate.toFixed(1)),
      avgSessionDuration: Math.round(avgSessionDuration),
      conversionRate: parseFloat(avgConversionRate.toFixed(1)),
    }
  }
}

export const gaService = new GoogleAnalyticsService()
