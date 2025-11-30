/**
 * Simple analytics tracking utility
 * For production, integrate with Google Analytics, Plausible, or similar
 */

export interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
}

class Analytics {
  private enabled: boolean
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.enabled = !this.isDevelopment && typeof window !== 'undefined'
  }

  /**
   * Track page view
   */
  pageView(url: string, title?: string) {
    if (!this.enabled) {
      if (this.isDevelopment) {
        // eslint-disable-next-line no-console
        console.log('📊 Analytics: Page View', { url, title })
      }
      return
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
      })
    }
  }

  /**
   * Track custom event
   */
  event({ category, action, label, value }: AnalyticsEvent) {
    if (!this.enabled) {
      if (this.isDevelopment) {
        // eslint-disable-next-line no-console
        console.log('📊 Analytics: Event', { category, action, label, value })
      }
      return
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  /**
   * Track player registration
   */
  trackRegistration(playerData: { nationality: string; package_size: number }) {
    this.event({
      category: 'Registration',
      action: 'player_registered',
      label: `${playerData.nationality}_${playerData.package_size}`,
    })
  }

  /**
   * Track payment
   */
  trackPayment(amount: number, currency: string) {
    this.event({
      category: 'Payment',
      action: 'payment_processed',
      label: currency,
      value: amount,
    })
  }

  /**
   * Track admin action
   */
  trackAdminAction(action: string) {
    this.event({
      category: 'Admin',
      action: action,
    })
  }

  /**
   * Track bracket view
   */
  trackBracketView() {
    this.event({
      category: 'Tournament',
      action: 'bracket_viewed',
    })
  }

  /**
   * Track results view
   */
  trackResultsView() {
    this.event({
      category: 'Tournament',
      action: 'results_viewed',
    })
  }

  /**
   * Track error
   */
  trackError(error: Error, fatal: boolean = false) {
    this.event({
      category: 'Error',
      action: fatal ? 'fatal_error' : 'error',
      label: error.message,
    })

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.error('📊 Analytics: Error tracked', error)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

/**
 * React hook for tracking page views
 */
export function usePageTracking() {
  if (typeof window !== 'undefined') {
    analytics.pageView(window.location.pathname, document.title)
  }
}
