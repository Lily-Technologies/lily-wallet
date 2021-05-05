/* global cy */
import * as React from 'react'
import { mount } from '@cypress/react'
import { networks } from 'bitcoinjs-lib'
import Login from './index'

it('renders learn react link', () => {
  const mockSetEncryptedConfigFile = cy.spy()
  const mockSetPassword = cy.spy()

  mount(<Login 
    currentBitcoinNetwork={networks.bitcoin} 
    encryptedConfigFile={{ file: 'abc123', modifiedTime: 1213 }}
    setEncryptedConfigFile={mockSetEncryptedConfigFile}
    setPassword={mockSetPassword}
    currentBlockHeight={725000} 
    />)
  cy.contains(/learn react/i)
})