import { DatabaseModeEnum } from 'qovery-typescript-axios'
import { useNavigate, useParams } from 'react-router-dom'
import { DeployOtherCommitModalFeature } from '@qovery/shared/console-shared'
import { IconEnum, RunningStatus, ServiceTypeEnum } from '@qovery/shared/enums'
import {
  ApplicationEntity,
  ContainerApplicationEntity,
  DatabaseEntity,
  GitApplicationEntity,
} from '@qovery/shared/interfaces'
import { APPLICATION_LOGS_URL } from '@qovery/shared/router'
import {
  ButtonIconAction,
  Icon,
  IconAwesomeEnum,
  Skeleton,
  StatusChip,
  StatusLabel,
  StatusMenuActions,
  TableHeadProps,
  TableRow,
  Tag,
  TagCommit,
  Tooltip,
  useModal,
} from '@qovery/shared/ui'
import { timeAgo, upperCaseFirstLetter, urlCodeEditor } from '@qovery/shared/utils'

export interface TableRowServicesProps {
  data: ApplicationEntity | DatabaseEntity
  type: ServiceTypeEnum
  environmentMode: string
  dataHead: TableHeadProps[]
  link: string
  buttonActions: StatusMenuActions[]
  columnsWidth?: string
  removeService?: (applicationId: string, type: ServiceTypeEnum, name?: string) => void
  isLoading?: boolean
}

