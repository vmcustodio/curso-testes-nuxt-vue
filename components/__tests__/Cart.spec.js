import { mount } from '@vue/test-utils';
import Cart from '@/components/Cart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';

describe('Cart', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(Cart);

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should display 2 instances of CartItem when 2 products are provided', () => {
    const products = server.createList('product', 2);
    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
    });

    // console.log(wrapper.text());

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });
});
