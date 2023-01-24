/* reverses date string yyyy-mm-dd or dd-mm-yyyy */
export const dateFormatReverse = (value:string) => {
      return value.split("-").reverse().join("-");
}
