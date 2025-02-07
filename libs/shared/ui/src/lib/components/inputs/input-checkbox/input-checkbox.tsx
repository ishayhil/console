import { FormEvent, useEffect, useState } from 'react'

export interface InputCheckboxProps {
  name: string
  value: string
  id?: string
  label?: string
  isChecked?: boolean
  className?: string
  onChange?: (e: FormEvent<HTMLInputElement> | Event) => void
  disabled?: boolean
  type?: string
  formValue?: string
  dataTestId?: string
}

export function InputCheckbox(props: InputCheckboxProps) {
  const {
    name,
    value,
    onChange,
    isChecked = false,
    className = '',
    label = '',
    disabled = false,
    type = 'checkbox',
    formValue,
    id = name,
    dataTestId = 'input-checkbox',
  } = props

  const [check, setCheck] = useState(isChecked)

  useEffect(() => {
    setCheck(isChecked)
  }, [isChecked])

  useEffect(() => {
    setCheck(value === formValue)
  }, [formValue, value])

  const inputChange = (check: boolean, e: FormEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    type === 'checkbox' && setCheck(check)
  }

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <input
        data-testid={dataTestId}
        id={id}
        type={type}
        name={name}
        value={value}
        checked={check}
        disabled={disabled}
        onChange={(e) => inputChange(e.currentTarget.checked, e)}
        className={`input-checkbox relative font-icons w-0 h-0 mr-5 appearance-none before:absolute before:flex before:justify-center before:items-center before:text-white before:w-4 before:h-4 before:top-0 before:left-0 before:-translate-y-1/2 before:rounded-sm before:bg-white ${
          disabled
            ? 'before:border-element-light-lighter-500'
            : 'before:border-element-light-lighter-700 cursor-pointer'
        } before:border-2 before:font-black before:text-xs before:leading-none before:content-[''] before:transition-all`}
      />
      {label && (
        <label htmlFor={id} className="cursor-pointer leading-5 h-5 text-text-700 text-sm">
          {label}
        </label>
      )}
    </div>
  )
}

export default InputCheckbox
