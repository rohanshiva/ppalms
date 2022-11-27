import { Toaster } from 'react-hot-toast';

/**
 * Toast component is a placeholder. Any toasts that render throughout the app are rendered as children to this parent component.
 * @returns the HTML tree for the placeholder Toast component
 */
function Toast() {
  return <Toaster data-testid="toast" position="top-right" reverseOrder={true} />;
}

export default Toast;
