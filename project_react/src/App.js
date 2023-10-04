import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="Header">
        <h1 className="Title">tUwUitter</h1>
      </header>
      <form className="Form">
        <textarea className="Text-area"></textarea>
        <input type="submit" value="Powost" className="Submit-button"/>
      </form>
      <main className="Post-section">
      </main>
    </div>
  );
}
export default App;
