import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const USER = 'admin'
const PASS = 'supersecreto'

const middleware = (request: NextRequest) => {
  const basicAuth = request.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pass] = atob(authValue).split(':')

    if (user === USER && pass === PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export default middleware

export const config = {
  matcher: ['/admin'],
}
