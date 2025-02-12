import {
  Route,
  SETTINGS_BILLING_URL,
  SETTINGS_CLUSTER_URL,
  SETTINGS_CONTAINER_REGISTRIES_URL,
  SETTINGS_DANGER_ZONE_URL,
  SETTINGS_GENERAL_URL,
  SETTINGS_MEMBERS_URL,
  SETTINGS_ROLES_EDIT_URL,
  SETTINGS_ROLES_URL,
} from '@qovery/shared/router'
import { PageOrganizationClusterFeature } from '../feature/page-organization-cluster-feature/page-organization-cluster-feature'
import { PageOrganizationContainerRegistriesFeature } from '../feature/page-organization-container-registries-feature/page-organization-container-registries-feature'
import { PageOrganizationDangerZoneFeature } from '../feature/page-organization-danger-zone-feature/page-organization-danger-zone-feature'
import { PageOrganizationGeneralFeature } from '../feature/page-organization-general-feature/page-organization-general-feature'
import { PageOrganizationMembersFeature } from '../feature/page-organization-members-feature/page-organization-members-feature'
import { PageOrganizationRolesEditFeature } from '../feature/page-organization-roles-edit-feature/page-organization-roles-edit-feature'
import { PageOrganizationRolesFeature } from '../feature/page-organization-roles-feature/page-organization-roles-feature'
import PageSettingsV2 from '../ui/page-settings-v2/page-settings-v2'

export const ROUTER_SETTINGS: Route[] = [
  {
    path: SETTINGS_GENERAL_URL,
    component: <PageOrganizationGeneralFeature />,
  },
  {
    path: SETTINGS_MEMBERS_URL,
    component: <PageOrganizationMembersFeature />,
  },
  {
    path: SETTINGS_ROLES_URL,
    component: <PageOrganizationRolesFeature />,
  },
  {
    path: SETTINGS_ROLES_EDIT_URL(),
    component: <PageOrganizationRolesEditFeature />,
  },
  {
    path: SETTINGS_BILLING_URL,
    component: <PageSettingsV2 path="billing" />,
  },
  {
    path: SETTINGS_CONTAINER_REGISTRIES_URL,
    component: <PageOrganizationContainerRegistriesFeature />,
  },
  {
    path: SETTINGS_CLUSTER_URL,
    component: <PageOrganizationClusterFeature />,
  },
  {
    path: SETTINGS_DANGER_ZONE_URL,
    component: <PageOrganizationDangerZoneFeature />,
  },
]
