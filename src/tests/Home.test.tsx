import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from '../pages/Home'

describe('Home Component', () => {
  beforeEach(() => {
    // Mock window.print
    window.print = vi.fn()
  })

  it('should initialize with form and voucher hidden', () => {
    render(<Home />)
    expect(screen.queryByText('Agendar Visita Here')).not.toBeInTheDocument()
    expect(screen.queryByText('Detalles de la Visita')).not.toBeInTheDocument()
  })

  it('should show appointment form when button is clicked', async () => {
    render(<Home />)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    expect(screen.getByText('Agendar Visita Aqui')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
  })

  it('should close form when X button is clicked', async () => {
    render(<Home />)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await userEvent.click(closeButton)
    
    expect(screen.queryByText('Agendar Visita Aqui')).not.toBeInTheDocument()
  })

  it('should validate form fields before submission', async () => {
    render(<Home />)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    const submitButton = screen.getByText('Agendar Visita Final')
    await userEvent.click(submitButton)
    
    // Check that all required fields show validation errors
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      if (input.required) {
        expect(input).toBeInvalid()
      }
    })
  })

  it('should generate voucher with valid data on form submission', async () => {
    render(<Home />)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'John Doe')
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'john@example.com')
    await userEvent.type(screen.getByLabelText('Empresa'), 'Test Company')
    await userEvent.type(screen.getByLabelText('Motivo de la Visita'), 'Business Meeting')
    await userEvent.type(screen.getByLabelText('Persona a Visitar'), 'Jane Smith')
    
    // Set date (today + 1 day)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]
    await userEvent.type(screen.getByLabelText('Fecha de Visita'), dateString)
    
    // Set time
    await userEvent.type(screen.getByLabelText('Hora de Entrada'), '09:00')
    await userEvent.type(screen.getByLabelText('Hora de Salida'), '10:00')
    
    // Submit
    const submitButton = screen.getByText('Agendar Visita Final')
    await userEvent.click(submitButton)
    
    // Check voucher is displayed
    expect(screen.getByText('Detalles de la Visita')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Business Meeting')).toBeInTheDocument()
    
    // Check PIN is generated (6 digits)
    const pinElement = screen.getByText(/\d{6}/)
    expect(pinElement).toBeInTheDocument()
    
    // Check appointment ID is generated
    const idElement = screen.getByText(/ID: [A-Z0-9]{9}/)
    expect(idElement).toBeInTheDocument()
  })

  it('should close voucher when X button is clicked', async () => {
    render(<Home />)
    // First open form and submit (similar to previous test)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    // Fill minimal required fields
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'John Doe')
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'john@example.com')
    await userEvent.type(screen.getByLabelText('Empresa'), 'Test Company')
    await userEvent.type(screen.getByLabelText('Motivo de la Visita'), 'Meeting')
    await userEvent.type(screen.getByLabelText('Persona a Visitar'), 'Host')
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]
    await userEvent.type(screen.getByLabelText('Fecha de Visita'), dateString)
    await userEvent.type(screen.getByLabelText('Hora de Entrada'), '09:00')
    await userEvent.type(screen.getByLabelText('Hora de Salida'), '10:00')
    
    await userEvent.click(screen.getByText('Agendar Visita Final'))
    
    // Now close voucher
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    await userEvent.click(closeButtons[1]) // Second close button is for voucher
    
    expect(screen.queryByText('Detalles de la Visita')).not.toBeInTheDocument()
  })

  it('should call window.print when print button is clicked', async () => {
    render(<Home />)
    // First open form and submit (similar to previous test)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    // Fill minimal required fields
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'John Doe')
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'john@example.com')
    await userEvent.type(screen.getByLabelText('Empresa'), 'Test Company')
    await userEvent.type(screen.getByLabelText('Motivo de la Visita'), 'Meeting')
    await userEvent.type(screen.getByLabelText('Persona a Visitar'), 'Host')
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]
    await userEvent.type(screen.getByLabelText('Fecha de Visita'), dateString)
    await userEvent.type(screen.getByLabelText('Hora de Entrada'), '09:00')
    await userEvent.type(screen.getByLabelText('Hora de Salida'), '10:00')
    
    await userEvent.click(screen.getByText('Agendar Visita Final'))
    
    // Click print button
    await userEvent.click(screen.getByText('Imprimir'))
    
    expect(window.print).toHaveBeenCalled()
  })

  it('should reset form when voucher is closed', async () => {
    render(<Home />)
    const button = screen.getByText('Agendar Visita Here')
    await userEvent.click(button)
    
    // Fill form
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'John Doe')
    await userEvent.type(screen.getByLabelText('Correo Electrónico'), 'john@example.com')
    await userEvent.type(screen.getByLabelText('Empresa'), 'Test Company')
    await userEvent.type(screen.getByLabelText('Motivo de la Visita'), 'Meeting')
    await userEvent.type(screen.getByLabelText('Persona a Visitar'), 'Host')
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateString = tomorrow.toISOString().split('T')[0]
    await userEvent.type(screen.getByLabelText('Fecha de Visita'), dateString)
    await userEvent.type(screen.getByLabelText('Hora de Entrada'), '09:00')
    await userEvent.type(screen.getByLabelText('Hora de Salida'), '10:00')
    
    await userEvent.click(screen.getByText('Agendar Visita Final'))
    
    // Close voucher
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    await userEvent.click(closeButtons[1])
    
    // Open form again
    await userEvent.click(screen.getByText('Agendar Visita Here'))
    
    // Check form is reset
    expect(screen.getByLabelText('Nombre Completo')).toHaveValue('')
    expect(screen.getByLabelText('Correo Electrónico')).toHaveValue('')
  })
})