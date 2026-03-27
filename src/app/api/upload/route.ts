import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = [
  'image/png', 'image/jpeg', 'image/webp',
  'application/pdf',
  'video/mp4', 'video/quicktime',
]
const MAX_BYTES = 52 * 1024 * 1024 // 52 MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname: string) => ({
        allowedContentTypes: ALLOWED_TYPES,
        maximumSizeInBytes: MAX_BYTES,
        tokenPayload: _pathname,
      }),
      onUploadCompleted: async () => {
        // noop — processamento acontece no server action
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (err) {
    console.error('[api/upload] erro:', err)
    return NextResponse.json({ error: String(err) }, { status: 400 })
  }
}
