import { HttpResponse, HttpResponseResolver } from 'msw'

export const getUserInfoMock: HttpResponseResolver = () => {
  return HttpResponse.json({
    userId: 'mock-user-id',
    userName: 'Mock User',
    userProfileId: 'mock-profile-id',
    userEmail: 'mock@example.com',
    isBloggerUser: false,
    signupTimeSec: 1617235200, // 2021-04-01
    isMultiLoginEnabled: true
  })
}