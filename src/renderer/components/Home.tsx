import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();
  return (
    <div>
      <h1> PPALMS Generator</h1>
      <button
        onClick={(e) => {
          history.replace('/generate');
        }}
      >
        Generate
      </button>
    </div>
  );
};

export default Home;
