import axios from 'axios';

const baseURL = 'http://20.244.56.144/test/companies';

const api = axios.create({
  baseURL,
});

export const getTopProducts = async (company, category, top, minPrice, maxPrice) => {
  try {
    const response = await api.get(`/${company}/categories/${category}/products`, {
      params: { top, minPrice, maxPrice },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
};
