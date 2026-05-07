// @ts-nocheck
import Module from 'module'
import path from 'path'

const moduleWithResolver = Module as typeof Module & {
  _resolveFilename: typeof Module._resolveFilename
}
const originalResolveFilename = moduleWithResolver._resolveFilename

moduleWithResolver._resolveFilename = function patchedResolveFilename(
  request,
  parent,
  isMain,
  options,
) {
  if (typeof request === 'string' && request.startsWith('@/')) {
    request = path.join(__dirname, request.slice(2))
  }

  return originalResolveFilename.call(this, request, parent, isMain, options)
}

const {
  ClaimRequestParseError,
  parseClaimJsonBody,
} = require('@/lib/positioning/access-claim-request') as typeof import('./lib/positioning/access-claim-request')

let testCount = 0
let passCount = 0
let failCount = 0

function assert(condition: boolean, message: string) {
  testCount += 1
  if (condition) {
    passCount += 1
    console.log(`PASS: ${message}`)
    return
  }

  failCount += 1
  console.log(`FAIL: ${message}`)
}

const valid = parseClaimJsonBody('{"hotel":"NOOM","phone":"0501195996"}')
assert(valid.hotel === 'NOOM', 'hotel est extrait depuis un JSON valide')
assert(valid.phone === '0501195996', 'telephone est extrait depuis un JSON valide')
assert(valid.launchRequested === false, 'launch vaut false par defaut')

const launchTrue = parseClaimJsonBody('{"hotel":"SEEN","phone":"0501195996","launch":true}')
assert(launchTrue.launchRequested === true, 'launch boolean true est reconnu')

const launchString = parseClaimJsonBody('{"hotel":"SEEN","phone":"0501195996","launch":"true"}')
assert(launchString.launchRequested === true, 'launch string true est reconnu')

let malformedError = null
try {
  parseClaimJsonBody('{hotel:"NOOM"}')
} catch (error) {
  malformedError = error
}
assert(
  malformedError instanceof ClaimRequestParseError,
  'un JSON invalide leve une erreur de parsing controlee',
)
assert(
  malformedError?.message === 'Requete invalide. Merci de verifier les informations saisies.',
  'le message utilisateur reste controle pour un JSON invalide',
)

let emptyError = null
try {
  parseClaimJsonBody('   ')
} catch (error) {
  emptyError = error
}
assert(emptyError instanceof ClaimRequestParseError, 'un body vide leve aussi une erreur controlee')

console.log(`Total: ${testCount}`)
console.log(`Passes: ${passCount}`)
console.log(`Echoues: ${failCount}`)

if (failCount > 0) {
  process.exitCode = 1
}
