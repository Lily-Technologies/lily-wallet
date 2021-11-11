// KBC-TODO: Figure out why this wasnt working before
// KBC-TODO: reimplement this component in App.tsx
import React from 'react';
import styled from 'styled-components';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorBoundaryContainer>
          <LilyImage src={require('../assets/flower.svg')} />
          <h1>Oops, something went wrong.</h1>

          <h3>Please <a href="mailto:kaybesee@gmail.com" target="_blank" rel="noopener noreferrer">contact us</a> to report the error.</h3>
        </ErrorBoundaryContainer>
      )
    }

    return this.props.children;
  }
}

const ErrorBoundaryContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LilyImage = styled.img`
  width: 9em;
  height: 9em;
`;