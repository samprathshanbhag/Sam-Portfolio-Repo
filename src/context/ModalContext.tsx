'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openContact = () => {
    setIsContactOpen(true);
    setIsMenuOpen(false); // Close menu if open
  };

  const closeContact = () => setIsContactOpen(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <ModalContext.Provider
      value={{
        isContactOpen,
        openContact,
        closeContact,
        isMenuOpen,
        openMenu,
        closeMenu,
        toggleMenu,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

