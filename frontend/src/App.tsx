import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Chat from './components/chat/chat';
import Home from './components/home/home';

function App() {
  return (
	<Router>
		<Routes>
			<Route path="/chat" element={<Chat />}/>
			<Route path="/" element={<Home />}/>
		</Routes>
	</Router>
  );
}

export default App;
