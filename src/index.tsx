import ReactDOM from 'react-dom/client';
import App from './App';
import '@services/index';

import './styles.css';

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

if (module.hot) {
	module.hot.accept('./App', () => {
		const NextApp = require('./App').default;
		root.render(<NextApp />);
	});
}
