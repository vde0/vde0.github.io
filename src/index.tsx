import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles.css";


window.debug = {};

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);