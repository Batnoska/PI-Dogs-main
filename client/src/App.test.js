import { render, screen } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import { Provider } from "react-redux";
import store from "./redux/store/store";

 test('Renderiza la funcion de Crear Perro', () => { 
    render(<Provider store={store}>
      <BrowserRouter><Nav/></BrowserRouter>
    </Provider>);
    const create = screen.getByText("Create Dog");
    expect(create).toBeInTheDocument();
  })
