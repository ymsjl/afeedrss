import { HttpResponse, HttpResponseResolver } from 'msw'
import { db } from './db'

export const getUserInfoMock: HttpResponseResolver = () => {
  const user = db.user.findFirst({ where: {} })
  
  if (!user) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return HttpResponse.json({
    userId: user.id,
    userName: user.userName,
    userProfileId: user.userProfileId,
    userEmail: user.userEmail,
    isBloggerUser: user.isBloggerUser,
    signupTimeSec: user.signupTimeSec,
    isMultiLoginEnabled: user.isMultiLoginEnabled
  })
}