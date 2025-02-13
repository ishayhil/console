import { act } from '@testing-library/react'
import { render } from '__tests__/utils/setup-jest'
import { wrapWithReactHookForm } from '__tests__/utils/wrap-with-react-hook-form'
import PageApplicationCreatePort, { PageApplicationCreatePortProps } from './page-application-create-port'

const props: PageApplicationCreatePortProps = {
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  onAddPort: jest.fn(),
  onRemovePort: jest.fn(),
  ports: [
    {
      application_port: 3000,
      external_port: 3000,
      is_public: false,
    },
    {
      application_port: 4000,
      external_port: 3000,
      is_public: true,
    },
  ],
}

describe('PageApplicationCreatePort', () => {
  it('should render successfully', () => {
    const { baseElement } = render(wrapWithReactHookForm(<PageApplicationCreatePort {...props} />))
    expect(baseElement).toBeTruthy()
  })

  it('should render two rows', () => {
    const { getAllByTestId } = render(wrapWithReactHookForm(<PageApplicationCreatePort {...props} />))
    expect(getAllByTestId('port-row')).toHaveLength(2)
  })

  it('should submit the form', async () => {
    const { getAllByTestId } = render(
      wrapWithReactHookForm(<PageApplicationCreatePort {...props} />, { defaultValues: { ports: props.ports } })
    )

    await act(() => {})

    const button = getAllByTestId('button-submit')[0]
    expect(button).not.toBeDisabled()

    await act(() => {
      button.click()
    })

    expect(props.onSubmit).toHaveBeenCalled()
  })
})
