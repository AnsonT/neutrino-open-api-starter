import React from 'react'
import { Email, Item, Span, A, renderEmail } from 'react-html-email' // eslint-disable-line
import { sendMail } from '.'

// https://github.com/chromakode/react-html-email
const css = `
@media only screen and (max-device-width: 480px) {
  font-size: 20px !important;
}`.trim()

const emailHTML = (userName, verificationId) => renderEmail(
  <Email title='Verify your email address' headCSS={css}>
    <Item align='center'>
      <Span fontSize={20}>
        {userName}: {verificationId}
      </Span>
    </Item>
  </Email>
)

export async function sendEmailVerificationMail (userName, email, verificationId) {
  return sendMail({
    to: email,
    subject: 'Verify your email address',
    html: emailHTML(userName, verificationId)
  })
}
