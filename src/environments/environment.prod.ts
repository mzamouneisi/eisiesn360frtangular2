
const url = "https://esn360.azurewebsites.net"
// const url = "http://127.0.0.1:8080"
const app = '/esn360/'

export const environment = {
  production: true,
  apiUrl: url + app + 'api',
  divUrl: url + app + 'div',
  extractUrl: url + ':8300',
  urlFront: 'https://mzamouneisi.github.io/eisiesn360frtangular2',
};
