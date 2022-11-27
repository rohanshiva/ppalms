import { Toaster } from 'react-hot-toast';

function Toast() {
  return <Toaster data-testid="toast" position="top-right" reverseOrder={true} />;
}

export default Toast;
