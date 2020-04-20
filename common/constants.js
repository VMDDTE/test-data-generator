const ACTION_TYPE_VET = 'VetRecord'
const ACTION_TYPE_INTERNAL_USER = 'UserRecord'
const ACTION_TYPE_VET_PRACTICE_RECORD = 'VetPracticeRecord'
const ACTION_TYPE_VET_ROLE = 'VetRole'
const ACTION_TYPE_VET_PRIMARY_ADMIN_ROLE = 'VetPrimaryAdminRole'
const ACTION_TYPE_PRIMARY_ADMIN_ROLE = 'PrimaryAdminRole'
const ACTION_TYPE_ADMIN_ROLE = 'AdminRole'
const ACTION_TYPE_AUTHORISED_ROLE = 'AuthorisedRole'
const ACTION_TYPE_PRODUCT = 'ProductRecord'
const ACTION_TYPE_SPECIES = 'SpeciesRecord'
const ACTION_TYPE_SPECIES_QUALIFYING = 'SpeciesQualifyingRecord'
const ACTION_TYPE_REFERENCE_DATA = 'ReferenceDataRecord'
const ACTION_TYPE_SUBSTANCE = 'SubstanceRecord'
const ACTION_TYPE_SUBSTANCE_QUALIFIER = 'SubstanceQualifierRecord'
const ACTION_TYPE_MANUFACTURER = 'ManufacturerRecord'
const ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER = "MarketingAuthorisationHolderRecord"
const ACTION_TYPE_WHOLESALER = 'WholesalerRecord'
const ACTION_TYPE_ORGANISATION = 'OrganisationRecord'
const ACTION_TYPE_SPECIAL_IMPORT_APPLICATION = 'SpecialImportApplicationRecord'
const ACTION_TYPE_MARKETING_AUTHORISATION = 'MarketingAuthorisation'
const ACTION_TYPE_NEW_MARKETING_AUTHORISATION_APPLICATION = 'NewMarketingAuthorisationApplicationRecord'
const ACTION_TYPE_RENEWAL_MARKETING_AUTHORISATION_APPLICATION = 'RenewalMarketingAuthorisationApplicationRecord'
const ACTION_TYPE_VARIATION_MARKETING_AUTHORISATION_APPLICATION = 'VariationMarketingAuthorisationApplicationRecord'
const ACTION_TYPE_DRAFT_MARKETING_AUTHORISATION_APPLICATION = 'DraftMarketingAuthorisationApplicationRecord'
const ACTION_TYPE_JOB_MARKETING_AUTHORISATION_RENEWAL = 'MarketingAuthorisationRenewalJob'
const ACTION_TYPE_JOB_MARKETING_AUTHORISATION_NEW = 'MarketingAuthorisationNewJob'
const ACTION_TYPE_JOB_REGISTRATION = 'RegistrationJob'
const ACTION_TYPE_EXTERNAL_USER = 'ExternalUserRecord'
const ACTION_TYPE_SECURE_MESSAGE = 'SecureMessageRecord'
const ACTION_TYPE_SENT_MESSAGE = 'SentMessageRecord'
const ACTION_TYPE_STORAGE = 'StorageRecord'
const ACTION_TYPE_USER = 'UserRecord'

const ACTION_CREATE = 'create'
const ACTION_DELETE = 'delete'
const ACTION_GET = 'get'
const ACTION_UPDATE = 'update'
const ACTION_ASSIGN_ROLE = 'assignRole'
const ACTION_SEND_INVITE = 'sendInvite'

const ORG_TYPE_VET_PRACTICE = 0
const ORG_TYPE_MANUFACTURER = 1
const ORG_TYPE_IMPORTER = 2
const ORG_TYPE_VMD = 3

const JOB_TYPE_REGISTRATION = 'Registration'
const JOB_TYPE_MARKETING_AUTHORISATION_RENEWAL = 'MarketingAuthorisationRenewal'
const JOB_TYPE_MARKETING_AUTHORISATION_NEW = 'MarketingAuthorisationNew'

const ORG_TYPE_NAME_VET_PRACTICE = "VetPractice"
const ORG_TYPE_NAME_MANUFACTURER = "Manufacturer"
const ORG_TYPE_NAME_WHOLESALER = "Wholesaler"
const ORG_TYPE_NAME_MARKETING_AUTHORISATION_HOLDER = "MarketingAuthorisationHolder"

