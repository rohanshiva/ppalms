import { MemoryRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import Generate from './components/Generate';
import Editor from './components/Editor';
import './App.css';
import GenerationForm from './components/GenerationForm';
import Toast from './components/Toast';

export default function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/generate" component={Generate} />
          <Route path="/select-lines" render={(props: any)=> (<Editor {...props}></Editor>)} />
          <Route path="/form" component={GenerationForm} />
        </Switch>
      </Router>
      <Toast />
    </>
  );
}
