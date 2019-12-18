import uuid from 'uuid/v4'
import moment from 'moment'

export async function dbRequestEmailVerification (tx, userId, email) {
  const verificationId = uuid()
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
    .where('expireAt', '>', new Date())
    .first()
  if (verified) {
    if (!verified.verifiedAt) {
      const verifiedAt = new Date()
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
