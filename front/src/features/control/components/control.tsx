import Attributes from './control-attributes';
import ControlButtons from './control-buttons';
import ControlDescription from './control-description';
import ControlForm from './control-form';
import ControlImages from './control-images';

const Control = () => {
  return (
    <div className="control-container">
      <ControlForm />
      <ControlImages />
      <ControlDescription />
      <Attributes />
      <ControlButtons />
    </div>
  );
};

export default Control;
