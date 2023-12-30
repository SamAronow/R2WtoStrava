const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.running2win.com/Default');
   /*const pageContent = await page.content();
    console.log('Page content:', pageContent);*/
    await page.evaluate(() => {
        const signInLink = document.querySelector('a[href="#modalLogin"]');
        if (signInLink) {
          signInLink.click(); // Click the "sign in" link to navigate
        } else {
          console.error('Sign in link not found.');
        }
      });
    await page.type('#userNameEmail', 'Sam Aronow');
    await page.type('#accountPW', 'Timr2wp75!');
    
    await page.evaluate(() => {
        const span = document.querySelector('span[onclick="login(false);"]');
        span.click();
      });
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

      await page.evaluate(() => {
        const but = document.querySelector('a[data-target="cboMenuRunningLog"]');
        but.click();
      });
      //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

      await page.evaluate(() => {
        const but = document.querySelector('a[href="WorkoutLog.aspx?ag=B7D58E9C-8AFA-4441-A034-AE2AF60E1109"]');
        but.click();
      });
      
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

      const divChildren = await page.$$eval('#divWorkouts > div', (divs) => {
        // Map through each div and extract necessary information or properties
        return divs.map((div) => {
          return {
            // Extract properties or data as needed
            textContent: div.textContent.trim(),
            className: div.className,
            
          };
        });
      });

      runs=addDuplicates(divChildren)
      let choice = "cx" //u,cr,cx
      let index = 3
      let stravaIndex=1 //only important for update
      convert(choice,index,stravaIndex)

      await browser.close();
    } catch (error) {
      console.error('Error:', error);
    }
  })();

  function convert(choice,index,stravaIndex){
    if (choice=="u"){
        update(runs,index,stravaIndex)
      }
      if (choice=="cr"){
        createRun(runs,index)
      }
      if (choice=="cx"){
        createXT(runs,index)
      }
  }

  function addDuplicates(divChildren){
    arr =[]
    var phrase="Community Comments"
   for (var i=0; i<divChildren.length; i++){
        var str = divChildren[i].textContent
        const regex = new RegExp(phrase, 'g');
        const matches = str.match(regex);
        const count = matches ? matches.length : 0;
        if (count==1){
            arr.push(str)
            continue
        }
        dateIndex = str.indexOf(", ")+str.substring(str.indexOf(", ")+1).indexOf(", ")+7
        date= str.substring(0,dateIndex)
        var newStr
        for (var j=0; j<count; j++){
            newStr = date+"\narrow_upward"+str.substring(str.indexOf("Afternoon "),str.indexOf("Community Comments"))+"Community Comments:"
            arr.push(newStr)
            str = str.substring(str.indexOf("Community Comments")+9)
        }
    }
    return arr
  }


  function runPythonFile(file){
    const { exec } = require('child_process');
    const command = 'python /Users/samaronow/Strava/'+file;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Output: ${stdout}`);
    });
  }


function update(runs, index,sindex){
    const publicComments = runs[index].split('Public Comments:')[1].trim();
    const communityIndex = publicComments.indexOf('Community Comments:');
    const desiredComments = publicComments.substring(0, communityIndex).trim();
    const fs = require('fs');

    fs.writeFile('/Users/samaronow/Strava/log.txt', sindex+desiredComments, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
    console.log('Text has been written to the file.');
    });
    runPythonFile('update.py')
}


  function createXT(runs,index){
    const last = runs[index]
    var comments = last.split('Public Comments:')[1].trim();
    const communityIndex = comments.indexOf('Community Comments:');
    comments = comments.substring(0, communityIndex).trim();
    var info = last.split('Public Comments:')[0].trim()
    var date = getDate(info.substring(info.indexOf(",")+2,info.indexOf("arrow_upward")))
    var seconds = getSeconds(info.substring(info.indexOf('Miles in ')+9))
    txt = comments+", TIME: "+seconds+", DATE: "+date+", DIST: 0"
    const fs = require('fs');

    fs.writeFile('/Users/samaronow/Strava/log.txt', txt, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
    console.log('Text has been written to the file.');
    });
   runPythonFile('create.py')
  }

  function createRun(runs,index){
    const last = runs[index]
    var comments = last.split('Public Comments:')[1].trim();
    const communityIndex = comments.indexOf('Community Comments:');
    comments = comments.substring(0, communityIndex).trim();
    var info = last.split('Public Comments:')[0].trim()
    var dist = info.substring(info.indexOf("Miles")-6,info.indexOf("Miles")-1)
    dist = dist.trim()
    var date = getDate(info.substring(info.indexOf(",")+2,info.indexOf("arrow_upward")))
    var seconds = getSeconds(info.substring(info.indexOf('Miles in ')+9))
    txt = comments+", TIME: "+seconds+", DATE: "+date+", DIST: "+dist
    const fs = require('fs');

    fs.writeFile('/Users/samaronow/Strava/log.txt', txt, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
    console.log('Text has been written to the file.');
    });
    runPythonFile('create.py')
  }

  function getSeconds(time){
    if (time.substring(0,2)=="1:"){
        time = time.substring(0,7)
        hours=parseInt(time.substring(0,1))
        time =time.substring(2)
    }
    else{
        if (time.substring(1,2)==":"){
            time= "0"+time
        }
        time = time.substring(0,5)
        hours=0
    }
    minutes=parseInt(time.substring(0,2))
    seconds=parseInt(time.substring(3))
    total = hours*3600+minutes*60+seconds
    if (isNaN(total) | total==0){
        total=1
    }
    return total
  }

function getDate(dateString){
    var month
    switch(dateString.substring(0,dateString.indexOf(" "))){
        case "January":
            month = "01";
          break;
        case "February":
            month = "02";
          break;
        case "March":
            month = "03";
          break;
        case "April":
            month = "04";
          break;
        case "May":
            month = "05";
          break;
        case "June":
            month = "06";
          break;
        case "July":
            month = "07";
          break;
        case "August":
            month = "08";
          break;
        case "September":
            month = "09";
          break;
        case "October":
            month = "10";
          break;
        case "November":
            month = "11";
          break;
        case "December":
            month = "12";
          break;
    } 
    year = dateString.substring(dateString.indexOf(",")+2,dateString.indexOf(",")+6)

    day = dateString.substring(dateString.indexOf(",")-2,dateString.indexOf(","))
    return year+"-"+month+"-"+day+"T12:00:00Z"
}
