import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import ThemeProvider from './components/ThemeProvider.jsx'
import { store, persistor } from "./redux/store.js";


createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</PersistGate>
)
