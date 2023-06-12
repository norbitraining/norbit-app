import {Screen} from 'utils/constants/screens';
import {ButtonText, Label} from 'utils/text';

interface IAction {
  title: string;
  description: string;
  buttonText: string;
  screenToNavigate: Screen;
}

const actions = ({type}: {type: Screen}): IAction | null => {
  switch (type) {
    case Screen.FORGOT_PASSWORD:
      return {
        title: Label.emailSend,
        description: Label.emailSendDescription,
        buttonText: ButtonText.goToLogin,
        screenToNavigate: Screen.SIGN_IN,
      } as IAction;
    default:
      return null;
  }
};

export default actions;
