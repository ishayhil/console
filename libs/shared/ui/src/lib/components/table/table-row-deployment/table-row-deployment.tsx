import { DeploymentHistoryApplication, DeploymentHistoryDatabase, StateEnum } from 'qovery-typescript-axios'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ServiceTypeEnum } from '@qovery/shared/enums'
import { ContainerApplicationEntity, DeploymentService } from '@qovery/shared/interfaces'
import { APPLICATION_GENERAL_URL, APPLICATION_URL, DEPLOYMENT_LOGS_URL } from '@qovery/shared/router'
import {
  ButtonIconAction,
  IconAwesomeEnum,
  Skeleton,
  StatusChip,
  TableRow,
  Tag,
  TagCommit,
  Tooltip,
} from '@qovery/shared/ui'
import { renameStatus, timeAgo, trimId, upperCaseFirstLetter } from '@qovery/shared/utils'
import Icon from '../../icon/icon'
import { TableHeadProps } from '../table'

export interface TableRowDeploymentProps {
  data?: DeploymentService | DeploymentHistoryApplication | DeploymentHistoryDatabase
  dataHead: TableHeadProps[]
  columnsWidth?: string
  isLoading?: boolean
  startGroup?: boolean
  noCommit?: boolean
  index?: number
}

export function TableRowDeployment(props: TableRowDeploymentProps) {
  const {
    dataHead,
    columnsWidth = `repeat(${dataHead.length},minmax(0,1fr))`,
    isLoading,
    startGroup,
    data,
    noCommit,
    index,
  } = props

  const [copy, setCopy] = useState(false)
  const [hoverId, setHoverId] = useState(false)
  const { organizationId, projectId, environmentId } = useParams()
  const navigate = useNavigate()

  const buttonActionsDefault = [
    {
      iconLeft: <Icon name={IconAwesomeEnum.SCROLL} />,
      onClick: () => navigate(DEPLOYMENT_LOGS_URL(organizationId, projectId, environmentId)),
    },
  ]

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    setHoverId(true)
    navigator.clipboard.writeText((data as DeploymentService).execution_id || data?.id || '')
    setCopy(true)
    setTimeout(() => {
      setCopy(false)
      setHoverId(false)
    }, 2000)
  }

  return (
    <TableRow
      columnsWidth={columnsWidth}
      className={`border-b last-of-type:border-b-0 bg-white ${startGroup ? 'mt-2' : ''}`}
    >
      <>
        <div className="flex items-center px-4 gap-1">
          <Skeleton show={isLoading} width={150} height={20}>
            <Tooltip content="Copy">
              <p
                onClick={handleCopy}
                onMouseEnter={() => setHoverId(true)}
                onMouseLeave={() => !copy && setHoverId(false)}
                className={`text-xxs font-bold text-text-500 py-0.5 w-16 px-1 inline-flex gap-1 text-center rounded-sm cursor-pointer ${
                  copy ? 'bg-success-500 text-white' : 'bg-element-light-lighter-300'
                }`}
              >
                {hoverId && !copy && (
                  <span className="inline-flex gap-1.5">
                    <Icon name="icon-solid-copy" />
                    <span>Copy ID</span>
                  </span>
                )}
                {!copy && !hoverId && (
                  <span>
                    {(data as DeploymentService).execution_id
                      ? trimId((data as DeploymentService).execution_id || '')
                      : trimId(data?.id || '')}
                  </span>
                )}
                {copy && (
                  <div className="inline-flex gap-1.5">
                    <Icon name="icon-solid-copy" />
                    <span>Copied !</span>
                  </div>
                )}
              </p>
            </Tooltip>
          </Skeleton>
        </div>
        <div className="flex justify-start items-center px-4 gap-2">
          <Skeleton show={isLoading} width={20} height={20} rounded>
            <StatusChip status={data?.status} />
          </Skeleton>
          <Skeleton show={isLoading} width={80} height={20}>
            <p className="text-xs text-text-400 font-medium">
              {data?.status !== StateEnum.RUNNING
                ? upperCaseFirstLetter(data?.status?.replace('_', ' ').toLowerCase())
                : renameStatus(data?.status)}
            </p>
          </Skeleton>
        </div>
        {(data as DeploymentService).type && (
          <div className="px-3">
            <Skeleton show={isLoading} width={120} height={20}>
              <Link to={APPLICATION_URL(organizationId, projectId, environmentId, data?.id) + APPLICATION_GENERAL_URL}>
                <div className="flex items-center">
                  <div className="w-8 text-center">
                    <Icon name={(data as DeploymentService)?.type || ServiceTypeEnum.APPLICATION} className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-text-600 font-medium">{data?.name}</p>
                </div>
              </Link>
            </Skeleton>
          </div>
        )}
        <div className="flex justify-start items-center px-1 gap-2">
          <Skeleton show={isLoading} width={80} height={20}>
            <>
              <p className="flex items-center leading-7 text-text-400 text-sm">
                <span className="text-xs text-text-300 mx-3 font-medium">
                  {timeAgo(data?.updated_at ? new Date(data?.updated_at) : new Date(data?.created_at || ''))} ago
                </span>
              </p>
              {index === 0 && data?.name && !(data as ContainerApplicationEntity)?.image_name && (
                <ButtonIconAction actions={buttonActionsDefault} />
              )}
            </>
          </Skeleton>
        </div>
        {!noCommit && (
          <div className="flex items-center px-4 gap-2 border-element-light-lighter-400 border-l h-full">
            {(data as DeploymentService | DeploymentHistoryApplication)?.commit && (
              <TagCommit commitId={(data as DeploymentService | DeploymentHistoryApplication)?.commit?.git_commit_id} />
            )}
            {(data as ContainerApplicationEntity).image_name && (
              <Tag className="truncate border border-element-light-lighter-500 text-text-400 font-medium h-7">
                <span className="block truncate">
                  <Tooltip
                    side="left"
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
          </div>
        )}
      </>
    </TableRow>
  )
}

export default TableRowDeployment
