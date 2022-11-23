import { ToastContainer } from "react-toastify";
import { wrapper } from "../Redux/Store";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";

function MyApp({ Component, ...other }) {

  const { store, pageProps, ...rest } = wrapper.useWrappedStore(other);

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
