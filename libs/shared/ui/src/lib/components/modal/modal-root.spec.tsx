import {
  fireEvent,
  getByRole,
  getByTestId,
  queryByRole,
  queryByTestId,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import exp from 'constants'
import { useContext, useEffect } from 'react'
import { useEventSource } from 'react-use-websocket'
import ModalRoot, { ModalContext } from './modal-root'
import useModal from './use-modal/use-modal'

function Content(props: { shouldConfirm?: boolean }) {
  const { openModal, enableAlertClickOutside } = useModal()

  useEffect(() => {
    enableAlertClickOutside(props.shouldConfirm || false)
  }, [enableAlertClickOutside])

  return (
    <div>
      <button onClick={() => openModal({ content: <p>content</p> })}>Open modal</button>
    </div>
  )
}

describe('ModalRoot', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalRoot>
        <Content />
      </ModalRoot>
    )
    expect(baseElement).toBeTruthy()
  })

  it('should ask for confirmation before closing the modal and click on yes should close everything', async () => {
    const { baseElement } = render(
      <ModalRoot>
        <Content shouldConfirm={true} />
      </ModalRoot>
    )

    const button = getByRole(baseElement, 'button')
    fireEvent.click(button)

    await waitFor(() => {})

    let overlay: HTMLElement | null = getByTestId(baseElement, 'overlay')
    fireEvent.click(overlay)

    await waitFor(() => {})
    getByTestId(baseElement, 'modal-alert')

    const yesButton = getByRole(baseElement, 'button', { name: 'Yes' })
    fireEvent.click(yesButton)

    await waitFor(() => {})
    overlay = queryByTestId(baseElement, 'overlay')
    expect(overlay).toBeNull()
  })

  it('should NOT ask for confirmation before closing the modal', async () => {
    const { baseElement } = render(
      <ModalRoot>
        <Content shouldConfirm={false} />
      </ModalRoot>
    )

    const button = getByRole(baseElement, 'button')
    fireEvent.click(button)

    await waitFor(() => {})

    const overlay: HTMLElement | null = getByTestId(baseElement, 'overlay')
    fireEvent.click(overlay)

    await waitFor(() => {})
    const alertModal = queryByTestId(baseElement, 'modal-alert')
    expect(alertModal).toBeNull()
  })
})
