import {Screen} from 'utils/constants/screens';

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
        title: 'common.emailSend',
        description: 'common.emailSendDescription',
        buttonText: 'button.goToLogin',
        screenToNavigate: Screen.SIGN_IN,
      } as IAction;
    default:
      return null;
  }
};

export default actions;
