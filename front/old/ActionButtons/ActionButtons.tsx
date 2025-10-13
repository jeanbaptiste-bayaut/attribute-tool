import './ActionButtons.scss';

interface ActionButtonsProps {
  onValidate: () => void;
  onFail: () => void;
  validated: boolean;
  failed: boolean;
}

const ActionButtons = ({
  onValidate,
  onFail,
  validated,
  failed,
}: ActionButtonsProps) => (
  <div className="buttons">
    <button onClick={onValidate} className={validated ? 'validated' : ''}>
      Ok
    </button>
    <button onClick={onFail} className={failed ? 'failed' : ''}>
      Incorrect
    </button>
  </div>
);

export default ActionButtons;
