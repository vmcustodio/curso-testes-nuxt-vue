import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from 'axios';
import ProductList from '.';
import ProductCard from '@/components/ProductCard';
import Search from '@/components/Search';
import { makeServer } from '@/miragejs/server';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - integration', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const products = server.createList('product', 10);

    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick(); // retorna uma promise, o await espera até que a promise seja resolvida, com o metodo ele assegura que seja resolvida. o NextTick assegura que os dados foram modificados e renderizar / DOM

    const cards = wrapper.findAllComponents(ProductCard);

    expect(cards).toHaveLength(10);
  });
  it('should display the error message when Promise rejects', async () => {
    // eslint-disable-next-line unicorn/error-message
    axios.get.mockReturnValue(Promise.reject(new Error('')));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Problemas ao carregar a lista');
  });

  it('should filter the product list when a search is performed', async () => {
    // Arrange
    const products = [
      ...server.createList('product', 10),
      server.create('product', {
        title: 'Meu relógio amado',
      }),
      server.create('product', {
        title: 'Meu outro relógio estimado',
      }),
    ];

    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    // Act
    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });
});
