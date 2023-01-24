import { dateFormatReverse } from "./utils";

describe('dateFormatReverse', () => {
 test('date in format yyyy-mm-dd reversed to dd-mm-yyyy', () => {
   expect(dateFormatReverse('2022-12-25')).toBe('25-12-2022');
 });
 test('date in format dd-mm-yyyy reversed to yyyy-mm-dd', () => {
    expect(dateFormatReverse('25-12-2022')).toBe('2022-12-25');
  });
});