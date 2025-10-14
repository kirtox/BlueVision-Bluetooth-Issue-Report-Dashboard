import { useState } from 'react';
import { Form, Card } from 'react-bootstrap';

interface AuthModeToggleProps {
    onModeChange: (useMockAuth: boolean) => void;
}

export const AuthModeToggle: React.FC<AuthModeToggleProps> = ({ onModeChange }) => {
    const [useMockAuth, setUseMockAuth] = useState(() => {
        return localStorage.getItem('useMockAuth') === 'true';
    });

    const handleToggle = (checked: boolean) => {
        setUseMockAuth(checked);
        localStorage.setItem('useMockAuth', checked.toString());
        onModeChange(checked);
    };

    return (
        <Card className="mb-3">
            <Card.Body className="py-2">
                <Form.Check
                    type="switch"
                    id="auth-mode-switch"
                    label={useMockAuth ? "Fake log-in mode (Any account)" : "Real log-in mode (A valid account is required)"}
                    checked={useMockAuth}
                    onChange={(e) => handleToggle(e.target.checked)}
                />
                <small className="text-muted">
                    {useMockAuth
                        ? "Connected by a fake account"
                        : "Connected by a valid account"
                    }
                </small>
            </Card.Body>
        </Card>
    );
};