const USER_TYPE_VET = 0
const USER_TYPE_INTERNAL = 1

const ROLE_NAME_VET = 'vet'
const ROLE_NAME_VET_PRIMARY_ADMIN = 'vetPrimaryAdmin'
const ROLE_NAME_PRIMARY_ADMIN = 'PrimaryAdmin'
const ROLE_NAME_AUTHORISED_USER = 'AuthorisedUser'
const ROLE_NAME_ADMIN = 'Admin'

const LOCAL_STORAGE_NAME = 'local-storage'

const DEFAULT_USER_PASSWORD = 'L30n0rL0b3t0!'

module.exports = {
    ACTION_TYPE_INTERNAL_USER,
    ACTION_TYPE_VET,
    ACTION_TYPE_VET_PRACTICE_RECORD,
    ACTION_TYPE_VET_ROLE,
    ACTION_TYPE_VET_PRIMARY_ADMIN_ROLE,
    ACTION_TYPE_PRIMARY_ADMIN_ROLE,
    ACTION_TYPE_AUTHORISED_ROLE,
    ACTION_TYPE_ADMIN_ROLE,
    ACTION_TYPE_PRODUCT,
    ACTION_TYPE_SPECIES,
    ACTION_TYPE_SPECIES_QUALIFYING,
    ACTION_TYPE_REFERENCE_DATA,
    ACTION_TYPE_SUBSTANCE,
    ACTION_TYPE_SUBSTANCE_QUALIFIER,
    ACTION_TYPE_MANUFACTURER,
    ACTION_TYPE_ORGANISATION,
    ACTION_TYPE_SPECIAL_IMPORT_APPLICATION,
    ACTION_TYPE_MARKETING_AUTHORISATION,
    ACTION_TYPE_NEW_MARKETING_AUTHORISATION_APPLICATION,
    ACTION_TYPE_RENEWAL_MARKETING_AUTHORISATION_APPLICATION,
    ACTION_TYPE_DRAFT_MARKETING_AUTHORISATION_APPLICATION,
    ACTION_TYPE_VARIATION_MARKETING_AUTHORISATION_APPLICATION,
    ACTION_TYPE_WHOLESALER,
    ACTION_TYPE_MARKETING_AUTHORISATION_HOLDER,
    ACTION_TYPE_EXTERNAL_USER,
    ACTION_TYPE_JOB_MARKETING_AUTHORISATION_RENEWAL,
    ACTION_TYPE_JOB_MARKETING_AUTHORISATION_NEW,
    ACTION_TYPE_JOB_REGISTRATION,
    ACTION_TYPE_SECURE_MESSAGE,
    ACTION_TYPE_SENT_MESSAGE,
    ACTION_TYPE_STORAGE,
    ACTION_TYPE_USER,
    ACTION_TYPE_AUDIT,
    ACTION_CREATE,
    ACTION_DELETE,
    ACTION_GET,
    ACTION_UPDATE,
    ACTION_ASSIGN_ROLE,
    ACTION_SEND_INVITE,
    ORG_TYPE_VET_PRACTICE,
    ORG_TYPE_MANUFACTURER,
    ORG_TYPE_IMPORTER,
    ORG_TYPE_VMD,
    ORG_TYPE_NAME_VET_PRACTICE,
    ORG_TYPE_NAME_MANUFACTURER,
    ORG_TYPE_NAME_WHOLESALER,
    ORG_TYPE_NAME_MARKETING_AUTHORISATION_HOLDER,
    JOB_TYPE_REGISTRATION,
    JOB_TYPE_MARKETING_AUTHORISATION_RENEWAL,
    JOB_TYPE_MARKETING_AUTHORISATION_NEW,
    USER_TYPE_VET,
    USER_TYPE_INTERNAL,
    ROLE_NAME_VET,
    ROLE_NAME_VET_PRIMARY_ADMIN,
    ROLE_NAME_ADMIN,
    ROLE_NAME_AUTHORISED_USER,
    ROLE_NAME_PRIMARY_ADMIN,
    LOCAL_STORAGE_NAME,
    DEFAULT_USER_PASSWORD
}
