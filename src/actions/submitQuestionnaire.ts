'use server'

import { put } from '@vercel/blob'
import { Resend } from 'resend'
import { normalizeWhatsApp, buildEmailHtml, buildClientEmailHtml } from './questionnaireUtils'

export { normalizeWhatsApp, buildEmailHtml }

export type QuestionnaireData = {
  name: string
  whatsapp: string
  email: string
  roomType: string[]
  area: string
  floorPlanFile: File | null
  photoFiles: File[]
  styles: string[]
  mustHave: string
  scopeType: string
  urgency: string
  budget: string
}

type ActionResult = { success: true } | { success: false; error: string }

export async function submitQuestionnaire(data: QuestionnaireData, locale: string): Promise<ActionResult> {
  console.log('[submitQuestionnaire] início — cliente:', data.name, '| fotos:', data.photoFiles.length, '| planta:', !!data.floorPlanFile)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const toEmail = process.env.RESEND_TO_EMAIL ?? 'carolorofinoo@gmail.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
    const fromLabel = `Carol Orofino <${fromEmail}>`
    const normalizedWa = normalizeWhatsApp(data.whatsapp)

    console.log('[submitQuestionnaire] env — RESEND_API_KEY:', !!process.env.RESEND_API_KEY, '| BLOB_TOKEN:', !!process.env.BLOB_READ_WRITE_TOKEN)

    // Upload floor plan + photos to blob in parallel
    const timestamp = Date.now()
    console.log('[submitQuestionnaire] iniciando uploads para Blob...')
    let floorPlanUrl: string | null = null
    let photoUrls: string[] = []
    try {
      const photoUploads = await Promise.all(
        data.photoFiles.map((file, i) =>
          put(
            `questionnaire/${timestamp}-${i}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
            file,
            { access: 'private' }
          )
        )
      )
      photoUrls = photoUploads.map(b => b.url)

      if (data.floorPlanFile) {
        const floorPlanBlob = await put(
          `questionnaire/${timestamp}-${data.floorPlanFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
          data.floorPlanFile,
          { access: 'private' }
        )
        floorPlanUrl = floorPlanBlob.url
      }

      console.log('[submitQuestionnaire] uploads concluídos — planta:', !!floorPlanUrl, '| fotos:', photoUrls.length)
    } catch (blobErr) {
      console.error('[submitQuestionnaire] falha no upload para Vercel Blob:', blobErr)
      throw blobErr
    }

    const html = buildEmailHtml({
      name: data.name,
      whatsapp: normalizedWa,
      email: data.email,
      roomType: data.roomType,
      area: data.area,
      floorPlanUrl,
      photoUrls,
      styles: data.styles,
      mustHave: data.mustHave,
      scopeType: data.scopeType,
      urgency: data.urgency,
      budget: data.budget,
    })

    console.log('[submitQuestionnaire] enviando email para Carol...')
    const { error: carolEmailError } = await resend.emails.send({
      from: fromLabel,
      to: toEmail,
      subject: `Novo questionário — ${data.name}`,
      html,
    })
    if (carolEmailError) {
      console.error('[submitQuestionnaire] Resend rejeitou email para Carol:', JSON.stringify(carolEmailError))
      throw carolEmailError
    }
    console.log('[submitQuestionnaire] email para Carol enviado com sucesso')

    // Confirmação para o cliente só funciona com domínio verificado no Resend
    // Ativar quando tiver RESEND_FROM_EMAIL com domínio próprio configurado
    if (fromEmail !== 'onboarding@resend.dev') {
      try {
        const { subject, html: clientHtml } = buildClientEmailHtml(
          { name: data.name, roomType: data.roomType, styles: data.styles },
          locale
        )
        const { error: clientEmailError } = await resend.emails.send({
          from: fromLabel,
          to: data.email,
          replyTo: toEmail,
          subject,
          html: clientHtml,
        })
        if (clientEmailError) {
          console.error('[submitQuestionnaire] Resend rejeitou confirmação para cliente:', JSON.stringify(clientEmailError))
        }
      } catch (clientErr) {
        console.error('[submitQuestionnaire] exceção ao enviar confirmação para cliente:', clientErr)
      }
    }

    console.log('[submitQuestionnaire] concluído com sucesso')
    return { success: true }
  } catch (err) {
    console.error('[submitQuestionnaire] erro geral — tipo:', err instanceof Error ? err.constructor.name : typeof err)
    console.error('[submitQuestionnaire] erro geral — detalhe:', err)
    return { success: false, error: 'generic' }
  }
}
