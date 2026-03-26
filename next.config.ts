// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n-request.ts')

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '52mb',
    },
  },
}

export default withNextIntl(nextConfig)
