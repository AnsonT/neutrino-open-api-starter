import cuid from 'cuid'
import moment from 'moment'

export async function dbRequestEmailVerification (tx, userId, email) {
  const verificationId = cuid()
  const expireAt = moment().add(4, 'h').toDate()
  email = email.toLowerCase()
  await tx
    .insert({
      verificationId,
      expireAt,
      userId,
      email
    }).into('emailVerifications')
  return { verificationId }
}

export async function dbVerifyEmail (tx, verificationId) {
  const verified = await tx
    .select()
    .from('emailVerifications')
    .where({ verificationId })
    .where('expireAt', '>', Date.now())
    .first()
  if (verified) {
    if (verified.verifiedAt) {
      const verifiedAt = Date.now()
      await tx
        .where({ verificationId })
        .update({ verifiedAt })
        .into('emailVerifications')
      const { userId } = verified
      await tx
        .where({ userId })
        .update({ emailVerifiedAt: verifiedAt })
        .into('users')
    }
    return { success: true }
  }
  return { success: false }
}
