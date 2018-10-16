"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
class Context {
}
Context.GUEST = 'guest';
Context.AUTHENTICATED = 'auth';
Context.OWNER = 'owner';
Context.ADMIN = 'admin';
exports.Context = Context;
//# sourceMappingURL=IObjects.js.map