import React from "react";
import logo from '../../logo.svg';
import '../../App.css';
import { Link } from "react-router-dom";

const Home: React.FC = () => {
	return (
		<div className="App">
		<header className="App-header">
		  <img src={logo} className="App-logo" alt="logo" />
		  <p>
			Edit <code>src/App.tsx</code> and save to reload.
		  </p>
		  <Link to="/chat">
			  <button className="Chat-Button">Go to Chat</button>
		  </Link>
		  <a
			className="App-link"
			href="https://reactjs.org"
			target="_blank"
			rel="noopener noreferrer"
		  >
			Learn React
		  </a>
		</header>
	  </div>
	)
}
export default Home;
