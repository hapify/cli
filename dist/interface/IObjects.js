"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Possible values for actions' access:
 *  - admin (Denotes if the access is restricted to the admins)
 *  - owner (Denotes if the access is restricted to the owner of the resource)
 *  - authenticated (Denotes if the access is restricted to authenticated users)
 *  - guest (Denotes if the access is not restricted)
 */
class Access {
    /**
     * Returns the list of permissions ordered by restriction
     * @return {string[]}
     */
    static list() {
        return [
            Access.ADMIN,
            Access.OWNER,
            Access.AUTHENTICATED,
            Access.GUEST,
        ];
    }
}
Access.GUEST = 'guest';
Access.AUTHENTICATED = 'auth';
Access.OWNER = 'owner';
Access.ADMIN = 'admin';
exports.Access = Access;
//# sourceMappingURL=IObjects.js.map