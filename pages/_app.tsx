import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { store } from '../redux/app/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <div className='bg-rose-600' hidden></div>
    </Provider>
  )
}

export default MyApp
