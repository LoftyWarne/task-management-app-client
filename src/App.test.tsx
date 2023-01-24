import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App component', () => {
 test('it renders', () => {
   render(<App />);

   expect(screen.getByRole('heading')).toHaveTextContent('Task Management App')

});

})