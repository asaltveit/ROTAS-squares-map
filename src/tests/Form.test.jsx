import Form from '../components/Form'
import React from 'react';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock constants
const formTypes = {
    add: 'add',
    update: 'update',
    delete: 'delete',
};

const signInWithIdTokenMock = vi.fn();
const getSessionMock = vi.fn();
const rpcMock = vi.fn();
  
vi.mock('../constants/formTypes', () => ({
    formTypes,
}));

// Mock supabase

vi.mock('../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithIdToken: signInWithIdTokenMock,
            getSession: getSessionMock,
        },
        rpc: rpcMock,
    },
}));

// Mock generateNonce
vi.mock('../utilities/UtilityFunctions.js', () => ({
    generateNonce: () => Promise.resolve(['nonce123', 'hashedNonce123']),
}));
  
  // Mock form components
  vi.mock('./AddForm', () => () => <div>AddForm</div>);
  vi.mock('./UpdateForm', () => () => <div>UpdateForm</div>);
  vi.mock('./FormTypeRadioButtonRow', () => ({ onValueChange }) => (
    <div>
      <button onClick={() => onValueChange('add')}>Add</button>
      <button onClick={() => onValueChange('update')}>Update</button>
      <button onClick={() => onValueChange('delete')}>Delete</button>
    </div>
  ));
  
  // Mock useMapStore
  vi.mock('../store/useMapStore', () => ({
    useMapStore: (sel) => sel({ formSubmitted: false }),
  }));
  
  // Mock GoogleLogin
  vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }) => (
      <button onClick={() => onSuccess({ credential: 'fake-credential' })}>Mock Google Login</button>
    ),
  }));
  
describe('Form component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        signInWithIdTokenMock.mockResolvedValue({ data: {}, error: null });
        getSessionMock.mockResolvedValue({ data: { session: null }, error: null });
        rpcMock.mockImplementation((fn) => {
            if (fn === 'get_fixed_latitudes') return Promise.resolve({ data: ['lat1'], error: null });
            if (fn === 'get_fixed_longitude') return Promise.resolve({ data: ['lon1'], error: null });
            return Promise.resolve({ data: null, error: null });
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders Google login prompt when not authenticated', async () => {
        render(<Form />);
    
        expect(screen.getByText(/Log in to access database/i)).toBeInTheDocument();
        expect(screen.getByText(/Mock Google Login/i)).toBeInTheDocument();
    });

    it('renders AddForm by default and switches to UpdateForm and Delete', async () => {
        render(<Form />);
    
        fireEvent.click(screen.getByText(/Mock Google Login/i));
    
        // Add form shown initially
        await waitFor(() => { // why no i?
          expect(screen.getByText(/AddForm/i)).toBeInTheDocument();
        });
    
        // Switch to update
        fireEvent.click(screen.getByText(/Update/i));
        expect(screen.getByText(/UpdateForm/)).toBeInTheDocument();
    
        // Switch to delete
        fireEvent.click(screen.getByText(/Delete/i));
        expect(screen.getByText(/Coming soon!/i)).toBeInTheDocument();
    });
    
    describe('Google Login', () => {
        it('shows form after Google login', async () => {
            render(<Form />);
    
            fireEvent.click(screen.getByText(/Mock Google Login/i));
    
            await waitFor(() => {
                expect(screen.getByText(/AddForm/)).toBeInTheDocument();
            });
    
            expect(signInWithIdTokenMock).toHaveBeenCalledWith({
                provider: 'google',
                token: 'fake-credential',
                nonce: 'nonce123',
            });
        });
    
        it('handles failed Google sign-in gracefully', async () => {
            // Mock a sign-in error
            signInWithIdTokenMock.mockResolvedValueOnce({
              data: null,
              error: new Error('Sign-in failed'),
            });
          
            render(<Form />);
          
            // Click mock Google Login
            fireEvent.click(screen.getByText(/Mock Google Login/i));
          
            // Expect the form NOT to appear
            await waitFor(() => {
              expect(screen.queryByText(/AddForm/)).not.toBeInTheDocument();
            });
        });
    })
    
    describe('Longitudes and Latitudes', () => {
        it('loads longitudes and latitudes on mount', async () => {
            render(<Form />);
        
            fireEvent.click(screen.getByText(/Mock Google Login/i));
        
            await waitFor(() => {
                expect(rpcMock).toHaveBeenCalledWith('get_fixed_longitude');
                expect(rpcMock).toHaveBeenCalledWith('get_fixed_latitudes');
            });
        });
    
        // TODO: customize the errors
        it('logs error on failed getLatitudes RPC', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            rpcMock.mockImplementation((fn) => {
              if (fn === 'get_fixed_latitudes') {
                return Promise.resolve({ data: null, error: new Error('Lat RPC failed') });
              }
              return Promise.resolve({ data: ['lon1'], error: null });
            });
          
            render(<Form />);
            fireEvent.click(screen.getByText(/Mock Google Login/i));
          
            await waitFor(() => {
              expect(consoleSpy).toHaveBeenCalledWith('getLatitudes error: ', expect.any(Error));
            });
          
            consoleSpy.mockRestore();
        });
    
        it('logs error on failed getLongitudes RPC', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            rpcMock.mockImplementation((fn) => {
              if (fn === 'get_fixed_longitudes') {
                return Promise.resolve({ data: null, error: new Error('Lng RPC failed') });
              }
              return Promise.resolve({ data: ['lon1'], error: null });
            });
          
            render(<Form />);
            fireEvent.click(screen.getByText(/Mock Google Login/i));
          
            await waitFor(() => {
              expect(consoleSpy).toHaveBeenCalledWith('getLongitudes error: ', expect.any(Error));
            });
          
            consoleSpy.mockRestore();
        });
    })
})
