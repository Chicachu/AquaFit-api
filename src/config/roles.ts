import { AccessControl } from 'accesscontrol'
import { Role } from '../types/enums/Role'

const ac = new AccessControl()
const PROFILE='clientProfile'

function roles(): AccessControl {
  ac.grant(Role.CLIENT)
    .readOwn(PROFILE)
  
  ac.grant(Role.INSTRUCTOR)
    .extend(Role.CLIENT)
    .readAny(PROFILE)
  
  ac.grant(Role.ADMIN)
    .extend(Role.CLIENT)
    .extend(Role.INSTRUCTOR)
    .updateAny(PROFILE)
    .deleteAny(PROFILE)

  return ac
}

export { roles }