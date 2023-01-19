import { ToastContainer } from "react-toastify";
import { wrapper } from "../Redux/Store";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { updateTokens } from "../Utils/Configs/ApiConfigs";

function MyApp({ Component, ...other }) {
  const { store, pageProps, ...rest } = wrapper.useWrappedStore(other);

  useEffect(() => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      updateTokens(JSON.parse(tokens));
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Provider>
    </>
  );
}

export default MyApp;
