import axios from 'axios';

const url = () => {
  if (__DEV__) {
    // return 'http://3.230.166.250'
    return 'https://www.aprdigitaldecor.com'
  } else {
    return 'https://www.aprdigitaldecor.com'
  }
}

class Api {
  constructor() {
    this.url = url();
  }

  async login(username, password) {
    return await axios.post(this.url + '/api/auth/login', {
      email: username,
      password: password
    })
  }

  async validate(token) {
    try {
      return await axios.post(this.url + '/api/auth/me', null, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
    } catch (error) {
      return error      
    }
  }

  async enviarFormulario(token, form, cbOnUpdate) {
    try {
      return await axios.post(this.url + '/api/forms', form, {
        headers: {
          'Authorization': 'Bearer ' + token
        },
        onUploadProgress: function (progressEvent) {
          if (cbOnUpdate) {
            cbOnUpdate(progressEvent);
          }
        },
      })
    } catch (error) {
      return error      
    }
  }
}

export default Api