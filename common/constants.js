const TYPE_VET = 'VetRecord'
const TYPE_INTERNAL_USER = 'UserRecord'
const TYPE_VET_PRACTICE_RECORD = 'VetPracticeRecord'
const TYPE_VET_ROLE = 'VetRole'
const TYPE_VET_PRIMARY_ADMIN_ROLE = 'VetPrimaryAdminRole'
const TYPE_USER_ADMIN_ROLE = 'UserAdminRole'
const TYPE_USER_PRIMARY_ADMIN_ROLE = 'UserPrimaryAdminRole'
const TYPE_USER_AUTHORISED_USER_ROLE = 'UserAuthorisedRole'
const TYPE_PRODUCT = 'ProductRecord'
const TYPE_SPECIES = 'SpeciesRecord'
const TYPE_SPECIES_QUALIFYING = 'SpeciesQualifyingRecord'
const TYPE_SUBSTANCE = 'SubstanceRecord'
const TYPE_SUBSTANCE_QUALIFIER = 'SubstanceQualifierRecord'
const TYPE_MANUFACTURER = 'ManufacturerRecord'
const TYPE_ORGANISATION = 'OrganisationRecord'
const TYPE_SPECIAL_IMPORT_APPLICATION = 'SpecialImportApplicationRecord'
const TYPE_EXTERNAL_USER = 'ExternalUserRecord'

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
const ROLE_NAME_PRIMARY_ADMIN = 'PrimaryAdmin'
const ROLE_NAME_ADMIN = 'Admin'
const ROLE_NAME_AUTHORISED_USER = 'AuthorisedUser'

const LOCAL_STORAGE_NAME = 'local-storage'

const DEFAULT_USER_PASSWORD = 'L30n0rL0b3t0!'

module.exports = {
    TYPE_INTERNAL_USER,
    TYPE_VET,
    TYPE_VET_PRACTICE_RECORD,
    TYPE_VET_ROLE,
    TYPE_VET_PRIMARY_ADMIN_ROLE,
    TYPE_USER_ADMIN_ROLE,
    TYPE_USER_PRIMARY_ADMIN_ROLE,
    TYPE_USER_AUTHORISED_ROLE: TYPE_USER_AUTHORISED_USER_ROLE,
    TYPE_PRODUCT,
    TYPE_SPECIES,
    TYPE_SPECIES_QUALIFYING,
    TYPE_SUBSTANCE,
    TYPE_SUBSTANCE_QUALIFIER,
    TYPE_MANUFACTURER,
    TYPE_ORGANISATION,
    TYPE_SPECIAL_IMPORT_APPLICATION,
    TYPE_EXTERNAL_USER,
    ACTION_CREATE,
    ACTION_UPDATE,
    ACTION_ASSIGN_ROLE,
    ORG_TYPE_VET_PRACTICE,
    ORG_TYPE_MANUFACTURER,
    ORG_TYPE_IMPORTER,
    ORG_TYPE_VMD,
    USER_TYPE_VET,
    USER_TYPE_INTERNAL,
    ROLE_NAME_VET,
    ROLE_NAME_VET_PRIMARY_ADMIN,
    ROLE_NAME_PRIMARY_ADMIN,
    ROLE_NAME_ADMIN,
    ROLE_NAME_AUTHORISED_USER,
    LOCAL_STORAGE_NAME,
    DEFAULT_USER_PASSWORD
}
