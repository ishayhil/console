import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EnvironmentEntity } from '@qovery/shared/interfaces'
import { SERVICES_GENERAL_URL, SERVICES_URL } from '@qovery/shared/router'
import { BaseLink, EmptyState, HelpSection, StatusMenuActions, Table } from '@qovery/shared/ui'
import { isDeleteAvailable } from '@qovery/shared/utils'
import TableRowEnvironments from '../table-row-environments/table-row-environments'

export interface PageGeneralProps {
  environments: EnvironmentEntity[]
  buttonActions: StatusMenuActions[]
  listHelpfulLinks: BaseLink[]
  removeEnvironment: (environmentId: string, name: string) => void
  isLoading?: boolean
}

function PageGeneralMemo(props: PageGeneralProps) {
  const { environments, buttonActions, listHelpfulLinks, removeEnvironment } = props
  const { organizationId, projectId } = useParams()

  const [data, setData] = useState(environments)

  useEffect(() => {
    setData(environments)
  }, [environments])

  const tableHead = [
    {
      title: `Environment${data.length > 1 ? 's' : ''}`,
      className: 'px-4 py-2',
      filter: [
        {
          search: true,
          title: 'Filter by status',
          key: 'status.state',
        },
        {
          title: 'Filter by provider',
          key: 'cloud_provider.provider',
        },
      ],
    },
    {
      title: 'Update',
      className: 'px-4 text-right',
      sort: {
        key: 'updated_at',
      },
    },
    {
      title: 'Type',
      className: 'px-4 py-2 border-b-element-light-lighter-400 border-l h-full',
      filter: [
        {
          search: true,
          title: 'Filter by environment type',
          key: 'mode',
        },
      ],
    },
  ]

  const columnWidth = '30% 25% 40%'

  return (
    <>
      {environments.length ? (
        <Table
          dataHead={tableHead}
          defaultData={environments}
          filterData={data}
          setFilterData={setData}
          className="mt-2 bg-white rounded-sm flex-grow overflow-y-auto min-h-0"
          columnsWidth={columnWidth}
        >
          <>
            {data.map((currentData) => (
              <TableRowEnvironments
                key={currentData.id}
                data={currentData}
                dataHead={tableHead}
                link={`${SERVICES_URL(organizationId, projectId, currentData.id)}${SERVICES_GENERAL_URL}`}
                columnsWidth={columnWidth}
                buttonActions={buttonActions}
                removeEnvironment={
                  currentData?.status && isDeleteAvailable(currentData?.status?.state) ? removeEnvironment : undefined
                }
              />
            ))}
          </>
        </Table>
      ) : (
        !props.isLoading && (
          <EmptyState
            className="bg-white rounded-t-sm mt-2 pt-10"
            title="No environment found"
            description="Please create your first environment"
            imageWidth="w-[160px]"
          />
        )
      )}

      <div className="bg-white rounded-b flex flex-col justify-end">
        <HelpSection description="Need help? You may find these links useful" links={listHelpfulLinks} />
      </div>
    </>
  )
}

export const PageGeneral = React.memo(PageGeneralMemo, (prevProps, nextProps) => {
  // Stringify is necessary to avoid Redux selector behavior
  const isEqual =
    JSON.stringify(
      prevProps.environments.map((environment) => ({
        status: environment.status?.state,
        running_status: environment.running_status?.state,
      }))
    ) ===
    JSON.stringify(
      nextProps.environments.map((environment) => ({
        status: environment.status?.state,
        running_status: environment.running_status?.state,
      }))
    )

  return isEqual
})