export function TableRowServices(props: TableRowServicesProps) {
  const {
    type,
    data,
    dataHead,
    columnsWidth = `repeat(${dataHead.length},minmax(0,1fr))`,
    link,
    buttonActions,
    environmentMode,
    removeService,
    isLoading,
  } = props

  const { organizationId, projectId, environmentId } = useParams()
  const navigate = useNavigate()
  const { openModal } = useModal()

  const buttonActionsDefault = [
    {
      iconLeft: <Icon name="icon-solid-play" />,
      iconRight: <Icon name="icon-solid-angle-down" />,
      menusClassName:
        (type && type === ServiceTypeEnum.APPLICATION) || removeService
          ? `border-r border-r-element-light-lighter-500`
          : '',
      statusActions: {
        status: data.status && data.status.state,
        actions: buttonActions,
      },
    },
    {
      ...((type === ServiceTypeEnum.APPLICATION || type === ServiceTypeEnum.CONTAINER) && {
        iconLeft: <Icon name="icon-solid-scroll" />,
        onClick: () => navigate(APPLICATION_LOGS_URL(organizationId, projectId, environmentId, data.id)),
      }),
    },
    {
      ...(removeService && {
        iconLeft: <Icon name="icon-solid-ellipsis-v" />,
        menus: [
          {
            items:
              type === ServiceTypeEnum.APPLICATION
                ? [
                    {
                      name: 'Edit code',
                      contentLeft: <Icon name="icon-solid-code" className="text-sm text-brand-400" />,
                      link: {
                        url: urlCodeEditor((data as GitApplicationEntity).git_repository) || '',
                        external: true,
                      },
                    },
                    {
                      name: 'Deploy other version ',
                      contentLeft: <Icon name={IconAwesomeEnum.CLOCK_ROTATE_LEFT} className="text-sm text-brand-400" />,
                      onClick: () => {
                        openModal({
                          content: (
                            <DeployOtherCommitModalFeature
                              applicationId={data.id}
                              environmentId={environmentId || ''}
                            />
                          ),
                          options: { width: 596 },
                        })
                      },
                    },
                    {
                      name: 'Remove',
                      contentLeft: <Icon name="icon-solid-trash" className="text-sm text-brand-400" />,
                      onClick: () => removeService(data.id, ServiceTypeEnum.APPLICATION, data.name),
                    },
                  ]
                : [
                    {
                      name: 'Remove',
                      contentLeft: <Icon name="icon-solid-trash" className="text-sm text-brand-400" />,
                      onClick: () => removeService(data.id, ServiceTypeEnum.CONTAINER, data.name),
                    },
                  ],
          },
        ],
      }),
    },
  ]

  const buttonActionsDefaultDB = [
    {
      iconLeft: <Icon name="icon-solid-play" />,
      iconRight: <Icon name="icon-solid-angle-down" />,
      menusClassName: removeService ? 'border-r border-r-element-light-lighter-500' : '',
      statusActions: {
        status: data.status && data.status.state,
        actions: buttonActions,
      },
    },
    {
      ...(removeService && {
        iconLeft: <Icon name="icon-solid-ellipsis-v" />,
        menus: [
          {
            items: [
              {
                name: 'Remove',
                contentLeft: <Icon name="icon-solid-trash" className="text-sm text-brand-400" />,
                onClick: () => removeService(data.id, ServiceTypeEnum.DATABASE, data.name),
              },
            ],
          },
        ],
      }),
    },
  ]

  return (
    <TableRow columnsWidth={columnsWidth} link={link}>
      <>
        <div className="flex items-center px-4 gap-1">
          {(data as DatabaseEntity).mode === DatabaseModeEnum.MANAGED ? (
            <Skeleton show={isLoading} width={16} height={16} rounded={true}>
              <StatusChip status={data.status?.state} />
            </Skeleton>
          ) : (
            <Skeleton className="shrink-0" show={isLoading} width={16} height={16}>
              {(data as DatabaseEntity).mode === DatabaseModeEnum.MANAGED ? (
                <StatusChip status={data.status?.state} />
              ) : (
                <StatusChip
                  status={data.running_status?.state || RunningStatus.STOPPED}
                  appendTooltipMessage={
                    data?.running_status?.state === RunningStatus.ERROR
                      ? data.running_status.pods[0]?.state_message
                      : ''
                  }
                />
              )}
            </Skeleton>
          )}
          <div className="ml-2 mr-2">
            <Skeleton className="shrink-0" show={isLoading} width={16} height={16}>
              <Icon name={type === ServiceTypeEnum.DATABASE ? IconEnum.DATABASE : IconEnum.APPLICATION} width="20" />
            </Skeleton>
          </div>
          <Skeleton show={isLoading} width={400} height={16} truncate>
            <span className="text-sm text-text-500 font-medium truncate">{data.name}</span>
          </Skeleton>
        </div>
        <div className="flex justify-end justify-items-center px-3">
          <Skeleton show={isLoading} width={200} height={16}>
            <div className="flex items-center gap-3">
              <p className="flex items-center gap-3 leading-7 text-text-400 text-sm">
                {data.status && data.status.state && <StatusLabel status={data.status && data.status.state} />}
                {data.status?.last_deployment_date && (
                  <span className="text-xs text-text-300 font-medium">
                    {timeAgo(new Date(data.status.last_deployment_date))} ago
                  </span>
                )}
              </p>
              {data.name && (
                <ButtonIconAction
                  actions={type === ServiceTypeEnum.DATABASE ? buttonActionsDefaultDB : buttonActionsDefault}
                  statusInformation={{
                    id: data.id,
                    name: data.name,
                    mode: environmentMode,
                  }}
                  isService
                />
              )}
            </div>
          </Skeleton>
        </div>
        <div className="flex items-center px-4 border-b-element-light-lighter-400 border-l h-full">
          <Skeleton className="w-full" show={isLoading} width={160} height={16}>
            <div className="w-full flex gap-2 items-center -mt-[1px]">
              {type === ServiceTypeEnum.APPLICATION && (
                <TagCommit commitId={(data as GitApplicationEntity).git_repository?.deployed_commit_id} />
              )}
              {type === ServiceTypeEnum.CONTAINER && (
                <Tag className="truncate border border-element-light-lighter-500 text-text-400 font-medium h-7">
                  <span className="block truncate">
                    <Tooltip
                      content={`${(data as ContainerApplicationEntity).image_name}:${
                        (data as ContainerApplicationEntity).tag
                      }`}
                    >
                      <span>
                        {(data as ContainerApplicationEntity).image_name}:{(data as ContainerApplicationEntity).tag}
                      </span>
                    </Tooltip>
                  </span>
                </Tag>
              )}
              {type === ServiceTypeEnum.DATABASE && (
                <span className="block text-xs ml-2 text-text-600 font-medium">{(data as DatabaseEntity).version}</span>
              )}
            </div>
          </Skeleton>
        </div>
        <div className="flex items-center px-4">
          <Skeleton show={isLoading} width={30} height={16}>
            <div className="flex items-center">
              {type === ServiceTypeEnum.DATABASE && (
                <Tooltip content={`${upperCaseFirstLetter((data as DatabaseEntity).mode)}`}>
                  <div>
                    <Icon name={(data as DatabaseEntity).type} width="20" height="20" />
                  </div>
                </Tooltip>
              )}
              {type === ServiceTypeEnum.APPLICATION && (
                <Icon name={(data as GitApplicationEntity).build_mode || ''} width="20" height="20" />
              )}
              {type === ServiceTypeEnum.CONTAINER && <Icon name={IconEnum.CONTAINER} width="20" height="20" />}
            </div>
          </Skeleton>
        </div>
      </>
    </TableRow>
  )
}

export default TableRowServices
