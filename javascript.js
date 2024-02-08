let userToken = ''

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
          userToken = await response.json();
          userSchoolData();
        } else {
          console.error('Authentication failed:', response.status, response.statusText);
          alert("The entered login details are invalid!")
        }
      } catch (error) {
        console.error('Error during authentication:', error.message);
      }
    } 
  
    async function userSchoolData() {
      
      const schoolData = {
      query: `{
        user {
          id
          login
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
          const data = await response.json();
          console.log(data);
          document.getElementById('loginPage').style.display = 'none'
          document.getElementById('loggedIn').style.display = 'block'
          document.getElementById('usernameDisplay').innerHTML = 'Logged in as: ' + data.data.user[0].login
          totalXP()
        } else {
          console.error('Authentication failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error during authentication:', error.message);
      }
    }
    async function totalXP () {
      const schoolXp = {
        query: `{
          transaction(where:{
            path:{_regex:"div-01"}
            _and: { _not: { path: { _regex: "piscine" } } }
          }) {
            type
            amount
            path
            }
              
          }`
        }
      
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify(schoolXp)
        };
        try {
          const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', requestOptions);
      
          if (response.status === 200) {
            const data = await response.json();
            let transactions = data.data.transaction
            let sum = 0
            let auditGiven = 0
            let auditReceived = 0
            for (i = 0; i < transactions.length; i++){
              if (transactions[i].type == 'xp'){
                sum += transactions[i].amount
              }else if (transactions[i].type == 'up') {
                auditGiven += transactions[i].amount
              }else if (transactions[i].type == 'down') {
                auditReceived += transactions[i].amount
              }
            }
            var auditRatio = {
              auditDone: (auditGiven / (auditGiven + auditReceived)) * 100,
              auditGotten: (auditReceived / (auditGiven + auditReceived)) * 100
            };
            if (sum >= 1000000) {
              sum = Math.round((sum / 1000000) * 100) / 100 + ' MB'
            }else{
              sum = Math.round( (sum / 1000)* 100) / 100 + ' KB'
            }
            if (auditGiven >= 1000000){
              auditGiven = Math.round((auditGiven / 1000000) * 100) / 100 + ' MB'
            }else{
              auditGiven = Math.round((auditGiven / 1000) * 100) / 100 + ' KB'
            }
            if (auditReceived >= 1000000){
              auditReceived = Math.round((auditReceived / 1000000) * 100) / 100 + ' MB'
            }else{
              auditReceived = Math.round((auditReceived / 1000) * 100) / 100 + ' KB'
            }
            var total = 628,
            buttons = document.querySelector('.buttons'),
            pie = document.querySelector('.pie'),
            activeClass = 'active';
            var numberFixer = function(num){
              var result = ((num * total) / 100);
              return result;
            }
            for(property in auditRatio){
              var newEl = document.createElement('button');
              newEl.innerText = property;
              newEl.setAttribute('data-name', property);
              buttons.appendChild(newEl);
            }
              buttons.addEventListener('click', function(e){
                if(e.target != e.currentTarget){
                  var el = e.target,
                      name = el.getAttribute('data-name');
                  setPieChart(name);
                  setActiveClass(el);
                }
                e.stopPropagation();
              });
            var setPieChart = function(name){
              var number = auditRatio[name],
                  fixedNumber = numberFixer(number),
                  result = fixedNumber + ' ' + total;
              
              pie.style.strokeDasharray = result;
            }
            
            var setActiveClass = function(el) {
              for(var i = 0; i < buttons.children.length; i++) {
                buttons.children[i].classList.remove(activeClass);
                el.classList.add(activeClass);
              }
            }
            setPieChart('auditDone');
            setActiveClass(buttons.children[0]);
            console.log(auditReceived)
            console.log(auditGiven)
            console.log(sum)
            console.log(data);
          document.getElementById('userXp').innerHTML = 'Your total XP is: ' + sum
          document.getElementById('auditDoneXp').innerHTML = 'Your total audits done XP is: ' + auditGiven
          document.getElementById('auditReceivedXp').innerHTML = 'Your total audits received XP is: ' + auditReceived
          } else {
            console.error('Getting XP failed:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error getting XP:', error.message);
        }
    }
    function refreshPage(){
      window.location.reload();
  } 