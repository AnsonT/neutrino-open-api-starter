import nodeMailer from 'nodemailer'
import config from '../../config'

async function emailTransporter () {
  if (!emailTransporter.transporter) {
    const service = config.email.service
    let host = config.email.smtpHost
    let port = config.email.smtpPort
    let user = config.email.smtpUser
    let pass = config.email.smtpPassword
    let secure = true

    if (service === 'test') {
      const account = await new Promise((resolve, reject) => {
        nodeMailer.createTestAccount((err, account) => {
          if (err) {
            reject(err)
          } else {
            resolve(account)
          }
        })
      })
      host = account.smtp.host
      port = account.smtp.port
      user = account.user
      pass = account.pass
      secure = account.smtp.secure
      console.log(account)
    }

    emailTransporter.transporter = nodeMailer.createTransport({
      service,
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    })
    emailTransporter.transporter.verify((error, success) => {
      if (error) {
        console.error(`Email transporter: ${error}`)
      } else {
        console.log(`Email service: ${service} ready`)
      }
    })
  }
  return emailTransporter.transporter
}

export async function sendMail (message) {
  const transporter = await emailTransporter()
  const info = await transporter.sendMail(message)
  if (config.email.smtpHost === 'test') {
    console.log('Email Preview: %s',
      nodeMailer.getTestMessageUrl(info))
  }
  return info
}
