import { EnvironmentLogs } from 'qovery-typescript-axios'
import { LogsType } from '@qovery/shared/enums'
import { CopyToClipboard, Tooltip } from '@qovery/shared/ui'
import { dateFullFormat } from '@qovery/shared/utils'

export interface RowProps {
  data: EnvironmentLogs
  index: number
}

export function Row(props: RowProps) {
  const { index, data } = props

  const type = data.type
  const step = data.details?.stage?.step

  const success = step === 'Deployed'
  const error = type === LogsType.ERROR || step === 'DeployedError'

  const indexClassName = `${
    error
      ? 'bg-error-500 text-text-800 group-hover:bg-error-600'
      : success
      ? 'bg-success-500 text-text-800 group-hover:bg-success-600'
      : 'bg-element-light-darker-300 text-text-400 group-hover:bg-element-light-darker-200'
  }`

  const colorsCellClassName = (white?: boolean) =>
    `${
      error
        ? 'text-error-500'
        : success
        ? 'text-success-500'
        : `${white ? 'text-text-200' : 'text-element-light-lighter-700'}`
    }`

  const buildLinkHtml = (content = '') => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
    return content.replace(reg, `<a class="link text-accent2-500" target="_blank" href='$1$2'>$1$2</a>`)
  }

  return (
    <div
      className={`group flex min-h-6 text-xs hover:bg-element-light-darker-400 ${
        error || success ? 'bg-element-light-darker-300' : ''
      } ${error ? 'row-error' : ''}`}
    >
      <div data-testid="index" className={indexClassName}>
        <div className="text-right w-10 h-6 py-1 px-2 font-code">{index + 1}</div>
      </div>
      <div
        data-testid="cell-status"
        className={`py-1 pl-2.5 pr-2 text-xxs font-bold shrink-0 truncate uppercase w-[154px] ${
          success ? 'text-success-400' : error ? 'text-error-500' : 'text-accent2-400'
        }`}
      >
        {step && (
          <Tooltip content={step} align="start">
            <span>
              {step
                .replace(/([A-Z])/g, '_$1')
                .trim()
                .replace('_', '')}
            </span>
          </Tooltip>
        )}
      </div>
      <div data-testid="cell-date" className={`py-1 px-2 font-code shrink-0 w-[154px] ${colorsCellClassName()}`}>
        {dateFullFormat(data.timestamp)}
      </div>
      <div
        data-testid="cell-scope"
        className="py-1 px-2 flex text-accent2-400 font-medium shrink-0 w-[154px] relative after:absolute after:-right-[1px] after:top-1 after:bg-element-light-darker-100 after:w-[1px] after:h-4"
      >
        {data.details?.transmitter?.name && (
          <Tooltip content={data.details?.transmitter?.name || ''}>
            <span className="truncate">{data.details?.transmitter?.name}</span>
          </Tooltip>
        )}
      </div>
      <div
        data-testid="cell-msg"
        className={`py-1 pl-4 pr-6 font-code relative w-[calc(100%-502px)] overflow-hidden ${colorsCellClassName(
          true
        )}`}
      >
        <span
          className="whitespace-pre-wrap truncate break-all"
          dangerouslySetInnerHTML={{
            __html: error ? buildLinkHtml(data.error?.user_log_message) : buildLinkHtml(data.message?.safe_message),
          }}
        />
        <CopyToClipboard
          className="opacity-0 group-hover:opacity-100 text-white !absolute right-2 top-1"
          content={error ? (data.error?.user_log_message as string) : (data.message?.safe_message as string)}
        />
      </div>
    </div>
  )
}

export default Row
