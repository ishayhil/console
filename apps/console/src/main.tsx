import { AppState, Auth0Provider } from '@auth0/auth0-react'
import { store } from '@console/store/data'
import { createBrowserHistory } from 'history'
import * as ReactDOM from 'react-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { IntercomProvider } from 'react-use-intercom'
import App from './app/app'
import { environment } from './environments/environment'
import './styles.scss'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'

const OAUTH_CALLBACK = '/login/auth0-callback'

export const history = createBrowserHistory()

posthog.init(environment.posthog, {
  api_host: environment.posthog_apihost,
})

const onRedirectCallback = (appState: AppState) => {
  // use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname)
}

ReactDOM.render(
  // <IntercomProvider appId={environment.intercom} autoBoot={process.env['NODE_ENV'] === 'production'
  <IntercomProvider appId={environment.intercom} autoBoot>
    <Auth0Provider
      domain={environment.oauth_domain}
      clientId={environment.oauth_key}
      redirectUri={`${window.location.origin}${OAUTH_CALLBACK}`}
      audience={environment.oauth_audience}
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
      cacheLocation={'localstorage'}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </IntercomProvider>,
  document.getElementById('root') || document.createElement('div')
)
