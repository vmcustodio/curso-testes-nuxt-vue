import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server.js';
import ProductCard from '@/components/ProductCard';
describe('ProductCard - unit', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '23.00',
          image:
            'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        }),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it('should mount the component', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '22.00',
        }),
      },
    });
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Relógio bonito');
    expect(wrapper.text()).toContain('R$22.00');

    console.log(wrapper.classes()); // exibe as classes usadas no componente
    console.log(wrapper.html()); // exibe o html do wrapper (antes do beforeEach, por exemplo a imagem vinha vazia)
  });
});
