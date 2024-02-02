import { render, screen } from '@testing-library/react';
import { VideoRecord } from './VideoRecord';

describe('VideoRecord', () => {
  test('renders video and buttons', () => {
    render(<VideoRecord />);
    const videoElement = screen.getByRole('video');
    const startButton = screen.getByText(/Start recording/i);
    const stopButton = screen.getByText(/Stop recording/i);
    const sliceButton = screen.getByText(/Slice video/i);

    expect(videoElement).toBeInTheDocument();
    expect(startButton).toBeInTheDocument();
    expect(stopButton).toBeInTheDocument();
    expect(sliceButton).toBeInTheDocument();
  });
});