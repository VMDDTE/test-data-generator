const TYPE_VET = 'VetRecord'
const TYPE_VET_PRACTICE_RECORD = 'VetPracticeRecord'
const TYPE_VET_ROLE = 'VetRole'
const TYPE_VET_PRIMARY_ADMIN_ROLE = 'VetPrimaryAdminRole'
const TYPE_PRODUCT = 'Product'

const ACTION_CREATE = 'create'
const ACTION_UPDATE = 'update'
const ACTION_ASSIGN_ROLE = 'assignRole'

const ORG_TYPE_VET_PRACTICE = 0
const ORG_TYPE_MANUFACTURER = 1
const ORG_TYPE_IMPORTER = 2
const ORG_TYPE_VMD = 3

const USER_TYPE_VET = 0
const USER_TYPE_INTERNAL = 1

const ROLE_NAME_VET = 'vet'
const ROLE_NAME_VET_PRIMARY_ADMIN = 'vetPrimaryAdmin'

const LOCAL_STORAGE_NAME = 'local-storage'

module.exports = {
    TYPE_VET, TYPE_VET_PRACTICE_RECORD, TYPE_VET_ROLE, TYPE_VET_PRIMARY_ADMIN_ROLE, TYPE_PRODUCT,
    ACTION_CREATE, ACTION_UPDATE, ACTION_ASSIGN_ROLE,
    ORG_TYPE_VET_PRACTICE, ORG_TYPE_MANUFACTURER, ORG_TYPE_IMPORTER, ORG_TYPE_VMD,
    USER_TYPE_VET, USER_TYPE_INTERNAL,
    ROLE_NAME_VET, ROLE_NAME_VET_PRIMARY_ADMIN,
    LOCAL_STORAGE_NAME
}