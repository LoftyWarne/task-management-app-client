/* converts data to yyyy-mm-dd or dd-mm-yyyy */
export const dateFormatReverse = (value:string, format:string):string => {

    if (format === 'dateonly'){

      return value.split("-").reverse().join("-");
    
    } else if (format === 'datetime') { 

      return value.split("-").reverse().join("-");

    } else {      
      console.error(`Unrecognised format '${format}' supplied to dateFormatReverse function.`)
      return ""
    }
}
