import { useHistory } from 'react-router-dom';

/**
 * Home component renders a button that navigates user to the FilePicker screen, where they can pick a code file and start the problem set generation flow
 * @returns the HTML tree for the Home component
 */
const Home = () => {
  const history = useHistory();
  return (
    <div>
      <h1 data-testid="title">PPALMS Generator</h1>
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
