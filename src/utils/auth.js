import jwt from "jsonwebtoken"

export const signToken = async (res, userId) => {
  const token = jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY,
    { expiresIn: '1h' })
  const bearerToken = `Bearer ${token}`
  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY,
    { expiresIn: '7d' })
  const bearerRefreshToken = `Bearer ${refreshToken}`
  res.cookie('authorization', bearerToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 1000 * 60 * 60)
  })
  res.cookie('refreshToken', bearerRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

  })
  return {
    token,
    refreshToken
  }

}