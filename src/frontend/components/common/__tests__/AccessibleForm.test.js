import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AccessibleForm from '../AccessibleForm';

// Using global mocks defined in jest.setup.js

describe('AccessibleForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });

  // Helper to get the root form element
  const getFormElement = () => {
    // Get the Box that has an ID starting with 'form-'
    const formElements = screen.getAllByTestId('mui-box');
    return formElements.find(element => element.id && element.id.startsWith('form-'));
  };
  
  it('renders with default props', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit}>
        <div data-testid="form-content">Form Content</div>
      </AccessibleForm>
    );
    
    expect(screen.getByTestId('form-content')).toBeInTheDocument();
    expect(screen.getByTestId('mui-button')).toHaveTextContent('Submit');
    
    const formElement = getFormElement();
    expect(formElement).toHaveAttribute('aria-busy', 'false');
    expect(formElement).toHaveAttribute('aria-disabled', 'false');
  });
  
  it('calls onSubmit when form is submitted', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit}>
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    // Use the form element for submit
    fireEvent.submit(getFormElement());
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
  
  it('renders with custom submit button text', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit} submitText="Save Changes">
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    expect(screen.getByTestId('mui-button')).toHaveTextContent('Save Changes');
  });
  
  it('shows loading state and disables submit button when loading', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit} loading={true}>
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    const formElement = getFormElement();
    expect(formElement).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('mui-button')).toHaveAttribute('disabled', '');
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    
    // Check the hidden message for screen readers
    expect(screen.getByText('Form submission in progress. Please wait.')).toBeInTheDocument();
    
    // Verify that submitting while loading doesn't call onSubmit
    fireEvent.submit(formElement);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
  
  it('shows disabled state and disables submit button when disabled', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit} disabled={true}>
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    const formElement = getFormElement();
    expect(formElement).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByTestId('mui-button')).toHaveAttribute('disabled', '');
    
    // Check the hidden message for screen readers
    expect(screen.getByText('Form is currently disabled.')).toBeInTheDocument();
    
    // Verify that submitting while disabled doesn't call onSubmit
    fireEvent.submit(formElement);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
  
  it('displays error message when provided', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit} errorMessage="Something went wrong">
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toHaveAttribute('id', 'status-test-id-123');
    
    const formElement = getFormElement();
    expect(formElement).toHaveAttribute('aria-describedby', 'status-test-id-123');
  });
  
  it('displays success message when provided', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit} successMessage="Changes saved successfully">
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    expect(screen.getByText('Changes saved successfully')).toBeInTheDocument();
    expect(screen.getByText('Changes saved successfully')).toHaveAttribute('id', 'status-test-id-123');
    
    const formElement = getFormElement();
    expect(formElement).toHaveAttribute('aria-describedby', 'status-test-id-123');
  });
  
  it('applies custom aria label', () => {
    render(
      <AccessibleForm onSubmit={mockSubmit} ariaLabel="User Registration Form">
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    const formElement = getFormElement();
    expect(formElement).toHaveAttribute('aria-label', 'User Registration Form');
  });
  
  it('applies custom styles via sx prop', () => {
    render(
      <AccessibleForm 
        onSubmit={mockSubmit} 
        sx={{ backgroundColor: 'red', padding: '20px' }}
      >
        <div>Form Content</div>
      </AccessibleForm>
    );
    
    // We can't easily test sx props directly with Testing Library
    // This is a basic check to ensure the Box component is rendered
    expect(getFormElement()).toBeInTheDocument();
  });
}); 