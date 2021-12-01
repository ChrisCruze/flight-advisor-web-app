import React from "react";
import ReactDOM from "react-dom";
import App from "./App";


import './index.scss'


class MainFrame extends React.Component {
    render() {
        return (
                <App/>
        );
    }
}
ReactDOM.render(<MainFrame />, document.getElementById("root"));
