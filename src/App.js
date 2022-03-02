// import logo from './logo.svg';
import './App.css';
import { UserManager } from './features/user/UserManager';
import Counter from './features/counter/Counter';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Counter />
      </header> */}
      
        <h1 id='header_title'>用户管理中心</h1>
      <UserManager />
    </div>
  );
}

export default App;
