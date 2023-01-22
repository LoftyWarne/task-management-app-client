/* converts data to dd/mm/yyyy */
export const dateFormat = (resp:any, tblField:string, format:string) => {
  for (let i = 0; i < resp.length; i++) {

    var dateObj = new Date(resp[i][tblField])

    const d1 = dateObj.getUTCDate();
    const d2 = dateObj.getUTCMonth() + 1;
    const d3 = dateObj.getUTCFullYear();

    if (format === 'dateonly'){     

      const dateArray = [d1, d2, d3]

      for (let i = 0; i < dateArray.length; i++) {
          if (dateArray[i] < 10) {
            dateArray[i] = 0 + dateArray[i]
          }
        }
      
      const newDateRaised = addLeadingZero(dateArray[0],2) + '/' + addLeadingZero(dateArray[1],2) + '/' + dateArray[2]

      resp[i][tblField] = newDateRaised
    
    } else if (format === 'datetime') {             

      const d4 = dateObj.getUTCHours();
      const d5 = dateObj.getUTCMinutes();

      const dateArray = [d1, d2, d3, d4, d5]

      for (let i = 0; i < dateArray.length; i++) {
        if (dateArray[i] < 10) {
          dateArray[i] = 0 + dateArray[i]
        }
      }
      
      const newDateRaised = addLeadingZero(dateArray[0],2) + '/' + addLeadingZero(dateArray[1],2) + '/' + dateArray[2] + ' ' + addLeadingZero(dateArray[3].toString(),2) + ':' + addLeadingZero(dateArray[4],2)

      // @ts-ignore
      resp[i][tblField] = newDateRaised.toLocaleString('en-GB', {timeZone: 'Europe/London'})

    } else {
      console.error(`Unrecognised format '${format}' supplied to dateFormat function.`)
    }
  } 
}


/* converts dd/mm/yyyy string to date format to enable sorting*/
export const formatLot = (value:string, format:string) => {
  if (value && value.trim().length > 0) {
      if (format === 'dateonly') {
        value = value.replace(new RegExp('/','g'), "-");
        var stringData = value.split('_')[0]   
        stringData = stringData.split("-").reverse().join("-");
        const newDate = new Date(stringData)        
        return newDate
      } else if (format === 'datetime') {
        value = value.replace(new RegExp('/','g'), "-");
        var datePart = value.split(' ')[0]
        var timePart = value.split(' ')[1]    
        datePart = datePart.split("-").reverse().join("-");
        const newDate = new Date(datePart + " " + timePart)
        return newDate
      } else {
        console.error(`Unrecognised format '${format}' supplied to formatLot function.`)
      }
  } else if (value === null) {
      return ""
  }
}

/* converts data to yyyy-mm-dd */
export const dateFormatReverse = (value:string, format:string):string => {

    if (format === 'dateonly'){

      return value.split("/").reverse().join("-");
    
    } else if (format === 'datetime') { 

      return value.split("/").reverse().join("-");

    } else {      
      console.error(`Unrecognised format '${format}' supplied to dateFormatReverse function.`)
      return ""
    }
  } 

  function addLeadingZero(num:number|string, size:number) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
