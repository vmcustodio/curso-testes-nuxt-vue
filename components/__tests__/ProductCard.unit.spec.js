import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server.js';
import ProductCard from '@/components/ProductCard';
import { cartState } from '@/state';

const mountProductCard = () => {
  const product = server.create('product', {
    title: 'Relógio bonito',
    price: '23.00',
    image:
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
  });
  return {
    wrapper: mount(ProductCard, {
      propsData: {
        product,
      },
    }),
    product,
  };
};

describe('ProductCard - unit', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.element).toMatchSnapshot();
  });
  it('should mount the component', () => {
    const { wrapper } = mountProductCard();
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Relógio bonito');
    expect(wrapper.text()).toContain('R$23.00');

    // console.log(wrapper.classes()); // exibe as classes usadas no componente
    // console.log(wrapper.html()); // exibe o html do wrapper (antes do beforeEach, por exemplo a imagem vinha vazia)
  });

  // it('should emit the event addToCart with product object when button gets clicked', async () => {
  //   const { wrapper, product } = mountProductCard();

  //   await wrapper.find('button').trigger('click');

  //   // assert event has been emitted
  //   expect(wrapper.emitted().addToCart).toBeTruthy();

  //   // assert event count
  //   expect(wrapper.emitted().addToCart.length).toBe(1);

  //   // assert event payload
  //   expect(wrapper.emitted().addToCart[0]).toEqual([{ product }]);
  // });
  // it('should add item to cartState on button click', async () => {
  //   const { wrapper } = mountProductCard();

  //   await wrapper.find('button').trigger('click');

  //   expect(cartState.items).toHaveLength(1);
  // });
});
