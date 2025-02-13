import { act } from '@testing-library/react'
import ResizeObserver from '__tests__/utils/resize-observer'
import { getByTestId, render } from '__tests__/utils/setup-jest'
import { DatabaseAccessibilityEnum, DatabaseModeEnum, DatabaseTypeEnum } from 'qovery-typescript-axios'
import { ReactNode } from 'react'
import { DatabaseCreateContext } from '../page-database-create-feature'
import PageDatabaseCreateGeneralFeature from '../page-database-create-general-feature/page-database-create-general-feature'
import PageDatabaseCreateResourcesFeature from './page-database-create-resources-feature'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useParams: () => ({ organizationId: '1', projectId: '2', environmentId: '3' }),
  useNavigate: () => mockNavigate,
}))

const mockSetResourcesData = jest.fn()
const ContextWrapper = (props: { children: ReactNode }) => {
  return (
    <DatabaseCreateContext.Provider
      value={{
        currentStep: 1,
        setCurrentStep: jest.fn(),
        generalData: {
          name: 'test',
          accessibility: DatabaseAccessibilityEnum.PRIVATE,
          version: '1',
          type: DatabaseTypeEnum.MYSQL,
          mode: DatabaseModeEnum.MANAGED,
        },
        setGeneralData: jest.fn(),
        resourcesData: {
          storage: 1,
          cpu: [100],
          storage_unit: 'GB',
          memory: 100,
          memory_unit: 'MB',
        },
        setResourcesData: mockSetResourcesData,
      }}
    >
      {props.children}
    </DatabaseCreateContext.Provider>
  )
}

describe('PageDatabaseCreateResourcesFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ContextWrapper>
        <PageDatabaseCreateResourcesFeature />
      </ContextWrapper>
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render successfully', () => {
    const { baseElement } = render(
      <ContextWrapper>
        <PageDatabaseCreateGeneralFeature />
      </ContextWrapper>
    )
    expect(baseElement).toBeTruthy()
  })

  it('should submit form and navigate', async () => {
    window.ResizeObserver = ResizeObserver
    const { baseElement } = render(
      <ContextWrapper>
        <PageDatabaseCreateResourcesFeature />
      </ContextWrapper>
    )

    await act(() => {})

    const button = getByTestId(baseElement, 'button-submit')
    expect(button).not.toBeDisabled()

    await act(() => {
      button.click()
    })

    expect(mockSetResourcesData).toHaveBeenCalledWith({
      storage: 1,
      cpu: [100],
      storage_unit: 'GB',
      memory: 100,
      memory_unit: 'MB',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/organization/1/project/2/environment/3/services/create/database/post')
  })
})
