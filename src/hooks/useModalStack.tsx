'use client';
import React, {
  Context,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ModalContextType {
  modalStack: { modal: React.ReactNode; key: string }[];
  push: ({ key, modal }: { key: string; modal: React.ReactNode }) => void;
  pop: () => void;
  clear: () => void;
}

const ModalContext: Context<ModalContextType | undefined> = createContext<
  ModalContextType | undefined
>(undefined);

export const useModalStack = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalStack must be used within a ModalProvider');
  }
  return context;
};

export interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<
    {
      key: string;
      modal: React.ReactNode;
    }[]
  >([]);

  // stack에 모달 추가
  const push = useCallback(
    ({ modal, key }: { modal: React.ReactNode; key: string }) => {
      setModalStack((prevStack) => [...prevStack, { modal, key }]);
    },
    []
  );

  // stack에서 가장 최근의 모달 제거
  const pop = useCallback(() => {
    setModalStack((prevStack) => prevStack.slice(0, -1));
  }, []);

  // stack 초기화
  const clear = useCallback(() => {
    setModalStack([]);
  }, []);

  return (
    <ModalContext.Provider value={{ modalStack, push, pop, clear }}>
      {children}
      {modalStack.map((modal, index) => (
        <React.Fragment key={modal.key + index}>{modal.modal}</React.Fragment>
      ))}
    </ModalContext.Provider>
  );
};
