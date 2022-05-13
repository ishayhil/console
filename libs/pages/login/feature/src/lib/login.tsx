import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { LayoutLogin, Login } from '@console/pages/login/ui'
import { ONBOARDING_URL, useAuth, useDocumentTitle, AuthEnum, OVERVIEW_URL } from '@console/shared/utils'
import { useOrganization } from '@console/domains/organization'
import { useProjects } from '@console/domains/projects'
// import posthog from 'posthog-js'

export function LoginPage() {
  const navigate = useNavigate()
  const { authLogin, createAuthCookies, checkIsAuthenticated } = useAuth()
  const { getOrganization } = useOrganization()
  const { getProjects } = useProjects()

  useDocumentTitle('Login - Qovery')

  const onClickAuthLogin = async (provider: string) => {
    await authLogin(provider)
  }

  useEffect(() => {
    // const isOnboarding = posthog && posthog.isFeatureEnabled('v3-onboarding')
    const isOnboarding = process.env?.['NX_ONBOARDING'] === 'true'
    console.log(process.env?.['NX_ONBOARDING'])
    console.log(isOnboarding)

    async function fetchData() {
      const organization = await getOrganization()
      await createAuthCookies()

      if (!isOnboarding && organization.payload.length > 0) {
        const organizationId = organization.payload[0].id
        const projects = await getProjects(organizationId)
        if (projects.payload.length > 0) navigate(OVERVIEW_URL(organizationId, projects.payload[0].id))
      }
      if (isOnboarding && organization.payload.length === 0) {
        navigate(ONBOARDING_URL)
      }
      if (isOnboarding && organization.payload.length > 0) {
        window.location.replace(`${process.env['NX_URL'] || 'https://console.qovery.com'}?redirectLoginV3`)
      }
    }
    if (checkIsAuthenticated) {
      fetchData()
    }
  }, [getProjects, getOrganization, navigate, checkIsAuthenticated, createAuthCookies])

  return (
    <LayoutLogin>
      <Login
        onClickAuthLogin={onClickAuthLogin}
        githubType={AuthEnum.GITHUB}
        gitlabType={AuthEnum.GITLAB}
        bitbucketType={AuthEnum.BITBUCKET}
      />
    </LayoutLogin>
  )
}

export default LoginPage
