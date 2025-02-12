import { act, getByTestId } from '@testing-library/react'
import { render } from '__tests__/utils/setup-jest'
import { ServiceTypeEnum } from '@qovery/shared/enums'
import { ApplicationContainerCreateContext } from '../page-application-create-feature'
import PageApplicationCreatePortFeature from './page-application-create-port-feature'

describe('PageApplicationCreatePortFeature', () => {
  let context: any

  beforeEach(() => {
    context = {
      currentStep: 1,
      setCurrentStep: jest.fn(),
      generalData: { name: 'test', applicationSource: ServiceTypeEnum.APPLICATION },
      setGeneralData: jest.fn(),
      resourcesData: undefined,
      setResourcesData: jest.fn(),
      setPortData: jest.fn(),
      portData: {
        ports: [
          {
            application_port: 3000,
            external_port: 3000,
            is_public: false,
          },
        ],
      },
    }
  })

  it('should render successfully', () => {
    const { baseElement } = render(
      <ApplicationContainerCreateContext.Provider value={context}>
        <PageApplicationCreatePortFeature />
      </ApplicationContainerCreateContext.Provider>
    )
    expect(baseElement).toBeTruthy()
  })

  it('should submit the data to the context', async () => {
    const { baseElement } = render(
      <ApplicationContainerCreateContext.Provider value={context}>
        <PageApplicationCreatePortFeature />
      </ApplicationContainerCreateContext.Provider>
    )

    await act(() => {})

    const button = getByTestId(baseElement, 'button-submit')
    expect(button).not.toBeDisabled()

    await act(() => {
      button.click()
    })

    expect(context.setPortData).toHaveBeenCalled()
  })
})
