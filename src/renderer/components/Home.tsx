import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1> PPALMS Generator</h1>
      <Link to="/generate">
        <button>Generate</button>
      </Link>
    </div>
  );
};

export default Home;