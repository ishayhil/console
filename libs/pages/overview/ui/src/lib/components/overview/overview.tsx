import { LayoutPage } from '@console/shared/ui'
import { Organization } from "qovery-typescript-axios";

interface IOverviewProps {
  organization: Organization[]
}

export function Overview(props: IOverviewProps) {
  const { organization } = props

  return (
    <LayoutPage>
      <div>
        <h2 className="text-3xl font-extrabold text-brand-500">Overview</h2>
        <ul className="mt-8">
          {organization.map((organization: Organization) => (
            <li key={organization.id}>{organization.name}</li>
          ))}
        </ul>
      </div>
    </LayoutPage>
  )
}

export default Overview
