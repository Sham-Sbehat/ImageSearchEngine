import { render, screen, waitFor } from '@testing-library/react';
import { ImageSearch } from '../components/ImageSearch';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mocking the service to control test behavior
jest.mock('../services/imageServiceWithInterceptor', () => ({
  ImageServiceWithInterceptor: {
    getTrendingImages: jest.fn(() =>
      Promise.resolve({
        results: [
          {
            id: '1',
            urls: { small: 'image1.jpg' },
            alt_description: 'Nice image',
            user: { name: 'User1' },
            likes: 5,
          },
        ],
        total_pages: 2,
      })
    ),
    searchImages: jest.fn(() =>
      Promise.resolve({
        results: [],
        total_pages: 1,
      })
    ),
    downloadImage: jest.fn(() => Promise.resolve()),
  },
}));

describe('ImageSearch Component', () => {
  test('renders search input', () => {
    render(<ImageSearch />);
    const input = screen.getByLabelText(/search for image/i);
    expect(input).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<ImageSearch />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  test('user can type in search input', async () => {
    render(<ImageSearch />);
    const input = screen.getByLabelText(/search for image/i);
    await userEvent.type(input, 'flowers');
    expect(input).toHaveValue('flowers');
  });

  test('loads and displays trending image', async () => {
    render(<ImageSearch />);
    await waitFor(() => {
      expect(screen.getByText(/nice image/i)).toBeInTheDocument();
      expect(screen.getByText(/user1/i)).toBeInTheDocument();
    });
  });

  test('shows "Show More" button when there are more pages', async () => {
    render(<ImageSearch />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
    });
  });


});
