addEventListener('submit', (event) => {
    const loginName = document.getElementById('username').value
    const loginPass = document.getElementById('password').value
    authenticateUser(loginName, loginPass)
    event.preventDefault();})
  
  async function authenticateUser(username, password) {
      const base64Credentials = btoa(`${username}:${password}`);
    
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${base64Credentials}`,
        },
      };
    
      try {
        const response = await fetch('https://01.kood.tech/api/auth/signin', requestOptions);
    
        if (response.status === 200) {
          const token = await response.json();
          userSchoolData(token);
        } else {
          console.error('Authentication failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error during authentication:', error.message);
      }
    } 
  
    async function userSchoolData(userToken) {
      
      const schoolData = {
      query: `{
        result {
          id
          user {
            id
            login
          }
        }
      }`
      }
    
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(schoolData)
      };
    
      try {
        const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', requestOptions);
    
        if (response.status === 200) {
          const token = await response.json();
          console.log(token);
        } else {
          console.error('Authentication failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error during authentication:', error.message);
      }
    }