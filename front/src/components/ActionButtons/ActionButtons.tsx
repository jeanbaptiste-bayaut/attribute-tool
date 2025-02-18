import './ActionButtons.scss';

interface ActionButtonsProps {
  onValidate: () => void;
  onFail: () => void;
}

const ActionButtons = ({ onValidate, onFail }: ActionButtonsProps) => (
  <div className="buttons">
    <button onClick={onValidate}>Validate</button>
    <button onClick={onFail}>Fail</button>
  </div>
);

export default ActionButtons;
