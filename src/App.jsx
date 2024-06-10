import { Provider } from "react-redux";
import Body from "./components/Body";
import appStore from "./utils/appStore";
export default function App() {
  return (
    <Provider store={appStore}>
      <Body />
    </Provider>
  );
}
