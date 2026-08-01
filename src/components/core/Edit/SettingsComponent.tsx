import { Settings } from "lucide-react"

const SettingsComponent = ({onClick}: {onClick: () => void}) => {
  return (
    <div className="icon-wrapper" onClick={onClick}>
      <Settings className="icon"/>
    </div>
  )

}

export default SettingsComponent

