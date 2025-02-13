import { ClickEvent, MenuItem as Item } from '@szhsin/react-menu'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CopyToClipboard } from '../../copy-to-clipboard/copy-to-clipboard'
import { Truncate } from '../../truncate/truncate'

export interface MenuItemProps {
  name: string
  link?: { url: string; external?: boolean }
  contentLeft?: React.ReactNode
  contentRight?: React.ReactNode
  onClick?: (e: ClickEvent) => void
  copy?: string
  copyTooltip?: string
  containerClassName?: string
  className?: string
  textClassName?: string
  isActive?: boolean
  truncateLimit?: number
}

export function MenuItem(props: MenuItemProps) {
  const {
    name,
    link,
    contentLeft,
    contentRight,
    onClick,
    copy,
    copyTooltip,
    isActive = false,
    textClassName = 'text-text-500',
    className = '',
    containerClassName = '',
    truncateLimit = 34,
  } = props
  const navigate = useNavigate()

  const itemContent = (
    <>
      <div className={`flex items-center truncate ${className}`}>
        {copy && (
          <div onClick={(e) => e.preventDefault()}>
            <CopyToClipboard content={copy} tooltipContent={copyTooltip} className="mr-4 text-text-500" />
          </div>
        )}

        {contentLeft && (
          <span className="mr-3" data-testid="menu-icon">
            {contentLeft}
          </span>
        )}
        <span className={`menu-item__name text-sm font-medium ${textClassName}`}>
          <Truncate text={name} truncateLimit={truncateLimit} />
        </span>
      </div>
      <div className="flex items-center">{contentRight && <span className="ml-3">{contentRight}</span>}</div>
    </>
  )

  if (link?.external) {
    return (
      <Item
        className={`menu-item ${isActive ? 'menu-item--hover' : ''} ${containerClassName}`}
        href={link.url}
        data-testid="menuItem"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e: ClickEvent) => {
          e.syntheticEvent.stopPropagation()
          onClick && onClick(e)
        }}
      >
        {itemContent}
      </Item>
    )
  } else {
    return (
      <Item
        className={`menu-item ${isActive ? 'menu-item--hover' : ''} ${containerClassName}`}
        data-testid="menuItem"
        defaultValue="prod"
        onClick={(e: ClickEvent) => {
          e.syntheticEvent.preventDefault()
          link?.url && navigate(link?.url)
          onClick && onClick(e)
        }}
      >
        {itemContent}
      </Item>
    )
  }
}

export default MenuItem
