import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

interface ModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
                                         show,
                                         onHide,
                                         title,
                                         children,
                                         size
                                     }) => {
    return (
        <BootstrapModal
            show={show}
            onHide={onHide}
            size={size}
            centered
            className="game-modal"
        >
            <BootstrapModal.Header closeButton className="bg-dark text-light">
                <BootstrapModal.Title>{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body className="bg-dark text-light">
                {children}
            </BootstrapModal.Body>
        </BootstrapModal>
    );
};

export default Modal;