import crypto from 'crypto'

export const md5 = (input: string) =>
  crypto.createHash('md5').update(input).digest('hex')
