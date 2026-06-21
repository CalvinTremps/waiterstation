import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Waiterstation <notifications@waiterstation.co.za>'

export async function sendNewApplicationEmail({
  employerEmail,
  employerName,
  jobTitle,
  applicantName,
  applicantPhone,
  message,
  applicationId,
}: {
  employerEmail: string
  employerName: string
  jobTitle: string
  applicantName: string
  applicantPhone: string
  message?: string | null
  applicationId: string
}) {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: FROM,
    to: employerEmail,
    subject: `New application for ${jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <div style="background:#059669;border-radius:8px;padding:20px 24px;margin-bottom:24px">
          <h1 style="color:white;margin:0;font-size:20px">New Application</h1>
          <p style="color:#d1fae5;margin:4px 0 0;font-size:14px">${jobTitle}</p>
        </div>

        <p style="color:#374151;font-size:15px">Hi ${employerName},</p>
        <p style="color:#374151;font-size:15px">Someone just applied for your listing on Waiterstation.</p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:20px 0">
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;font-weight:600">Applicant Details</p>
          <p style="margin:4px 0;font-size:15px;font-weight:600;color:#111827">${applicantName}</p>
          <p style="margin:4px 0;font-size:14px;color:#374151">📞 <a href="tel:${applicantPhone}" style="color:#059669;text-decoration:none">${applicantPhone}</a></p>
          ${message ? `<p style="margin:12px 0 0;font-size:14px;color:#4b5563;font-style:italic">"${message}"</p>` : ''}
        </div>

        <p style="color:#6b7280;font-size:13px">
          Contact ${applicantName} directly on ${applicantPhone} to move forward.<br>
          You can also <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'}/employer/applicants" style="color:#059669">view all applicants</a> in your dashboard.
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
        <p style="color:#9ca3af;font-size:12px;margin:0">
          Waiterstation · Hospitality jobs across South Africa<br>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://waiterstation.co.za'}/employer" style="color:#9ca3af">Manage your listings</a>
        </p>
      </div>
    `,
  }).catch(err => console.error('Resend error:', err))
}
