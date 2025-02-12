import { CloudProviderEnum, DatabaseAccessibilityEnum, DatabaseModeEnum } from 'qovery-typescript-axios'
import { FormEventHandler } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Value } from '@qovery/shared/interfaces'
import { SERVICES_URL } from '@qovery/shared/router'
import { BlockContent, Button, ButtonSize, ButtonStyle, InputRadio, InputSelect, InputText } from '@qovery/shared/ui'
import { GeneralData } from '../../../feature/page-database-create-feature/database-creation-flow.interface'

export interface PageDatabaseCreateGeneralProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  databaseTypeOptions?: Value[]
  databaseVersionOptions?: { [Key: string]: Value[] }
  cloudProvider?: string
}

export function PageDatabaseCreateGeneral(props: PageDatabaseCreateGeneralProps) {
  const { control, formState, watch } = useFormContext<GeneralData>()
  const { organizationId = '', environmentId = '', projectId = '' } = useParams()
  const navigate = useNavigate()
  const { databaseTypeOptions, databaseVersionOptions = {} } = props

  const watchType = watch('type')
  const watchMode = watch('mode')

  return (
    <div>
      <div className="mb-10">
        <h3 className="text-text-700 text-lg mb-2">General informations</h3>
        <p className="text-text-500 text-sm mb-2">
          General settings allow you to set up your application name, git repository or container settings.
        </p>
      </div>

      <form onSubmit={props.onSubmit}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'Please enter a name',
          }}
          render={({ field, fieldState: { error } }) => (
            <InputText
              className="mb-3"
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              label="Database name"
              error={error?.message}
            />
          )}
        />

        <BlockContent title="Select the mode for you database" className="mb-6">
          <div className="flex gap-4 justify-center">
            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <>
                  {props.cloudProvider === CloudProviderEnum.AWS && (
                    <InputRadio
                      className="mb-3"
                      value={DatabaseModeEnum.MANAGED}
                      name={field.name}
                      description="Managed by your cloud provider. Back-ups and snapshots will be periodically created."
                      onChange={field.onChange}
                      formValue={field.value}
                      label="Mode managed"
                    />
                  )}
                  <InputRadio
                    value={DatabaseModeEnum.CONTAINER}
                    className="mb-3"
                    name={field.name}
                    description="Deployed on your Kubernetes cluster. Not for production purposes, no back-ups nor stansphots."
                    onChange={field.onChange}
                    formValue={field.value}
                    label="Mode container"
                  />
                </>
              )}
            />
          </div>
        </BlockContent>

        <div className="h-[1px] bg-element-light-lighter-400 w-full my-6"></div>

        <Controller
          name="type"
          control={control}
          rules={{ required: 'Please select a database type' }}
          render={({ field, fieldState: { error } }) => (
            <InputSelect
              label="Database type"
              options={databaseTypeOptions || []}
              onChange={field.onChange}
              value={field.value}
              error={error?.message}
              className="mb-3"
            />
          )}
        />

        <Controller
          name="version"
          control={control}
          rules={{ required: 'Please select a database version' }}
          render={({ field, fieldState: { error } }) => (
            <InputSelect
              label="Version"
              options={databaseVersionOptions[`${watchType}-${watchMode}`] || []}
              onChange={field.onChange}
              value={field.value}
              error={error?.message}
              className={`mb-3 ${watchType && watchMode ? '' : 'hidden'}`}
            />
          )}
        />

        <Controller
          name="accessibility"
          control={control}
          rules={{ required: 'Please select an accessibility' }}
          render={({ field, fieldState: { error } }) => (
            <InputSelect
              label="Accessibility"
              options={[
                {
                  label: 'Private',
                  value: DatabaseAccessibilityEnum.PRIVATE,
                },
                {
                  label: 'Public',
                  value: DatabaseAccessibilityEnum.PUBLIC,
                },
              ]}
              onChange={field.onChange}
              value={field.value}
              error={error?.message}
              className="mb-10"
            />
          )}
        />

        <div className="flex justify-between">
          <Button
            onClick={() => navigate(SERVICES_URL(organizationId, projectId, environmentId))}
            type="button"
            className="btn--no-min-w"
            size={ButtonSize.XLARGE}
            style={ButtonStyle.STROKED}
          >
            Cancel
          </Button>
          <Button
            dataTestId="button-submit"
            type="submit"
            disabled={!formState.isValid}
            size={ButtonSize.XLARGE}
            style={ButtonStyle.BASIC}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PageDatabaseCreateGeneral
