import { Link } from 'react-router-dom';
import FilePicker from './FilePicker';


const Generate = () => {
  return (
    <div>
      <Link to="/">
        <button>👈🏿</button>
      </Link>
      <h1>Generate</h1>
      <FilePicker />
    </div>
  );
};

export default Generate;
